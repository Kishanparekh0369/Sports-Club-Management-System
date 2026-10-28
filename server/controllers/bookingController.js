const Booking = require('../models/Booking');
const Facility = require('../models/Facility');
const Sport = require('../models/Sport');
const Notification = require('../models/Notification');

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    if (req.query.sport) {
      query.sport = req.query.sport;
    }

    if (req.query.facility) {
      query.facility = req.query.facility;
    }

    if (req.query.date) {
      const searchDate = new Date(req.query.date);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('member', 'name email phone avatar')
      .populate('sport', 'name category image price')
      .populate('facility', 'name courtNumber')
      .sort({ date: -1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in member's bookings
// @route   GET /api/bookings/my
// @access  Private/Member
exports.getMyBookings = async (req, res, next) => {
  try {
    const query = { member: req.user.id };

    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('sport', 'name category image price')
      .populate('facility', 'name courtNumber capacity')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new sport/facility booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { sport: sportId, facility: facilityId, date, startTime, endTime, notes } = req.body;

    if (!sportId || !facilityId || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide sport, facility, date, start time, and end time.'
      });
    }

    // Validate date is not in past
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDay = new Date(bookingDate);
    bookingDay.setHours(0, 0, 0, 0);

    if (bookingDay < today) {
      return res.status(400).json({
        success: false,
        message: 'Booking date cannot be in the past.'
      });
    }

    // Validate times
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: 'Start time must be before end time.'
      });
    }

    // Verify Sport exists & active
    const sport = await Sport.findById(sportId);
    if (!sport || sport.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Selected sport is currently unavailable.'
      });
    }

    // Verify Facility exists, active, and not under maintenance
    const facility = await Facility.findById(facilityId);
    if (!facility || facility.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Selected facility is currently inactive.'
      });
    }

    if (facility.availabilityStatus === 'maintenance') {
      return res.status(400).json({
        success: false,
        message: 'This facility is currently under maintenance. Please select another facility.'
      });
    }

    // ATOMIC CONFLICT CHECK:
    // Check if another active booking exists on the same day for this facility with overlapping time slots
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const conflict = await Booking.findOne({
      facility: facilityId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['confirmed', 'pending'] },
      $and: [
        { startTime: { $lt: endTime } },
        { endTime: { $gt: startTime } }
      ]
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `Conflict detected: Facility '${facility.name}' is already reserved between ${conflict.startTime} and ${conflict.endTime} on this date.`
      });
    }

    // Create booking
    const booking = await Booking.create({
      member: req.user.id,
      sport: sportId,
      facility: facilityId,
      date: bookingDate,
      startTime,
      endTime,
      price: sport.price || 0,
      notes: notes || '',
      status: 'confirmed' // Auto-confirmed in club reservation workflow
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('sport', 'name category image')
      .populate('facility', 'name courtNumber');

    // Notify member
    await Notification.create({
      user: req.user.id,
      title: 'Booking Confirmed',
      message: `Your booking for ${sport.name} at ${facility.name} on ${bookingDate.toISOString().split('T')[0]} (${startTime} - ${endTime}) is confirmed.`,
      type: 'booking',
      link: '/member/my-bookings'
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking: populatedBooking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status (Admin: approve, reject, cancel)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['pending', 'confirmed', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('sport', 'name')
      .populate('facility', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    if (rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }
    await booking.save();

    // Create notification for member
    const statusMsg = status === 'confirmed'
      ? 'Your booking has been approved by the club administrator.'
      : status === 'rejected'
      ? `Your booking was rejected. Reason: ${rejectionReason || 'Facility unavailable'}`
      : `Your booking status changed to ${status}.`;

    await Notification.create({
      user: booking.member,
      title: `Booking Update: ${status.toUpperCase()}`,
      message: statusMsg,
      type: 'booking',
      link: '/member/my-bookings'
    });

    res.status(200).json({
      success: true,
      message: `Booking has been ${status}`,
      booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking (Member cancels their own booking)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private/Member
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ensure member owns this booking
    if (booking.member.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking'
      });
    }

    if (['cancelled', 'rejected'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status}`
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    await Notification.create({
      user: booking.member,
      title: 'Booking Cancelled',
      message: 'Your booking has been successfully cancelled.',
      type: 'booking',
      link: '/member/my-bookings'
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (err) {
    next(err);
  }
};

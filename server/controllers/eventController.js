const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { generateCsv } = require('../utils/csvExporter');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.sport) {
      query.sport = req.query.sport;
    }

    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    const events = await Event.find(query)
      .populate('sport', 'name category image')
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('sport', 'name category image rules')
      .populate('participants.user', 'name email phone');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      sport,
      venue,
      eventDate,
      startTime,
      endTime,
      registrationDeadline,
      capacity,
      image,
      prizePool,
      registrationFee,
      status
    } = req.body;

    const event = await Event.create({
      title,
      description,
      sport,
      venue,
      eventDate,
      startTime: startTime || '09:00',
      endTime: endTime || '17:00',
      registrationDeadline,
      capacity: Number(capacity) || 30,
      image: image || undefined,
      prizePool: prizePool || '$1,000 Trophy & Medals',
      registrationFee: Number(registrationFee) || 0,
      status: status || 'upcoming',
      participants: []
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private/Member
exports.registerEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check status
    if (event.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: `Registration is closed because this event is ${event.status}.`
      });
    }

    // Check deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed for this event.'
      });
    }

    // Check if member already registered
    const alreadyRegistered = event.participants.some(
      p => p.user.toString() === req.user.id.toString() && p.status !== 'cancelled'
    );
    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event.'
      });
    }

    // Check capacity
    const activeParticipantsCount = event.participants.filter(p => p.status !== 'cancelled').length;
    if (activeParticipantsCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is fully booked. No seats remaining.'
      });
    }

    // Add member
    event.participants.push({
      user: req.user.id,
      registeredAt: new Date(),
      status: 'registered'
    });

    await event.save();

    // Create notification
    await Notification.create({
      user: req.user.id,
      title: 'Tournament Registration Confirmed',
      message: `You have successfully registered for ${event.title} at ${event.venue}.`,
      type: 'event',
      link: '/member/events'
    });

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
// @access  Private/Member
exports.cancelEventRegistration = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const participantIndex = event.participants.findIndex(
      p => p.user.toString() === req.user.id.toString() && p.status !== 'cancelled'
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You do not have an active registration for this event.'
      });
    }

    // Mark as cancelled
    event.participants[participantIndex].status = 'cancelled';
    await event.save();

    await Notification.create({
      user: req.user.id,
      title: 'Event Registration Cancelled',
      message: `Your registration for ${event.title} has been cancelled.`,
      type: 'event',
      link: '/member/events'
    });

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
      event
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export event participants as CSV
// @route   GET /api/events/:id/export
// @access  Private/Admin
exports.exportParticipantsCSV = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('participants.user', 'name email phone');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const headers = [
      { label: 'Participant Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'phone' },
      { label: 'Registered Date', key: 'registeredAt' },
      { label: 'Status', key: 'status' }
    ];

    const rows = event.participants.map(p => ({
      name: p.user ? p.user.name : 'Unknown User',
      email: p.user ? p.user.email : 'N/A',
      phone: p.user ? p.user.phone : 'N/A',
      registeredAt: p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : 'N/A',
      status: p.status
    }));

    const csvData = generateCsv(headers, rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="participants-${event._id}.csv"`);
    res.status(200).send(csvData);
  } catch (err) {
    next(err);
  }
};

const Facility = require('../models/Facility');
const Booking = require('../models/Booking');

// @desc    Get all facilities
// @route   GET /api/facilities
// @access  Public
exports.getAllFacilities = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.sport) {
      query.sport = req.query.sport;
    }

    if (req.query.status) {
      query.status = req.query.status;
    } else if (!req.query.all) {
      query.status = 'active';
    }

    if (req.query.availabilityStatus) {
      query.availabilityStatus = req.query.availabilityStatus;
    }

    const facilities = await Facility.find(query)
      .populate('sport', 'name category image')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: facilities.length,
      facilities
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single facility
// @route   GET /api/facilities/:id
// @access  Public
exports.getFacilityById = async (req, res, next) => {
  try {
    const facility = await Facility.findById(req.params.id).populate('sport', 'name category image');
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.status(200).json({
      success: true,
      facility
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create facility
// @route   POST /api/facilities
// @access  Private/Admin
exports.createFacility = async (req, res, next) => {
  try {
    const { name, description, sport, sportName, capacity, courtNumber, openingHours, availabilityStatus, status, image } = req.body;

    const facility = await Facility.create({
      name,
      description,
      sport: sport || null,
      sportName: sportName || 'General',
      capacity: Number(capacity) || 10,
      courtNumber: courtNumber || 'Court 1',
      openingHours: openingHours || { start: '06:00', end: '22:00' },
      availabilityStatus: availabilityStatus || 'available',
      status: status || 'active',
      image: image || undefined
    });

    res.status(201).json({
      success: true,
      message: 'Facility created successfully',
      facility
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update facility
// @route   PUT /api/facilities/:id
// @access  Private/Admin
exports.updateFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Facility updated successfully',
      facility
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete facility
// @route   DELETE /api/facilities/:id
// @access  Private/Admin
exports.deleteFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Check existing active bookings
    const activeBookings = await Booking.countDocuments({
      facility: facility._id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete facility with ${activeBookings} active booking(s). Please mark as under maintenance or deactivate.`
      });
    }

    await facility.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Facility deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

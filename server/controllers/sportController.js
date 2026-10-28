const Sport = require('../models/Sport');
const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Get all sports
// @route   GET /api/sports
// @access  Public
exports.getAllSports = async (req, res, next) => {
  try {
    const query = {};

    // Filter by category
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Filter by status (public view defaults to active)
    if (req.query.status) {
      query.status = req.query.status;
    } else if (!req.query.all) {
      query.status = 'active';
    }

    // Search by name
    if (req.query.search) {
      query.name = new RegExp(req.query.search, 'i');
    }

    const sports = await Sport.find(query)
      .populate('coaches', 'name specialization experience photo rating')
      .populate('facilities', 'name courtNumber capacity availabilityStatus')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: sports.length,
      sports
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single sport
// @route   GET /api/sports/:id
// @access  Public
exports.getSportById = async (req, res, next) => {
  try {
    const sport = await Sport.findById(req.params.id)
      .populate('coaches', 'name email specialization experience bio photo rating certifications')
      .populate('facilities', 'name description courtNumber capacity openingHours availabilityStatus');

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Sport not found'
      });
    }

    res.status(200).json({
      success: true,
      sport
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new sport
// @route   POST /api/sports
// @access  Private/Admin
exports.createSport = async (req, res, next) => {
  try {
    const { name, category, description, image, price, capacity, facilities, coaches, rules, amenities, status } = req.body;

    const existing = await Sport.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A sport with this name already exists'
      });
    }

    const sport = await Sport.create({
      name,
      category,
      description,
      image,
      price: Number(price) || 0,
      capacity: Number(capacity) || 10,
      facilities: facilities || [],
      coaches: coaches || [],
      rules: Array.isArray(rules) ? rules : (rules ? rules.split('\n').filter(Boolean) : []),
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split('\n').filter(Boolean) : []),
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Sport created successfully',
      sport
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update sport
// @route   PUT /api/sports/:id
// @access  Private/Admin
exports.updateSport = async (req, res, next) => {
  try {
    let sport = await Sport.findById(req.params.id);
    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Sport not found'
      });
    }

    // Check duplicate name
    if (req.body.name && req.body.name !== sport.name) {
      const existing = await Sport.findOne({ name: req.body.name, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Another sport with this name already exists'
        });
      }
    }

    const updateData = { ...req.body };
    if (typeof updateData.rules === 'string') {
      updateData.rules = updateData.rules.split('\n').filter(Boolean);
    }
    if (typeof updateData.amenities === 'string') {
      updateData.amenities = updateData.amenities.split('\n').filter(Boolean);
    }

    sport = await Sport.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Sport updated successfully',
      sport
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete or deactivate sport safely
// @route   DELETE /api/sports/:id
// @access  Private/Admin
exports.deleteSport = async (req, res, next) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) {
      return res.status(404).json({
        success: false,
        message: 'Sport not found'
      });
    }

    // Check if there are active bookings or upcoming events
    const activeBookings = await Booking.countDocuments({
      sport: sport._id,
      status: { $in: ['pending', 'confirmed'] }
    });

    const activeEvents = await Event.countDocuments({
      sport: sport._id,
      status: 'upcoming'
    });

    if (activeBookings > 0 || activeEvents > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete sport because it has ${activeBookings} active booking(s) and ${activeEvents} upcoming event(s). Please deactivate it instead.`
      });
    }

    await sport.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sport deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

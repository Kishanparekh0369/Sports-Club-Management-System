const Coach = require('../models/Coach');

// @desc    Get all coaches
// @route   GET /api/coaches
// @access  Public
exports.getAllCoaches = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    } else if (!req.query.all) {
      query.status = 'active';
    }

    if (req.query.sport) {
      query.sports = req.query.sport;
    }

    const coaches = await Coach.find(query)
      .populate('sports', 'name category image')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: coaches.length,
      coaches
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get coach by ID
// @route   GET /api/coaches/:id
// @access  Public
exports.getCoachById = async (req, res, next) => {
  try {
    const coach = await Coach.findById(req.params.id).populate('sports', 'name category image');
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.status(200).json({
      success: true,
      coach
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create coach
// @route   POST /api/coaches
// @access  Private/Admin
exports.createCoach = async (req, res, next) => {
  try {
    const { name, email, phone, specialization, experience, bio, photo, sports, certifications, status } = req.body;

    const coach = await Coach.create({
      name,
      email,
      phone,
      specialization,
      experience: Number(experience) || 0,
      bio,
      photo: photo || undefined,
      sports: sports || [],
      certifications: Array.isArray(certifications) ? certifications : (certifications ? certifications.split('\n').filter(Boolean) : []),
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Coach added successfully',
      coach
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update coach
// @route   PUT /api/coaches/:id
// @access  Private/Admin
exports.updateCoach = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (typeof updateData.certifications === 'string') {
      updateData.certifications = updateData.certifications.split('\n').filter(Boolean);
    }

    const coach = await Coach.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coach updated successfully',
      coach
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete coach
// @route   DELETE /api/coaches/:id
// @access  Private/Admin
exports.deleteCoach = async (req, res, next) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    await coach.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Coach deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

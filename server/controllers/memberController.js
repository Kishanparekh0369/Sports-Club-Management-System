const User = require('../models/User');
const Booking = require('../models/Booking');
const Membership = require('../models/Membership');

// @desc    Get all members with search, filter, and pagination
// @route   GET /api/members
// @access  Private/Admin
exports.getMembers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};

    // Filter by role if specified, default to member or allow any
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filter by status (active/inactive)
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Search by name or email or phone
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const total = await User.countDocuments(query);
    const members = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: members.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      members
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single member details with activity
// @route   GET /api/members/:id
// @access  Private/Admin
exports.getMemberById = async (req, res, next) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Fetch related bookings and membership
    const bookings = await Booking.find({ member: member._id })
      .populate('sport', 'name category image')
      .populate('facility', 'name courtNumber')
      .sort({ date: -1 })
      .limit(10);

    const memberships = await Membership.find({ user: member._id })
      .populate('plan')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      member,
      bookings,
      memberships
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create member by admin
// @route   POST /api/members
// @access  Private/Admin
exports.createMember = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, status } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const member = await User.create({
      name,
      email,
      phone,
      password: password || 'Member@12345',
      role: role || 'member',
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      member
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update member details by admin
// @route   PUT /api/members/:id
// @access  Private/Admin
exports.updateMember = async (req, res, next) => {
  try {
    const { name, email, phone, role, status, bio } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const emailUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (emailUser) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another user.'
        });
      }
    }

    const member = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, status, bio },
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      member
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update member active/inactive status
// @route   PATCH /api/members/:id/status
// @access  Private/Admin
exports.updateMemberStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active or inactive.'
      });
    }

    const member = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Member status updated to ${status}`,
      member
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update member profile (by authenticated member)
// @route   PUT /api/members/profile/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, avatar } = req.body;

    // Prevent privilege escalation - do not allow changing role or status here!
    const member = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, bio, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: member
    });
  } catch (err) {
    next(err);
  }
};

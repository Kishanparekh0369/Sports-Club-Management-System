const Announcement = require('../models/Announcement');

// @desc    Get announcements
// @route   GET /api/announcements
// @access  Public / Member / Admin
exports.getAnnouncements = async (req, res, next) => {
  try {
    const query = {};

    // If not admin, filter to published and non-expired
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isAdmin) {
      query.status = 'published';
      query.$or = [
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } }
      ];
      if (req.user) {
        query.audience = { $in: ['all', 'members'] };
      } else {
        query.audience = 'all';
      }
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, audience, priority, status, expiresAt } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      audience: audience || 'all',
      priority: priority || 'medium',
      status: status || 'published',
      expiresAt: expiresAt || null,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      announcement
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      announcement
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

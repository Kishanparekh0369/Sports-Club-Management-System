const MembershipPlan = require('../models/MembershipPlan');
const Membership = require('../models/Membership');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// @desc    Get all membership plans
// @route   GET /api/membership-plans
// @access  Public
exports.getPlans = async (req, res, next) => {
  try {
    const query = {};
    if (!req.query.all) {
      query.status = 'active';
    }

    const plans = await MembershipPlan.find(query).sort({ durationMonths: 1 });
    res.status(200).json({
      success: true,
      count: plans.length,
      plans
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create membership plan
// @route   POST /api/membership-plans
// @access  Private/Admin
exports.createPlan = async (req, res, next) => {
  try {
    const { name, tagline, durationMonths, price, benefits, badge, isPopular, status } = req.body;

    const plan = await MembershipPlan.create({
      name,
      tagline,
      durationMonths: Number(durationMonths) || 1,
      price: Number(price) || 0,
      benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split('\n').filter(Boolean) : []),
      badge: badge || '',
      isPopular: isPopular || false,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Membership plan created successfully',
      plan
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update membership plan
// @route   PUT /api/membership-plans/:id
// @access  Private/Admin
exports.updatePlan = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (typeof updateData.benefits === 'string') {
      updateData.benefits = updateData.benefits.split('\n').filter(Boolean);
    }

    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Plan updated successfully',
      plan
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete membership plan
// @route   DELETE /api/membership-plans/:id
// @access  Private/Admin
exports.deletePlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Check active memberships on this plan
    const activeCount = await Membership.countDocuments({
      plan: plan._id,
      status: 'active'
    });

    if (activeCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete plan with ${activeCount} active subscriber(s). Please deactivate the plan instead.`
      });
    }

    await plan.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Plan deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in member's current active membership & history
// @route   GET /api/memberships/my
// @access  Private/Member
exports.getMyMembership = async (req, res, next) => {
  try {
    const now = new Date();

    // Check existing active membership
    let currentMembership = await Membership.findOne({
      user: req.user.id,
      status: 'active',
      endDate: { $gte: now }
    }).populate('plan');

    // If an active membership's endDate has passed, update status to expired
    if (!currentMembership) {
      const expiredMembership = await Membership.findOne({
        user: req.user.id,
        status: 'active',
        endDate: { $lt: now }
      });
      if (expiredMembership) {
        expiredMembership.status = 'expired';
        await expiredMembership.save();
      }
    }

    const history = await Membership.find({ user: req.user.id })
      .populate('plan')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      currentMembership: currentMembership || null,
      history
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all memberships (Admin)
// @route   GET /api/memberships
// @access  Private/Admin
exports.getAllMemberships = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    const memberships = await Membership.find(query)
      .populate('user', 'name email phone avatar')
      .populate('plan', 'name durationMonths price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: memberships.length,
      memberships
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Demo checkout and membership subscription
// @route   POST /api/memberships/checkout
// @access  Private/Member
exports.checkoutMembership = async (req, res, next) => {
  try {
    const { planId, paymentMethod } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a membership plan'
      });
    }

    const plan = await MembershipPlan.findById(planId);
    if (!plan || plan.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Selected membership plan is invalid or inactive'
      });
    }

    // SERVER-SIDE CALCULATION: Never trust price from frontend
    const amount = plan.price;
    const durationMonths = plan.durationMonths;

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);

    // Generate unique payment reference
    const paymentReference = `PAY-MEM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Payment record
    const payment = await Payment.create({
      paymentReference,
      member: req.user.id,
      amount,
      currency: 'USD',
      date: new Date(),
      paymentMethod: paymentMethod || 'Credit Card (Demo)',
      type: 'membership',
      relatedId: plan._id,
      description: `${plan.name} Membership (${durationMonths} month${durationMonths > 1 ? 's' : ''})`,
      status: 'completed',
      isDemo: true
    });

    // Mark previous active memberships as expired/replaced
    await Membership.updateMany(
      { user: req.user.id, status: 'active' },
      { status: 'expired' }
    );

    // Create Membership
    const membership = await Membership.create({
      user: req.user.id,
      plan: plan._id,
      planName: plan.name,
      startDate,
      endDate,
      pricePaid: amount,
      status: 'active',
      paymentReference
    });

    // Create notification
    await Notification.create({
      user: req.user.id,
      title: 'Membership Activated!',
      message: `Congratulations! Your ${plan.name} has been activated and is valid until ${endDate.toISOString().split('T')[0]}.`,
      type: 'membership',
      link: '/member/membership'
    });

    res.status(201).json({
      success: true,
      message: 'Payment verified and membership activated successfully!',
      membership,
      payment
    });
  } catch (err) {
    next(err);
  }
};

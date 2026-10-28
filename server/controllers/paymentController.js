const Payment = require('../models/Payment');

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
exports.getAllPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.type && req.query.type !== 'All') {
      query.type = req.query.type;
    }

    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    if (req.query.search) {
      query.paymentReference = new RegExp(req.query.search, 'i');
    }

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('member', 'name email phone avatar')
      .sort({ date: -1 })
      .skip(startIndex)
      .limit(limit);

    // Calculate total revenue
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      totalRevenue,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      payments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in member's payments
// @route   GET /api/payments/my
// @access  Private/Member
exports.getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ member: req.user.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single payment receipt
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('member', 'name email phone');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Verify ownership if not admin
    if (payment.member._id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Execute demo checkout
// @route   POST /api/payments/demo-checkout
// @access  Private
exports.demoCheckout = async (req, res, next) => {
  try {
    const { amount, type, description, relatedId, paymentMethod } = req.body;

    if (!amount || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide payment amount and type'
      });
    }

    const paymentReference = `PAY-DEMO-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await Payment.create({
      paymentReference,
      member: req.user.id,
      amount: Number(amount),
      currency: 'USD',
      paymentMethod: paymentMethod || 'Credit Card (Demo)',
      type,
      relatedId: relatedId || null,
      description: description || 'Club service demo payment',
      status: 'completed',
      isDemo: true
    });

    res.status(201).json({
      success: true,
      message: 'Demo payment processed successfully',
      payment
    });
  } catch (err) {
    next(err);
  }
};

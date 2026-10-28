const express = require('express');
const router = express.Router();
const {
  getAllPayments,
  getMyPayments,
  getPaymentById,
  demoCheckout
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyPayments);
router.post('/demo-checkout', protect, demoCheckout);
router.get('/:id', protect, getPaymentById);

// Admin route
router.get('/', protect, authorize('admin'), getAllPayments);

module.exports = router;

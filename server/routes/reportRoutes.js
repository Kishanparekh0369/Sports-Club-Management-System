const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getMemberReport,
  getBookingReport,
  getPaymentReport,
  getSportReport
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/members', getMemberReport);
router.get('/bookings', getBookingReport);
router.get('/payments', getPaymentReport);
router.get('/sports', getSportReport);

module.exports = router;

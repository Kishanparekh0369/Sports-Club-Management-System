const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getMyBookings,
  createBooking,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyBookings);
router.post('/', protect, createBooking);
router.patch('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);
router.patch('/:id/status', protect, authorize('admin'), updateBookingStatus);

module.exports = router;

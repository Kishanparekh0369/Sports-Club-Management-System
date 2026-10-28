const express = require('express');
const router = express.Router();
const {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getMyMembership,
  getAllMemberships,
  checkoutMembership
} = require('../controllers/membershipController');
const { protect, authorize } = require('../middleware/auth');

// Public plans
router.get('/plans', getPlans);

// Member routes
router.get('/my', protect, getMyMembership);
router.post('/checkout', protect, checkoutMembership);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllMemberships);
router.post('/plans', protect, authorize('admin'), createPlan);
router.put('/plans/:id', protect, authorize('admin'), updatePlan);
router.delete('/plans/:id', protect, authorize('admin'), deletePlan);

module.exports = router;

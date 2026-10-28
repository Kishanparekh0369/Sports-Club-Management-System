const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  updateMemberStatus,
  updateProfile
} = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

// Self profile update
router.put('/profile/me', protect, updateProfile);

// Admin routes
router.use(protect, authorize('admin'));
router.route('/')
  .get(getMembers)
  .post(createMember);

router.route('/:id')
  .get(getMemberById)
  .put(updateMember);

router.patch('/:id/status', updateMemberStatus);

module.exports = router;

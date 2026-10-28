const express = require('express');
const router = express.Router();
const {
  getAllCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach
} = require('../controllers/coachController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAllCoaches)
  .post(protect, authorize('admin'), createCoach);

router.route('/:id')
  .get(getCoachById)
  .put(protect, authorize('admin'), updateCoach)
  .delete(protect, authorize('admin'), deleteCoach);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport
} = require('../controllers/sportController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAllSports)
  .post(protect, authorize('admin'), createSport);

router.route('/:id')
  .get(getSportById)
  .put(protect, authorize('admin'), updateSport)
  .delete(protect, authorize('admin'), deleteSport);

module.exports = router;

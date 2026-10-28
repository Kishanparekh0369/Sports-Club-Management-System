const express = require('express');
const router = express.Router();
const {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility
} = require('../controllers/facilityController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAllFacilities)
  .post(protect, authorize('admin'), createFacility);

router.route('/:id')
  .get(getFacilityById)
  .put(protect, authorize('admin'), updateFacility)
  .delete(protect, authorize('admin'), deleteFacility);

module.exports = router;

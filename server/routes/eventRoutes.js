const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerEvent,
  cancelEventRegistration,
  exportParticipantsCSV
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAllEvents)
  .post(protect, authorize('admin'), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, authorize('admin'), updateEvent)
  .delete(protect, authorize('admin'), deleteEvent);

router.post('/:id/register', protect, authorize('member', 'admin'), registerEvent);
router.delete('/:id/register', protect, authorize('member', 'admin'), cancelEventRegistration);
router.get('/:id/export', protect, authorize('admin'), exportParticipantsCSV);

module.exports = router;

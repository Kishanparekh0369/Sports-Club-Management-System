const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  updateContactStatus
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/', protect, authorize('admin'), getContacts);
router.patch('/:id/status', protect, authorize('admin'), updateContactStatus);

module.exports = router;

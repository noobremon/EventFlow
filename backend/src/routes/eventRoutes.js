const express = require('express');
const router = express.Router();
const {
  createEvent,
  getOrganizerEvents,
  getEventById,
  updateEvent,
  changeEventStatus,
  getPublicEvent,
  exportEventCSV,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Public route — must be before /:id to avoid slug/id conflict
router.get('/public/:slug', getPublicEvent);

// Protected routes
router.use(protect);
router.post('/', validate(['title', 'dateTime', 'capacity']), createEvent);
router.get('/', getOrganizerEvents);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.patch('/:id/status', validate(['status']), changeEventStatus);
router.get('/:id/export-csv', exportEventCSV);

module.exports = router;

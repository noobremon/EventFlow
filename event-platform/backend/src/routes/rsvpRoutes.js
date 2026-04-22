const express = require('express');
const router = express.Router();
const { register, getEventAttendees, changeRSVPStatus } = require('../controllers/rsvpController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Public — attendee registration
router.post('/register/:slug', validate(['name', 'email']), register);

// Protected — organizer actions
router.get('/event/:eventId', protect, getEventAttendees);
router.patch('/:rsvpId/status', protect, validate(['status']), changeRSVPStatus);

module.exports = router;

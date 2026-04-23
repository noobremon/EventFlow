const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/signup', validate(['name', 'email', 'password']), signup);
router.post('/login', validate(['email', 'password']), login);
router.get('/me', protect, getMe);

module.exports = router;

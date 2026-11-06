const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  getMentors,
  forgotPassword,
  resetPasswordWithOtp
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordWithOtp);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/mentors', getMentors);

module.exports = router;

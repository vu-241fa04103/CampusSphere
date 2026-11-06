const express = require('express');
const router = express.Router();
const {
  requestSession,
  getMySessions,
  updateSessionStatus,
  cancelSession,
  submitFeedback
} = require('../controllers/mentorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, requestSession);
router.get('/my-sessions', protect, getMySessions);
router.patch('/:id/status', protect, updateSessionStatus);
router.delete('/:id', protect, cancelSession);
router.post('/:id/feedback', protect, submitFeedback);

module.exports = router;

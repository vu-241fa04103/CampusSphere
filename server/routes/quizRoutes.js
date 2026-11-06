const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  submitQuiz,
  getSubmissions,
  toggleQuiz
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getQuizzes)
  .post(protect, createQuiz);

router.route('/:id')
  .get(protect, getQuizById);

router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/submissions', protect, getSubmissions);
router.patch('/:id/toggle', protect, toggleQuiz);

module.exports = router;

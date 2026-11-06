const express = require('express');
const router = express.Router();
const {
  getDoubts,
  getDoubtById,
  createDoubt,
  addAnswer,
  toggleResolve,
  upvoteDoubt,
  deleteDoubt,
  getMentorDoubts,
  getFacultyDoubts,
  getFacultyList
} = require('../controllers/doubtController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getDoubts)
  .post(protect, createDoubt);

// Specific inbox & lookup routes (must be before :id)
router.get('/mentor-inbox', protect, getMentorDoubts);
router.get('/faculty-inbox', protect, getFacultyDoubts);
router.get('/faculty-list', protect, getFacultyList);

router.route('/:id')
  .get(getDoubtById)
  .delete(protect, deleteDoubt);

router.post('/:id/answers', protect, addAnswer);
router.patch('/:id/resolve', protect, toggleResolve);
router.post('/:id/upvote', protect, upvoteDoubt);

module.exports = router;

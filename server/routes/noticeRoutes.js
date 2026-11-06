const express = require('express');
const router = express.Router();
const {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePin
} = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getNotices)
  .post(protect, createNotice);

router.route('/:id')
  .put(protect, updateNotice)
  .delete(protect, deleteNotice);

router.patch('/:id/pin', protect, togglePin);

module.exports = router;

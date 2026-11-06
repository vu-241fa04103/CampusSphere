const express = require('express');
const router = express.Router();
const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  upvoteResource,
  incrementDownload
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getResources)
  .post(protect, createResource);

router.route('/:id')
  .get(getResourceById)
  .put(protect, updateResource)
  .delete(protect, deleteResource);

router.post('/:id/upvote', protect, upvoteResource);
router.post('/:id/download', incrementDownload);

module.exports = router;

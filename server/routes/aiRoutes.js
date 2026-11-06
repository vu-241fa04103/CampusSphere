const express = require('express');
const router = express.Router();
const { askChatbot } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, askChatbot);

module.exports = router;

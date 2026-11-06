const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Notice content is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['Exam Notification', 'Academic Notice', 'Lab Timetable', 'General', 'Holiday', 'Result'],
      default: 'General'
    },
    department: {
      type: String,
      default: 'All',
      trim: true
    },
    targetYear: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'All'],
      default: 'All'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    attachmentUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notice', noticeSchema);

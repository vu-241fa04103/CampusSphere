const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true
    },
    description: {
      type: String,
      default: 'Test your knowledge!'
    },
    department: {
      type: String,
      default: 'All',
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    targetYear: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'All'],
      default: 'All'
    },
    duration: {
      type: Number,
      default: 20 // minutes
    },
    questions: [
      {
        question: {
          type: String,
          required: true
        },
        options: {
          type: [String],
          required: true,
          validate: (arr) => arr.length >= 2 && arr.length <= 6
        },
        correctIndex: {
          type: Number,
          required: true
        },
        explanation: {
          type: String,
          default: ''
        }
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    creatorName: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        studentName: String,
        score: Number,
        totalQuestions: Number,
        percentage: Number,
        submittedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Quiz', quizSchema);

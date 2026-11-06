const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide question title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please explain your doubt in detail'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Please select the department'],
      trim: true
    },
    // 'mentor' → goes to all senior mentors of this dept; 'faculty' → goes to specific faculty inbox
    targetRole: {
      type: String,
      enum: ['mentor', 'faculty'],
      default: 'mentor'
    },
    // Set only when targetRole === 'faculty'; points to a specific lecturer's User _id
    targetFaculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    tags: {
      type: [String],
      default: ['Doubt', 'Concept']
    },
    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      default: 'Student'
    },
    isResolved: {
      type: Boolean,
      default: false
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    answers: [
      {
        answeredBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        responderName: {
          type: String,
          required: true
        },
        responderRole: {
          type: String,
          default: 'student'
        },
        text: {
          type: String,
          required: true
        },
        upvotes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
        ],
        createdAt: {
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

module.exports = mongoose.model('Doubt', doubtSchema);

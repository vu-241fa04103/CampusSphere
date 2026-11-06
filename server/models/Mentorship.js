const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    topic: {
      type: String,
      required: [true, 'Please specify the session topic or agenda'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Please provide details or specific questions for the mentor'],
      trim: true
    },
    preferredDate: {
      type: String,
      required: [true, 'Please select a preferred date']
    },
    preferredTime: {
      type: String,
      required: [true, 'Please select a preferred time slot']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    meetingLink: {
      type: String,
      default: ''
    },
    mentorNotes: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Mentorship', mentorshipSchema);

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide resource title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Please specify the department'],
      trim: true
    },
    semester: {
      type: Number,
      required: [true, 'Please specify semester (1-8)'],
      min: 1,
      max: 8
    },
    targetYear: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: function () {
        return Math.ceil(this.semester / 2);
      }
    },
    resourceType: {
      type: String,
      required: [true, 'Please select resource type'],
      enum: [
        'Question Paper',
        'Lecture Notes',
        'Presentation / PPT',
        'Important PDF',
        'Lab Manual',
        'Cheat Sheet',
        'Project Code',
        'Reference Book'
      ],
      default: 'Lecture Notes'
    },
    fileUrl: {
      type: String,
      required: [true, 'Please provide a file URL or Google Drive link']
    },
    tags: {
      type: [String],
      default: ['Exams', 'Revision']
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploaderName: {
      type: String,
      default: 'Anonymous Student'
    },
    uploaderRole: {
      type: String,
      default: 'student'
    },
    isFacultyVerified: {
      type: Boolean,
      default: false
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    downloadsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Resource', resourceSchema);

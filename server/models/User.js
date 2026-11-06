const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    regNo: {
      type: String,
      required: [true, 'Please provide your university registration number or employee ID'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Please select your department'],
      trim: true
    },
    specialization: {
      type: String,
      default: 'General'
      // e.g. 'Full-Stack Web Dev', 'AI/ML', 'Bioinformatics', 'VLSI Design', etc.
    },
    year: {
      type: String,
      default: '3rd Year',
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni', 'Faculty']
    },
    role: {
      type: String,
      enum: ['student', 'mentor', 'lecturer', 'admin'],
      default: 'student'
    },
    bio: {
      type: String,
      default: 'CampusSphere academic collaborator.'
    },
    skills: {
      type: [String],
      default: ['Academic Preparation', 'Study Resources']
    },
    availability: {
      type: String,
      default: 'Weekdays 5:00 PM - 7:00 PM'
    },
    rating: {
      type: Number,
      default: 4.9
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    },
    resetPasswordOtp: {
      type: String,
      select: false
    },
    resetPasswordExpires: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Helper: Extract batch prefix year from RegNo (e.g. "241FA04103" -> 24)
userSchema.methods.getBatchYear = function () {
  if (this.role === 'lecturer' || this.role === 'admin') return 0; // Universal access
  const match = this.regNo.match(/^(\d{2})/);
  if (match) {
    return parseInt(match[1], 10);
  }
  const yearMap = { '4th Year': 23, '3rd Year': 24, '2nd Year': 25, '1st Year': 26, 'Alumni': 22 };
  return yearMap[this.year] || 24;
};

// Year-Hierarchy Access Rule: Seniors can access junior portals; juniors cannot access senior portals
userSchema.methods.canAccessCohort = function (targetYearNum) {
  if (this.role === 'lecturer' || this.role === 'admin') return true;
  const targetBatchMap = { 4: 23, 3: 24, 2: 25, 1: 26 };
  const targetRequiredBatch = targetBatchMap[targetYearNum] || 24;
  const studentBatch = this.getBatchYear();
  return studentBatch <= targetRequiredBatch;
};

// Mentorship Rule: Students can be mentors ONLY for their juniors!
// Mentor batch must be strictly LESS than student batch (e.g. 23 < 24 is valid; 24 < 23 is invalid; 24 < 24 is invalid)
userSchema.methods.canMentorStudent = function (studentUser) {
  if (this.role === 'lecturer' || this.role === 'admin') return true;
  const mentorBatch = this.getBatchYear();
  const studentBatch = typeof studentUser.getBatchYear === 'function'
    ? studentUser.getBatchYear()
    : parseInt(studentUser.regNo.match(/^(\d{2})/)?.[1] || '25', 10);
  return mentorBatch < studentBatch;
};

module.exports = mongoose.model('User', userSchema);

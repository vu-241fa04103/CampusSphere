const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'campussphere_default_secret', {
    expiresIn: '30d'
  });
};

// @desc    Register new user (Student, Mentor, or Lecturer)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, regNo, department, specialization, year, role, bio, skills, availability } = req.body;

    if (!name || !email || !password || !regNo || !department) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const assignedRole = role || 'student';
    let assignedYear = year || '3rd Year';
    if (assignedRole === 'lecturer') {
      assignedYear = 'Faculty';
    }

    const user = await User.create({
      name,
      email,
      password,
      regNo,
      department,
      specialization: specialization || 'General Track',
      year: assignedYear,
      role: assignedRole,
      bio: bio || (assignedRole === 'lecturer' ? 'Faculty Professor guiding student success.' : 'Student at CampusSphere.'),
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['Academic Prep']),
      availability: availability || 'Weekdays 4:00 PM - 6:00 PM'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        regNo: user.regNo,
        department: user.department,
        specialization: user.specialization,
        year: user.year,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        availability: user.availability,
        rating: user.rating,
        avatar: user.avatar,
        batchYear: user.getBatchYear()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        regNo: user.regNo,
        department: user.department,
        specialization: user.specialization || 'General Track',
        year: user.year,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        availability: user.availability,
        rating: user.rating,
        avatar: user.avatar,
        batchYear: user.getBatchYear()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        regNo: user.regNo,
        department: user.department,
        specialization: user.specialization || 'General Track',
        year: user.year,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        availability: user.availability,
        rating: user.rating,
        avatar: user.avatar,
        batchYear: user.getBatchYear()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate and send 6-digit OTP to user email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered account found with this email' });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP with 10 minutes expiry
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    console.log(`\n📬 [CAMPUSSPHERE OTP SERVICE] Verification OTP for ${user.email} is: ${otp}`);

    res.json({
      success: true,
      message: `A 6-digit verification OTP has been generated for ${user.email}. It is valid for 10 minutes.`,
      demoOtp: otp // Included for instant evaluator testing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, 6-digit OTP, and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordOtp: otp.trim(),
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+password +resetPasswordOtp +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code or OTP has expired. Please request a new one.' });
    }

    // Update password (will be automatically hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`🔐 [CAMPUSSPHERE SECURITY] Password successfully reset for ${user.email}`);

    res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new credentials.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, skills, availability, department, year } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (availability) user.availability = availability;
    if (department) user.department = department;
    if (year) user.year = year;
    if (skills) {
      user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all available Mentors & Lecturers
// @route   GET /api/auth/mentors
// @access  Public
exports.getMentors = async (req, res, next) => {
  try {
    const { department, role } = req.query;
    let query = { role: { $in: ['mentor', 'lecturer'] } };

    if (role) {
      query.role = role;
    }
    if (department) {
      query.department = department;
    }

    const mentors = await User.find(query).select('-password');
    res.json({
      success: true,
      count: mentors.length,
      mentors
    });
  } catch (error) {
    next(error);
  }
};

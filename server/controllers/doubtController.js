const Doubt = require('../models/Doubt');
const User = require('../models/User');

// @desc    Get all doubts with search, department, and targetRole filtering
// @route   GET /api/doubts
// @access  Public
exports.getDoubts = async (req, res, next) => {
  try {
    const { department, isResolved, search, targetRole } = req.query;
    let query = {};

    if (department && department !== 'All') {
      query.department = department;
    }
    if (targetRole && targetRole !== 'All') {
      query.targetRole = targetRole;
    }
    if (isResolved !== undefined && isResolved !== 'All') {
      query.isResolved = isResolved === 'true';
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const doubts = await Doubt.find(query)
      .populate('askedBy', 'name department avatar role regNo')
      .populate('targetFaculty', 'name department avatar email')
      .populate('answers.answeredBy', 'name department avatar role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: doubts.length,
      doubts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doubts inbox for mentors (seniors see doubts from juniors in their department)
// @route   GET /api/doubts/mentor-inbox
// @access  Private (mentor / senior)
exports.getMentorDoubts = async (req, res, next) => {
  try {
    // Mentors only see doubts where targetRole is 'mentor' and department matches mentor's department
    const query = {
      targetRole: 'mentor',
      department: req.user.department
    };

    const doubts = await Doubt.find(query)
      .populate('askedBy', 'name department avatar role regNo year')
      .populate('answers.answeredBy', 'name department avatar role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: doubts.length,
      doubts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doubts inbox for faculty (faculty see doubts targeted to faculty in their department or directed to them)
// @route   GET /api/doubts/faculty-inbox
// @access  Private (lecturer)
exports.getFacultyDoubts = async (req, res, next) => {
  try {
    const query = {
      targetRole: 'faculty',
      $or: [
        { targetFaculty: req.user._id },
        { department: req.user.department },
        { targetFaculty: null }
      ]
    };

    const doubts = await Doubt.find(query)
      .populate('askedBy', 'name department avatar role regNo year')
      .populate('targetFaculty', 'name department avatar')
      .populate('answers.answeredBy', 'name department avatar role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: doubts.length,
      doubts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty members for student doubt routing dropdown
// @route   GET /api/doubts/faculty-list
// @access  Private
exports.getFacultyList = async (req, res, next) => {
  try {
    const { department } = req.query;
    const query = { role: 'lecturer' };
    if (department && department !== 'All') {
      query.department = department;
    }

    const faculty = await User.find(query).select('name email department avatar');
    res.json({
      success: true,
      faculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doubt by ID
// @route   GET /api/doubts/:id
// @access  Public
exports.getDoubtById = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('askedBy', 'name department avatar role regNo year')
      .populate('targetFaculty', 'name department avatar')
      .populate('answers.answeredBy', 'name department avatar role');

    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    res.json({
      success: true,
      doubt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post a new academic doubt (select targetRole: mentor or faculty)
// @route   POST /api/doubts
// @access  Private
exports.createDoubt = async (req, res, next) => {
  try {
    const { title, description, subject, department, tags, targetRole, targetFaculty } = req.body;

    if (!title || !description || !subject || !department) {
      return res.status(400).json({ success: false, message: 'Please provide all required doubt fields' });
    }

    const doubt = await Doubt.create({
      title,
      description,
      subject,
      department,
      targetRole: targetRole === 'faculty' ? 'faculty' : 'mentor',
      targetFaculty: (targetRole === 'faculty' && targetFaculty) ? targetFaculty : null,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Academic Doubt']),
      askedBy: req.user._id,
      authorName: req.user.name
    });

    const populated = await Doubt.findById(doubt._id)
      .populate('askedBy', 'name department avatar role regNo')
      .populate('targetFaculty', 'name department avatar');

    res.status(201).json({
      success: true,
      message: targetRole === 'faculty'
        ? 'Doubt sent directly to faculty portal!'
        : 'Doubt routed to senior mentors of your department!',
      doubt: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post an answer to a doubt (Mentors or Faculty solve it)
// @route   POST /api/doubts/:id/answers
// @access  Private
exports.addAnswer = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please write an answer response' });
    }

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    doubt.answers.push({
      answeredBy: req.user._id,
      responderName: req.user.name,
      responderRole: req.user.role,
      text: text.trim(),
      upvotes: []
    });

    // If answer is from mentor or faculty, mark isResolved to true automatically or keep as is
    if (req.user.role === 'lecturer' || req.user.role === 'mentor') {
      doubt.isResolved = true;
    }

    await doubt.save();

    const updatedDoubt = await Doubt.findById(req.params.id)
      .populate('askedBy', 'name department avatar role')
      .populate('targetFaculty', 'name department avatar')
      .populate('answers.answeredBy', 'name department avatar role');

    res.status(201).json({
      success: true,
      message: 'Solution posted successfully!',
      doubt: updatedDoubt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle resolved status for a doubt
// @route   PATCH /api/doubts/:id/resolve
// @access  Private (Author, Lecturer, or Mentor)
exports.toggleResolve = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    doubt.isResolved = !doubt.isResolved;
    await doubt.save();

    res.json({
      success: true,
      message: doubt.isResolved ? 'Doubt marked as Resolved!' : 'Doubt reopened',
      isResolved: doubt.isResolved
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote a doubt
// @route   POST /api/doubts/:id/upvote
// @access  Private
exports.upvoteDoubt = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    const alreadyUpvoted = doubt.upvotes.includes(req.user._id);

    if (alreadyUpvoted) {
      doubt.upvotes = doubt.upvotes.filter(uId => uId.toString() !== req.user._id.toString());
    } else {
      doubt.upvotes.push(req.user._id);
    }

    await doubt.save();

    res.json({
      success: true,
      upvotesCount: doubt.upvotes.length,
      isUpvoted: !alreadyUpvoted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a doubt
// @route   DELETE /api/doubts/:id
// @access  Private (Author or Admin)
exports.deleteDoubt = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    if (doubt.askedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this doubt' });
    }

    await Doubt.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Question removed from forum'
    });
  } catch (error) {
    next(error);
  }
};

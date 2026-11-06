const Mentorship = require('../models/Mentorship');
const User = require('../models/User');

// @desc    Book a new 1-on-1 mentorship session (Enforces: Students can only mentor juniors!)
// @route   POST /api/mentorship/request
// @access  Private (Student)
exports.requestSession = async (req, res, next) => {
  try {
    const { mentorId, topic, message, preferredDate, preferredTime } = req.body;

    if (!mentorId || !topic || !message || !preferredDate || !preferredTime) {
      return res.status(400).json({ success: false, message: 'Please provide all booking details' });
    }

    if (mentorId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request a mentorship session with yourself' });
    }

    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor profile not found' });
    }

    // STRICT JUNIOR RULE: Students can be mentors ONLY for their juniors!
    if (mentor.role !== 'lecturer' && mentor.role !== 'admin') {
      const isEligibleMentor = mentor.canMentorStudent(req.user);
      if (!isEligibleMentor) {
        return res.status(403).json({
          success: false,
          message: `Mentorship Eligibility Restriction: Students can only mentor their juniors! Mentor is in ${mentor.year} (${mentor.regNo}) and you are in ${req.user.year} (${req.user.regNo}). A student cannot mentor peers of the same batch or senior students.`
        });
      }
    }

    const session = await Mentorship.create({
      mentor: mentorId,
      student: req.user._id,
      topic,
      message,
      preferredDate,
      preferredTime,
      status: 'pending'
    });

    const populatedSession = await Mentorship.findById(session._id)
      .populate('mentor', 'name email department avatar skills year regNo role')
      .populate('student', 'name email regNo department year avatar');

    res.status(201).json({
      success: true,
      message: 'Mentorship request submitted successfully to your senior/mentor!',
      session: populatedSession
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all mentorship sessions for the current logged-in user (as student or mentor)
// @route   GET /api/mentorship/my-sessions
// @access  Private
exports.getMySessions = async (req, res, next) => {
  try {
    const isMentor = req.user.role === 'mentor' || req.user.role === 'lecturer';
    const filter = isMentor
      ? { $or: [{ mentor: req.user._id }, { student: req.user._id }] }
      : { student: req.user._id };

    const sessions = await Mentorship.find(filter)
      .populate('mentor', 'name email department avatar skills availability year regNo role')
      .populate('student', 'name email regNo department year avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update session status (Accept/Decline/Complete)
// @route   PATCH /api/mentorship/:id/status
// @access  Private (Mentor or Admin)
exports.updateSessionStatus = async (req, res, next) => {
  try {
    const { status, meetingLink, mentorNotes } = req.body;
    let session = await Mentorship.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Mentorship session not found' });
    }

    // Only the assigned mentor or admin can update status
    if (session.mentor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the assigned mentor can update this session' });
    }

    if (status) session.status = status;
    if (meetingLink) session.meetingLink = meetingLink;
    if (mentorNotes) session.mentorNotes = mentorNotes;

    await session.save();

    const updated = await Mentorship.findById(session._id)
      .populate('mentor', 'name email department avatar')
      .populate('student', 'name email regNo department year avatar');

    res.json({
      success: true,
      message: `Session status updated to ${session.status}`,
      session: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a session
// @route   DELETE /api/mentorship/:id
// @access  Private (Participant only)
exports.cancelSession = async (req, res, next) => {
  try {
    const session = await Mentorship.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Mentorship session not found' });
    }

    const isParticipant =
      session.student.toString() === req.user._id.toString() ||
      session.mentor.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this session' });
    }

    await Mentorship.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Mentorship session cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit feedback & rating for session
// @route   POST /api/mentorship/:id/feedback
// @access  Private (Student only)
exports.submitFeedback = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    const session = await Mentorship.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the student can submit feedback' });
    }

    session.rating = Number(rating) || 5;
    session.feedback = feedback || 'Helpful session!';
    session.status = 'completed';

    await session.save();

    res.json({
      success: true,
      message: 'Feedback submitted! Thank you.',
      session
    });
  } catch (error) {
    next(error);
  }
};

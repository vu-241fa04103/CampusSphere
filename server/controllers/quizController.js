const Quiz = require('../models/Quiz');

// @desc    Get all quizzes visible to the current user
// @route   GET /api/quizzes
// @access  Private
exports.getQuizzes = async (req, res, next) => {
  try {
    let query = {};
    query.isActive = true;

    // Students/mentors see their dept quizzes + "All" dept quizzes
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      query.$or = [{ department: req.user.department }, { department: 'All' }];
    } else if (req.query.department && req.query.department !== 'All') {
      query.department = req.query.department;
    }

    const quizzes = await Quiz.find(query)
      .select('-questions.correctIndex -questions.explanation -submissions')
      .populate('createdBy', 'name department role')
      .sort({ createdAt: -1 });

    // Check which quizzes the user has already submitted
    const withAttempt = quizzes.map(q => {
      const obj = q.toObject();
      return obj;
    });

    res.json({ success: true, count: withAttempt.length, quizzes: withAttempt });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single quiz with correct answers (only after submission)
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name department role');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Check if user already submitted
    const alreadySubmitted = quiz.submissions.some(
      s => s.student && s.student.toString() === req.user._id.toString()
    );

    // Hide correct answers until user has submitted (or if faculty)
    const quizObj = quiz.toObject();
    if (!alreadySubmitted && req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      quizObj.questions = quizObj.questions.map(q => {
        const { correctIndex, explanation, ...safe } = q;
        return safe;
      });
    }

    quizObj.alreadySubmitted = alreadySubmitted;
    res.json({ success: true, quiz: quizObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a quiz (faculty only)
// @route   POST /api/quizzes
// @access  Private (lecturer/admin)
exports.createQuiz = async (req, res, next) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only faculty can create quizzes' });
    }

    const { title, description, department, subject, targetYear, duration, questions } = req.body;

    if (!title || !subject || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Title, subject, and at least one question are required' });
    }

    // Validate each question
    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || q.correctIndex === undefined) {
        return res.status(400).json({ success: false, message: 'Each question needs: question text, at least 2 options, and correctIndex' });
      }
    }

    const quiz = await Quiz.create({
      title,
      description: description || 'Test your knowledge!',
      department: department || req.user.department,
      subject,
      targetYear: targetYear || 'All',
      duration: duration || 20,
      questions,
      createdBy: req.user._id,
      creatorName: req.user.name,
      isActive: true
    });

    res.status(201).json({ success: true, message: 'Quiz created successfully!', quizId: quiz._id });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answers for a quiz (auto-scored)
// @route   POST /api/quizzes/:id/submit
// @access  Private (students/mentors)
exports.submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Prevent duplicate submissions
    const alreadySubmitted = quiz.submissions.some(
      s => s.student && s.student.toString() === req.user._id.toString()
    );
    if (alreadySubmitted) {
      return res.status(400).json({ success: false, message: 'You have already submitted this quiz' });
    }

    const { answers } = req.body; // Array of selected option indices, ordered by question index
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ success: false, message: `Please answer all ${quiz.questions.length} questions` });
    }

    // Auto-grade
    let score = 0;
    const breakdown = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) score++;
      return {
        question: q.question,
        yourAnswer: q.options[answers[i]] || 'Not answered',
        correctAnswer: q.options[q.correctIndex],
        isCorrect,
        explanation: q.explanation
      };
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);

    quiz.submissions.push({
      student: req.user._id,
      studentName: req.user.name,
      score,
      totalQuestions: quiz.questions.length,
      percentage
    });
    await quiz.save();

    res.json({
      success: true,
      message: 'Quiz submitted!',
      result: { score, totalQuestions: quiz.questions.length, percentage, breakdown }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz submissions (faculty only)
// @route   GET /api/quizzes/:id/submissions
// @access  Private (lecturer/admin)
exports.getSubmissions = async (req, res, next) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only faculty can view submissions' });
    }

    const quiz = await Quiz.findById(req.params.id)
      .populate('submissions.student', 'name regNo department year');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    res.json({ success: true, quiz: quiz.title, submissions: quiz.submissions });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle quiz active/inactive
// @route   PATCH /api/quizzes/:id/toggle
// @access  Private (lecturer/admin)
exports.toggleQuiz = async (req, res, next) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only faculty can toggle quizzes' });
    }
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    quiz.isActive = !quiz.isActive;
    await quiz.save();
    res.json({ success: true, isActive: quiz.isActive });
  } catch (error) {
    next(error);
  }
};

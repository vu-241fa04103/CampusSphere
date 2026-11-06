const Notice = require('../models/Notice');

// @desc    Get all notices (filtered by dept/year for students)
// @route   GET /api/notices
// @access  Private
exports.getNotices = async (req, res, next) => {
  try {
    const { department, targetYear, type } = req.query;
    let query = {};

    // Faculty sees all notices; students see their dept notices + "All" dept notices
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      query.$or = [
        { department: req.user.department },
        { department: 'All' }
      ];
    } else if (department && department !== 'All') {
      query.department = department;
    }

    if (targetYear && targetYear !== 'All') {
      query.$and = query.$and || [];
      query.$and.push({ $or: [{ targetYear }, { targetYear: 'All' }] });
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    const notices = await Notice.find(query)
      .populate('postedBy', 'name department role')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json({ success: true, count: notices.length, notices });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notice (faculty only)
// @route   POST /api/notices
// @access  Private (lecturer/admin)
exports.createNotice = async (req, res, next) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only faculty can post notices' });
    }

    const { title, content, type, department, targetYear, isPinned, attachmentUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const notice = await Notice.create({
      title,
      content,
      type: type || 'General',
      department: department || req.user.department,
      targetYear: targetYear || 'All',
      isPinned: isPinned || false,
      attachmentUrl: attachmentUrl || null,
      postedBy: req.user._id,
      authorName: req.user.name
    });

    const populated = await Notice.findById(notice._id).populate('postedBy', 'name department role');

    res.status(201).json({ success: true, message: 'Notice posted successfully!', notice: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private (original poster or admin)
exports.updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

    if (notice.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this notice' });
    }

    const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Notice updated', notice: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private (original poster or admin)
exports.deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

    if (notice.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this notice' });
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notice deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pinned status
// @route   PATCH /api/notices/:id/pin
// @access  Private (lecturer/admin)
exports.togglePin = async (req, res, next) => {
  try {
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only faculty can pin notices' });
    }
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

    notice.isPinned = !notice.isPinned;
    await notice.save();
    res.json({ success: true, isPinned: notice.isPinned, message: notice.isPinned ? 'Notice pinned' : 'Notice unpinned' });
  } catch (error) {
    next(error);
  }
};

const Resource = require('../models/Resource');
const User = require('../models/User');

// @desc    Get all resources with search, filters, and cohort year filtering
// @route   GET /api/resources
// @access  Public
exports.getResources = async (req, res, next) => {
  try {
    const { department, semester, targetYear, resourceType, search } = req.query;
    let query = {};

    if (department && department !== 'All') {
      query.department = department;
    }
    if (semester && semester !== 'All') {
      query.semester = Number(semester);
    }
    if (targetYear && targetYear !== 'All') {
      query.targetYear = Number(targetYear);
    }
    if (resourceType && resourceType !== 'All') {
      query.resourceType = resourceType;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name regNo department avatar role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Public
exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'name email department avatar role');
    
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Upload new resource (Seniors/Lecturers can share into junior portals)
// @route   POST /api/resources
// @access  Private
exports.createResource = async (req, res, next) => {
  try {
    const { title, description, subject, department, semester, targetYear, resourceType, fileUrl, tags } = req.body;

    if (!title || !subject || !department || !semester || !fileUrl) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory resource fields' });
    }

    const calculatedTargetYear = targetYear ? Number(targetYear) : Math.ceil(Number(semester) / 2);

    // Permission check: juniors cannot access/upload to senior vaults
    if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
      // Department rule: seniors can only post resources representing their own department
      if (req.user.department && req.user.department !== department) {
        return res.status(403).json({
          success: false,
          message: `Department restriction: You can only post resources representing your department (${req.user.department}), not ${department}.`
        });
      }

      const canAccess = req.user.canAccessCohort(calculatedTargetYear);
      if (!canAccess) {
        return res.status(403).json({
          success: false,
          message: `Access Denied: Junior students cannot upload into or access senior Year ${calculatedTargetYear} portals.`
        });
      }
    }

    const isFaculty = req.user.role === 'lecturer';

    const resource = await Resource.create({
      title,
      description: description || 'No detailed description provided.',
      subject,
      department,
      semester: Number(semester),
      targetYear: calculatedTargetYear,
      resourceType: resourceType || 'Lecture Notes',
      fileUrl,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Study Material']),
      uploadedBy: req.user._id,
      uploaderName: req.user.name,
      uploaderRole: req.user.role,
      isFacultyVerified: isFaculty
    });

    res.status(201).json({
      success: true,
      message: `${isFaculty ? 'Faculty verified material' : 'Resource'} uploaded successfully!`,
      resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resource details
// @route   PUT /api/resources/:id
// @access  Private (Author, Lecturer, or Admin)
exports.updateResource = async (req, res, next) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const isOwner = resource.uploadedBy.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'admin' || req.user.role === 'lecturer';

    if (!isOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this resource' });
    }

    const { title, description, subject, department, semester, targetYear, resourceType, fileUrl, tags } = req.body;

    if (title) resource.title = title;
    if (description) resource.description = description;
    if (subject) resource.subject = subject;
    if (department) resource.department = department;
    if (semester) {
      resource.semester = Number(semester);
      resource.targetYear = targetYear ? Number(targetYear) : Math.ceil(Number(semester) / 2);
    }
    if (targetYear) resource.targetYear = Number(targetYear);
    if (resourceType) resource.resourceType = resourceType;
    if (fileUrl) resource.fileUrl = fileUrl;
    if (tags) {
      resource.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    }

    await resource.save();

    res.json({
      success: true,
      message: 'Resource updated successfully',
      resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (Author, Lecturer, or Admin)
exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const isOwner = resource.uploadedBy.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'admin' || req.user.role === 'lecturer';

    if (!isOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Resource removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Upvote resource
// @route   POST /api/resources/:id/upvote
// @access  Private
exports.upvoteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const alreadyUpvoted = resource.upvotes.includes(req.user._id);

    if (alreadyUpvoted) {
      resource.upvotes = resource.upvotes.filter(userId => userId.toString() !== req.user._id.toString());
    } else {
      resource.upvotes.push(req.user._id);
    }

    await resource.save();

    res.json({
      success: true,
      upvotesCount: resource.upvotes.length,
      isUpvoted: !alreadyUpvoted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment downloads counter
// @route   POST /api/resources/:id/download
// @access  Public
exports.incrementDownload = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadsCount: 1 } },
      { new: true }
    );

    res.json({
      success: true,
      downloadsCount: resource ? resource.downloadsCount : 0
    });
  } catch (error) {
    next(error);
  }
};

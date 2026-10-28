const { ServiceRequest, User, ActivityLog } = require('../utils/dbAdapter');

// GET /api/requests - Search, filtering, sorting and pagination
exports.getServiceRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      priority,
      category,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    if (search && search.trim() !== '') {
      query.$or = [
        { ticketId: { $regex: search.trim(), $options: 'i' } },
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const total = await ServiceRequest.countDocuments(query);
    const chain = ServiceRequest.find(query);
    const requests = chain
      .sort({ [sortBy]: order })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))._items;

    return res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)) || 1
      }
    });
  } catch (error) {
    console.error('[getServiceRequests] Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/requests/:requestId
exports.getServiceRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/requests - Create a service request
exports.createServiceRequest = async (req, res) => {
  try {
    const { title, description, category, priority, department, requesterName, requesterRole } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    // AI summary auto-generation if not provided
    let aiSummary = req.body.aiSummary;
    if (!aiSummary) {
      aiSummary = `AI-Digest: ${title}. User reporting operational issue in ${category || 'IT Infrastructure'}. Impact: High. Suggested troubleshooting: verify gateway, logs, and network connectivity.`;
    }

    const newRequest = await ServiceRequest.create({
      title,
      description,
      category: category || 'IT Infrastructure',
      priority: priority || 'Medium',
      department: department || 'Information Technology',
      status: 'Open',
      requestedBy: {
        name: requesterName || req.user?.name || req.user?.role || 'Admin',
        role: requesterRole || req.user?.role || 'Admin'
      },
      aiSummary,
      sla: priority === 'Critical' ? '4 Hours' : priority === 'High' ? '12 Hours' : '24 Hours'
    });

    await ActivityLog.create({
      request: newRequest._id,
      ticketId: newRequest.ticketId,
      action: 'TICKET_CREATED',
      details: `Created by ${newRequest.requestedBy.name}`,
      performedBy: newRequest.requestedBy.name
    });

    return res.status(201).json({
      success: true,
      message: `Service Request ${newRequest.ticketId} Created Successfully.`,
      data: newRequest
    });
  } catch (error) {
    console.error('[createServiceRequest] Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/requests/:requestId/assign - Assign to employee/department
exports.assignServiceRequest = async (req, res) => {
  try {
    const { assignedToId, staffName, staffTitle, department } = req.body;
    const request = await ServiceRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    let staff = null;
    if (assignedToId) {
      staff = await User.findById(assignedToId);
    }

    const assignee = staff || {
      _id: assignedToId || `usr_${Date.now()}`,
      name: staffName || 'Assigned Staff',
      title: staffTitle || 'Support Specialist',
      role: 'Employee'
    };

    request.assignedTo = {
      _id: assignee._id,
      name: assignee.name,
      email: assignee.email || `${assignee.name.toLowerCase().replace(/\s+/g, '.')}@tarqdev.com`,
      role: assignee.role || 'Employee',
      title: assignee.title || staffTitle || 'Support Specialist'
    };

    if (department) {
      request.department = department;
    }

    request.history = request.history || [];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    request.history.push({
      id: `h_${Date.now()}`,
      timestamp: timeStr,
      action: 'ASSIGNED',
      details: `Assigned to ${assignee.name} by ${req.user?.name || req.user?.role || 'Manager'}`,
      user: req.user?.name || req.user?.role || 'Manager'
    });

    await request.save();

    await ActivityLog.create({
      request: request._id,
      ticketId: request.ticketId,
      action: 'ASSIGNED',
      details: `Assigned to ${assignee.name}`,
      performedBy: req.user?.name || 'System'
    });

    return res.status(200).json({
      success: true,
      message: `Request ${request.ticketId} successfully assigned to ${assignee.name}`,
      data: request
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/requests/:requestId/status - Update workflow status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const request = await ServiceRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const prevStatus = request.status;
    request.status = status;
    if (['Resolved', 'Closed'].includes(status)) {
      request.resolvedAt = new Date().toISOString();
    }

    request.history = request.history || [];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    request.history.push({
      id: `h_${Date.now()}`,
      timestamp: timeStr,
      action: 'STATUS_CHANGE',
      details: `Status transitioned from ${prevStatus} to ${status} by ${req.user?.name || req.user?.role || 'Staff'}${note ? ` (Note: ${note})` : ''}`,
      user: req.user?.name || req.user?.role || 'Staff'
    });

    await request.save();

    await ActivityLog.create({
      request: request._id,
      ticketId: request.ticketId,
      action: 'STATUS_CHANGE',
      previousValue: prevStatus,
      newValue: status,
      performedBy: req.user?.name || 'System'
    });

    return res.status(200).json({
      success: true,
      message: `Status Updated to ${status}`,
      data: request
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/requests/:requestId/comments - Add comment
exports.addComment = async (req, res) => {
  try {
    const { text, isInternal } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const request = await ServiceRequest.findById(req.params.requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const newComment = {
      id: `c_${Date.now()}`,
      author: {
        name: req.body.author?.name || req.user?.name || req.user?.role || 'Staff',
        avatar: null,
        role: req.body.author?.role || req.user?.role || 'Employee'
      },
      text: text.trim(),
      isInternal: Boolean(isInternal),
      createdAt: new Date().toISOString()
    };

    request.comments = request.comments || [];
    request.comments.push(newComment);

    await request.save();

    return res.status(201).json({
      success: true,
      data: newComment,
      totalComments: request.comments.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


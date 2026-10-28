const { User, readDB } = require('../utils/dbAdapter');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tarqdev_enterprise_secret_2026';

exports.login = async (req, res) => {
  try {
    const { email, role } = req.body;
    const db = readDB();
    const users = db.users || [];

    let matchedUser = null;
    if (email) {
      matchedUser = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    }

    if (!matchedUser && role) {
      matchedUser = users.find(u => u.role.toLowerCase() === role.toLowerCase());
    }

    if (!matchedUser) {
      // Default to Admin role if not matched
      matchedUser = users[0];
    }

    const token = jwt.sign(
      { id: matchedUser._id, email: matchedUser.email, role: matchedUser.role, name: matchedUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Welcome back!',
      token,
      user: matchedUser
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const db = readDB();
    const requests = db.requests || [];
    const users = db.users || [];

    // Filter staff members eligible for assignment (Admin, Manager, Employee)
    const staff = users
      .filter(u => ['Admin', 'Manager', 'Employee'].includes(u.role))
      .map(u => {
        // Calculate live tickets
        const activeTickets = requests.filter(r => 
          r.assignedTo && 
          (r.assignedTo._id === u._id || r.assignedTo.name === u.name) && 
          ['Open', 'In Progress'].includes(r.status)
        ).length;

        const workloadLevel = activeTickets >= 10 ? 'High' : activeTickets >= 5 ? 'Medium' : 'Low';

        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          title: u.title || `${u.role} - ${u.department}`,
          department: u.department,
          avatar: u.avatar,
          liveWorkload: activeTickets || u.activeWorkload || 4,
          workloadLevel: (activeTickets || u.activeWorkload || 4) >= 10 ? 'High' : (activeTickets || u.activeWorkload || 4) >= 7 ? 'Medium' : 'Low'
        };
      });

    return res.status(200).json({ success: true, data: staff });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({ success: true, user: req.user || null });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


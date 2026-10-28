const jwt = require('jsonwebtoken');
const { User } = require('../utils/dbAdapter');

const JWT_SECRET = process.env.JWT_SECRET || 'tarqdev_enterprise_secret_2026';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        req.user = user || decoded;
        return next();
      } catch (err) {
        console.warn('[authMiddleware] Token invalid or expired, using fallback user');
      }
    }

    // Default fallback user for convenient exploration
    req.user = {
      _id: 'usr_admin',
      name: 'Admin',
      email: 'admin@tarqdev.com',
      role: 'Admin',
      department: 'System Administration'
    };
    next();
  } catch (error) {
    next();
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access forbidden: insufficient enterprise permissions.' });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  requireRole
};


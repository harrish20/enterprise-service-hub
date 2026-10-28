const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const { initDatabase } = require('./config/database');
const requestController = require('./controllers/requestController');
const analyticsController = require('./controllers/analyticsController');
const userController = require('./controllers/userController');
const aiController = require('./controllers/aiController');
const { authMiddleware } = require('./middleware/authMiddleware');
const { Department, readDB } = require('./utils/dbAdapter');

// Initialize database
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Public Auth APIs
app.post('/api/auth/login', userController.login);
app.get('/api/auth/me', authMiddleware, userController.getCurrentUser);

// Staff and Department directory
app.get('/api/staff', userController.getStaff);
app.get('/api/departments', async (req, res) => {
  const depts = await Department.find();
  res.json({ success: true, data: depts });
});

// Service Request REST APIs
app.get('/api/requests', requestController.getServiceRequests);
app.get('/api/requests/:requestId', requestController.getServiceRequestById);
app.post('/api/requests', authMiddleware, requestController.createServiceRequest);
app.put('/api/requests/:requestId/assign', authMiddleware, requestController.assignServiceRequest);
app.put('/api/requests/:requestId/status', authMiddleware, requestController.updateRequestStatus);
app.post('/api/requests/:requestId/comments', authMiddleware, requestController.addComment);

// Analytics and AI APIs
app.get('/api/analytics/overview', analyticsController.getAnalyticsOverview);
app.post('/api/ai/classify', aiController.classifyServiceRequest);

// Export API (CSV)
app.get('/api/export/csv', (req, res) => {
  const db = readDB();
  const requests = db.requests || [];
  
  const headers = ['Request ID', 'Title', 'Category', 'Priority', 'Status', 'Requester', 'Assigned To', 'Created Date'];
  const rows = requests.map(r => [
    `"${r.ticketId}"`,
    `"${(r.title || '').replace(/"/g, '""')}"`,
    `"${r.category}"`,
    `"${r.priority}"`,
    `"${r.status}"`,
    `"${r.requestedBy?.name || 'Portal User'}"`,
    `"${r.assignedTo?.name || 'Unassigned'}"`,
    `"${r.createdAt}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="tarqdev-service-requests.csv"');
  res.status(200).send(csv);
});

// Reset to Real-World Enterprise Dataset
app.post('/api/settings/reset-real-data', (req, res) => {
  try {
    const seed = require('./utils/seedData');
    const { writeDB } = require('./utils/dbAdapter');
    writeDB(seed);
    return res.status(200).json({
      success: true,
      message: 'System database successfully restored with real-world enterprise dataset (24 operational service tickets).'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Tarqdev Enterprise Service Request Backend System',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static frontend build if present
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Tarqdev ServiceHub] Full-Stack Server running on http://localhost:${PORT}`);
  console.log(`[Tarqdev ServiceHub] API Endpoint: http://localhost:${PORT}/api/requests`);
  console.log(`[Tarqdev ServiceHub] Web Portal:  http://localhost:${PORT}`);
});


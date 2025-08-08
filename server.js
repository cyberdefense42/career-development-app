const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting production server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', PORT);

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'build')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API placeholder - simple responses without database
app.post('/api/auth/login', (req, res) => {
  res.json({ 
    success: false, 
    error: 'Demo mode - use Demo Login button instead',
    demo: true 
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ 
    success: false, 
    error: 'Demo mode - use Demo Login button instead',
    demo: true 
  });
});

app.get('/api/auth/me', (req, res) => {
  res.status(401).json({ message: 'Demo mode - authentication disabled' });
});

app.get('/api/assessment', (req, res) => {
  res.json({ 
    assessment: {
      completedSteps: [],
      fiveWhyProblems: [],
      workTasks: [],
      workRequirements: [],
      values: { all: [], top10: [], top5: [] },
      wheelOfLife: {},
      strengths: { fromWork: [], fromTests: [], fromFriends: [] },
      dreamJob: { themes: [], categories: {}, vision: {} }
    }
  });
});

app.put('/api/assessment', (req, res) => {
  res.json({ message: 'Demo mode - data not saved', demo: true });
});

app.patch('/api/assessment/field', (req, res) => {
  res.json({ message: 'Demo mode - data not saved', demo: true });
});

app.post('/api/assessment/complete-step', (req, res) => {
  res.json({ message: 'Demo mode - progress not saved', demo: true });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/health`);
  console.log(`📱 App: http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
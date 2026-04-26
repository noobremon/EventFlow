const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const reminderService = require('./services/reminderService');
const keepaliveService = require('./services/keepaliveService');

// Route imports
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Root Health check for Render Cold Start
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), message: 'Render cold start wake up successful' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoints to verify API status
app.get('/', (req, res) => {
  res.json({ message: 'Event Platform API is running' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Event Platform API root' });
});

app.get('/api/keepalive', (req, res) => {
  res.json({ status: 'ok', message: 'Event Platform backend keepalive endpoint' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvps', rsvpRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
const start = async () => {
  await connectDB();
  reminderService.startReminderScheduler();
  keepaliveService.startKeepaliveScheduler();

  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

start();

module.exports = app;

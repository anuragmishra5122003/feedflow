const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { startAutomation, stopAutomation, getStatus } = require('./automation');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Status store
let automationStatus = {
  active: false,
  actionsCount: 0,
  lastActivity: null,
  currentTopic: null,
  logs: [],
  igConnected: false,
  feedScore: 0,
};

// Routes
app.get('/status', (req, res) => {
  res.json(automationStatus);
});

app.post('/start', async (req, res) => {
  const { username, password, preferences } = req.body;

  if (automationStatus.active) {
    return res.json({ success: false, message: 'Automation already running' });
  }

  automationStatus.active = true;
  automationStatus.igConnected = true;
  automationStatus.lastActivity = new Date().toISOString();

  addLog('🚀 Automation started');

  // Start automation in background
  startAutomation(username, password, preferences, automationStatus, addLog)
    .catch(err => {
      automationStatus.active = false;
      addLog('❌ Automation error: ' + err.message);
    });

  res.json({ success: true, message: 'Automation started' });
});

app.post('/stop', async (req, res) => {
  await stopAutomation();
  automationStatus.active = false;
  addLog('⏹️ Automation stopped');
  res.json({ success: true, message: 'Automation stopped' });
});

app.post('/connect', async (req, res) => {
  const { username, password } = req.body;
  try {
    automationStatus.igConnected = true;
    automationStatus.lastActivity = new Date().toISOString();
    addLog(`✅ Connected to @${username}`);
    res.json({ success: true, message: 'Connected successfully' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.get('/logs', (req, res) => {
  res.json({ logs: automationStatus.logs });
});

function addLog(message) {
  const log = {
    message,
    time: new Date().toISOString(),
    timeAgo: 'just now',
  };
  automationStatus.logs.unshift(log);
  if (automationStatus.logs.length > 50) {
    automationStatus.logs = automationStatus.logs.slice(0, 50);
  }
  automationStatus.actionsCount++;
  automationStatus.feedScore = Math.min(
    100,
    Math.floor(automationStatus.actionsCount * 0.3)
  );
  automationStatus.lastActivity = new Date().toISOString();
  console.log(message);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`FeedFlow backend running on port ${PORT}`);
});
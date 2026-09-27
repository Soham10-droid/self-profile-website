const path = require('path');
const express = require('express');
const profile = require('./data/profile');
const renderHome = require('./views/home');
const renderResume = require('./views/resume');
const renderNotFound = require('./views/notFound');

const app = express();

app.use(express.urlencoded({ extended: false })); // reads HTML form data
app.use(express.json()); // reads JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // CSS and favicon

// Guestbook messages are stored in memory.
// They are lost when the server restarts or a new version is deployed.
const messages = [];
const VISITOR_TYPES = ['Friend', 'Classmate', 'Recruiter', 'Faculty', 'Other'];

// Render sets RENDER_GIT_COMMIT, the Docker build sets GIT_SHA, locally it is "local"
const sha = process.env.GIT_SHA || process.env.RENDER_GIT_COMMIT || 'local';
const commit = sha.slice(0, 7);

function validateMessage(body) {
  const name = String(body.name || '').trim();
  const message = String(body.message || '').trim();
  const visitorType = String(body.visitorType || 'Other');
  const errors = [];

  if (name.length < 2 || name.length > 40) {
    errors.push('Name must be between 2 and 40 characters.');
  }
  if (message.length < 5 || message.length > 300) {
    errors.push('Message must be between 5 and 300 characters.');
  }
  if (!VISITOR_TYPES.includes(visitorType)) {
    errors.push('Please choose who you are from the list.');
  }
  return { name, message, visitorType, errors };
}

function homePage(options) {
  return renderHome({
    profile,
    commit,
    messages: [...messages].reverse(), // newest first
    visitorTypes: VISITOR_TYPES,
    errors: [],
    form: {},
    posted: false,
    ...options,
  });
}

// ---------- Pages ----------
app.get('/', (req, res) => {
  res.send(homePage({ posted: req.query.posted === '1' }));
});

app.get('/resume', (req, res) => {
  res.send(renderResume({ profile, commit }));
});

app.post('/messages', (req, res) => {
  const { name, message, visitorType, errors } = validateMessage(req.body || {});
  if (errors.length > 0) {
    return res.status(400).send(homePage({ errors, form: { name, message, visitorType } }));
  }
  messages.push({
    id: messages.length + 1,
    name,
    message,
    visitorType,
    postedAt: new Date().toISOString(),
  });
  return res.redirect('/?posted=1#guestbook');
});

// ---------- JSON API ----------
app.get('/api/profile', (req, res) => res.json(profile));
app.get('/api/projects', (req, res) => res.json(profile.projects));
app.get('/api/messages', (req, res) => res.json(messages));

// ---------- Health check (used by Docker, Render and the pipeline) ----------
app.get('/health', (req, res) => res.json({ status: 'ok', commit }));

// ---------- Anything else ----------
app.use((req, res) => {
  res.status(404).send(renderNotFound({ profile, commit }));
});

module.exports = app;

require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const leaderboard_db = require('./database/LeaderBoardDatabase');
const auth_db = require('./database/AuthDatabase');

app.use(express.json());

// Use the database instance directly
app.locals.leaderboard_db = leaderboard_db;
app.locals.auth_db = auth_db;

const apiRoutes = [
  { path: '/api/leaderboard', router: require('./api/leaderboard') },
  { path: '/api/auth', router: require('./api/auth') },
  { path: '/api/profile', router: require('./api/profile') }
];

apiRoutes.forEach(({ path, router }) => {
  app.use(path, router);
});

// Static file serving
app.use(express.static(path.join(__dirname, 'frontend/build')));

// React app fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
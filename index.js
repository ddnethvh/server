const express = require('express');
const path = require('path');
const db = require('./Database');
const app = express();

app.use(express.json());

// Use the database instance directly
app.locals.database = db;

const apiRoutes = [
  { path: '/api/leaderboard', router: require('./api/leaderboard') }
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
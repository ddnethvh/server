const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

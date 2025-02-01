const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Set a default JWT secret for development
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password, ign } = req.body;

    if (!username || !password || !ign) {
      return res.status(400).json({ error: 'Username, password and in-game name are required' });
    }

    const db = req.app.locals.auth_db;
    
    try {
      const userId = await db.createUser(username, password, ign);
      
      // Generate JWT token after successful registration
      const token = jwt.sign(
        { 
          userId,
          username
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({ 
        message: 'User registered successfully',
        token
      });
    } catch (err) {
      if (err.message === 'Username already exists') {
        return res.status(409).json({ error: 'Username already exists' });
      }
      if (err.message === 'In-game name already exists') {
        return res.status(409).json({ error: 'In-game name already exists' });
      }
      throw err;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = req.app.locals.auth_db;

    // Get user from database
    const user = await db.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await db.verifyPassword(username, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected route example - Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const db = req.app.locals.auth_db;
    const user = await db.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user info
router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = req.app.locals.auth_db;
    const user = await db.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Include IGN in response
    res.json({
      id: user.id,
      username: user.username,
      ign: user.ign,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 
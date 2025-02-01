const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Set a default JWT secret for development
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    let { username, password, ign } = req.body;

    // Get IP address from headers
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Clean the IP address (in case of x-forwarded-for chain)
    const cleanIP = ip.split(',')[0].trim();

    // Trim and validate input
    if (!username || !password || !ign) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    username = username.trim();
    ign = ign.trim();

    if (username.length === 0) {
      return res.status(400).json({ error: 'Username cannot be empty' });
    }

    if (ign.length === 0) {
      return res.status(400).json({ error: 'IGN cannot be empty' });
    }

    // Length validation
    if (username.length > 16) {
      return res.status(400).json({ error: 'Username must not exceed 16 characters' });
    }

    if (ign.length > 16) {
      return res.status(400).json({ error: 'IGN must not exceed 16 characters' });
    }

    const db = req.app.locals.auth_db;

    // Check if IP already has an account
    const existingIP = await db.getUserByIP(cleanIP);
    if (existingIP) {
      return res.status(403).json({ error: 'An account already exists from this IP address' });
    }

    // Check if username already exists
    const existingUsername = await db.getUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Check if IGN already exists
    const existingIGN = await db.getUserByIGN(ign);
    if (existingIGN) {
      return res.status(409).json({ error: 'IGN already taken' });
    }

    // Create user with IP
    const userId = await db.createUser(username, password, ign, cleanIP);
    
    const user = {
      id: userId,
      username,
      ign
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        ign: user.ign
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    if (error.message.includes('An account already exists')) {
      return res.status(403).json({ error: error.message });
    }
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

// Get user by username
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const db = req.app.locals.auth_db;
    
    const user = await db.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return non-sensitive user data
    res.json({
      id: user.id,
      username: user.username,
      ign: user.ign,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 
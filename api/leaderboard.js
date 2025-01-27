const express = require('express');
const router = express.Router();
const db = require('../Database');
// const apiKeyAuth = require('../middleware/auth');

// Get leaderboard data
router.get('/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    const { map } = req.query;
    
    if (!['fng', 'block', 'dm', 'kog'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    let leaderboardData;
    if (mode === 'kog') {
      leaderboardData = await db.getKogLeaderboard(map);
    } else {
      leaderboardData = await db.getLeaderboard(mode);
    }

    res.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available KoG maps
router.get('/kog/maps', async (req, res) => {
  try {
    const maps = await db.getKogMaps();
    res.json(maps);
  } catch (error) {
    console.error('Error fetching KoG maps:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get player's KoG maps
router.get('/kog/player/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const maps = await db.getPlayerKogMaps(name);
    res.json(maps);
  } catch (error) {
    console.error('Error fetching player KoG maps:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
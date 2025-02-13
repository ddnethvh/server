const express = require('express');
const router = express.Router();
// const apiKeyAuth = require('../middleware/auth');

// Get leaderboard data
router.get('/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    const { map } = req.query;
    
    if (!['fng', 'block', 'dm', 'kog'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    const db = req.app.locals.leaderboard_db;

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
    const db = req.app.locals.leaderboard_db;
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
    const db = req.app.locals.leaderboard_db;
    const maps = await db.getPlayerKogMaps(name);
    res.json(maps);
  } catch (error) {
    console.error('Error fetching player KoG maps:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get points for a specific map
router.get('/kog/map/:mapName/points', async (req, res) => {
  try {
    const { mapName } = req.params;
    const db = req.app.locals.leaderboard_db;
    const points = await db.getMapPoints(mapName);
    
    if (points === null) {
      return res.status(404).json({ error: 'Map not found' });
    }
    
    res.json({ points });
  } catch (error) {
    console.error('Error fetching map points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get player stats for a specific mode
router.get('/:mode/player/:ign', async (req, res) => {
  try {
    const { mode, ign } = req.params;
    
    if (!['fng', 'block', 'dm', 'kog'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    const db = req.app.locals.leaderboard_db;
    let playerStats;

    if (mode === 'kog') {
      playerStats = await db.getKogPlayerStats(ign);
    } else {
      playerStats = await db.getPlayerStats(mode, ign);
    }

    if (!playerStats) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(playerStats);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
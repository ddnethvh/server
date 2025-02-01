const express = require('express');
const router = express.Router();

// Get player stats for all modes
router.get('/:username/stats', async (req, res) => {
  try {
    const { username } = req.params;
    const db = req.app.locals.leaderboard_db;
    const auth_db = req.app.locals.auth_db;

    // First get the user's IGN from auth database
    const user = await auth_db.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const ign = user.ign;
    const modes = ['fng', 'block', 'dm', 'kog'];
    
    // Fetch stats for all modes using the consolidated method
    const statsPromises = modes.map(mode => 
      db.getPlayerStats(mode, ign)
    );

    const results = await Promise.all(statsPromises);
    
    // Convert array to object with modes as keys
    const stats = modes.reduce((acc, mode, index) => {
      acc[mode] = results[index];
      return acc;
    }, {});

    res.json({
      user: {
        username: user.username,
        ign: user.ign,
        created_at: user.created_at
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get player achievements/medals
router.get('/:username/achievements', async (req, res) => {
  try {
    const { username } = req.params;
    const db = req.app.locals.leaderboard_db;
    const auth_db = req.app.locals.auth_db;

    const user = await auth_db.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const achievements = await db.getPlayerAchievements(user.ign);
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 
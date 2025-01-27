const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middleware/auth');

// Public routes
router.get('/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    if (!['fng', 'block', 'kog', 'dm'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    const leaderboard = await req.app.locals.database.getLeaderboard(mode, limit);
    
    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get player stats
router.get('/:mode/player/:name', async (req, res) => {
  try {
    const { mode, name } = req.params;
    const stats = await req.app.locals.database.getPlayerStats(mode, name);
    
    if (!stats) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes - require API key
router.post('/:mode/rating', apiKeyAuth, async (req, res) => {
  try {
    const { mode } = req.params;
    const { playerName, ratingChange } = req.body;

    if (!['fng', 'block', 'dm'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode for rating update' });
    }

    await req.app.locals.database.updateRating(mode, playerName, ratingChange);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/kog/points', apiKeyAuth, async (req, res) => {
  try {
    const { playerName, points } = req.body;
    await req.app.locals.database.addPoints(playerName, points);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
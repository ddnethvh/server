const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        this.initializeTables();
      }
    });
  }

  initializeTables() {
    // FNG, Block, and DM tables use rating system
    const ratingTableSQL = `
      CREATE TABLE IF NOT EXISTS $table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        rating INTEGER DEFAULT 1500
      )
    `;

    // KoG table uses points system
    const pointsTableSQL = `
      CREATE TABLE IF NOT EXISTS kog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        points INTEGER DEFAULT 0
      )
    `;

    // Create tables for each mode
    this.db.exec(ratingTableSQL.replace('$table', 'fng'));
    this.db.exec(ratingTableSQL.replace('$table', 'block'));
    this.db.exec(ratingTableSQL.replace('$table', 'dm'));
    this.db.exec(pointsTableSQL);
  }

  // Rating-based methods (for FNG, Block, and DM)
  async updateRating(mode, playerName, ratingChange) {
    if (!['fng', 'block', 'dm'].includes(mode)) {
      throw new Error('Invalid mode for rating update');
    }

    const sql = `
      INSERT INTO ${mode} (name, rating)
      VALUES (?, 1500 + ?)
      ON CONFLICT(name) DO UPDATE SET
        rating = rating + ?
    `;

    return new Promise((resolve, reject) => {
      this.db.run(sql, [
        playerName,
        ratingChange,
        ratingChange
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Points-based methods (for KoG only)
  async addPoints(playerName, points) {
    const sql = `
      INSERT INTO kog (name, points)
      VALUES (?, ?)
      ON CONFLICT(name) DO UPDATE SET
        points = points + ?
    `;

    return new Promise((resolve, reject) => {
      this.db.run(sql, [
        playerName,
        points,
        points
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Get leaderboard for any mode
  async getLeaderboard(mode, limit = 100) {
    if (!['fng', 'block', 'dm', 'kog'].includes(mode)) {
      throw new Error('Invalid mode');
    }

    const isKog = mode === 'kog';
    const sql = `
      SELECT 
        name,
        ${isKog ? 'points' : 'rating'} as score
      FROM ${mode}
      ORDER BY ${isKog ? 'points' : 'rating'} DESC
      LIMIT ?
    `;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Get player stats
  async getPlayerStats(mode, playerName) {
    if (!['fng', 'block', 'dm', 'kog'].includes(mode)) {
      throw new Error('Invalid mode');
    }

    const sql = `SELECT * FROM ${mode} WHERE name = ?`;

    return new Promise((resolve, reject) => {
      this.db.get(sql, [playerName], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

module.exports = Database; 
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const os = require('os');
const fs = require('fs');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));
    this.DDNetDatabase = this.connectToDDNetDB();
    this.init();
  }

  connectToDDNetDB() {
    const homeDir = os.homedir();
    let ddnetPath;
    
    // Determine OS-specific path
    if (process.platform === 'win32') {
      // Try multiple possible Windows paths
      const possiblePaths = [
        path.join(homeDir, 'AppData', 'Local', 'DDNet', 'ddnet-server.sqlite'),
        path.join(homeDir, 'AppData', 'Roaming', 'DDNet', 'ddnet-server.sqlite')
      ];

      // Find the first path that exists
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          ddnetPath = possiblePath;
          break;
        }
      }

      if (!ddnetPath) {
        console.warn('DDNet database not found in common Windows locations');
        return null;
      }
    } else {
      ddnetPath = path.join(homeDir, '.local', 'share', 'ddnet', 'ddnet-server.sqlite');
    }

    try {
      // Check if file exists and is readable
      fs.accessSync(ddnetPath, fs.constants.R_OK);
      
      // Open database in read-only mode with more robust error handling
      const db = new sqlite3.Database(ddnetPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          console.error('Error opening DDNet database:', err);
          return null;
        }
      });

      // Test the connection
      db.get("SELECT 1", (err) => {
        if (err) {
          console.error('Error testing DDNet database connection:', err);
          db.close();
          return null;
        }
      });

      return db;
    } catch (error) {
      console.warn('Could not access DDNet database:', error);
      return null;
    }
  }

  init() {
    this.db.serialize(() => {
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
      this.db.run(ratingTableSQL.replace('$table', 'fng'));
      this.db.run(ratingTableSQL.replace('$table', 'block'));
      this.db.run(ratingTableSQL.replace('$table', 'dm'));
      this.db.run(pointsTableSQL);

      // Add KoG finishes table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS kog_finishes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          player_name TEXT NOT NULL,
          map_name TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          UNIQUE(player_name, map_name)
        )
      `);
    });

    // Load map points from JSON
    this.mapPoints = require('../map_points.json');
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

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(5, '0')}`;
  }

  getKogLeaderboard(mapName = null) {
    return new Promise(async (resolve, reject) => {
      if (!this.DDNetDatabase) {
        reject(new Error('DDNet database not available'));
        return;
      }

      let sql;
      let params = [];

      if (mapName) {
        sql = `
          WITH RankedTimes AS (
            SELECT 
              Name,
              Time,
              Timestamp,
              ROW_NUMBER() OVER (PARTITION BY Name ORDER BY Time ASC) as rn
            FROM record_race
            WHERE Map = ?
          )
          SELECT 
            Name as name,
            Time as time,
            Timestamp as timestamp,
            ROW_NUMBER() OVER (ORDER BY Time ASC) as rank,
            1 as score
          FROM RankedTimes
          WHERE rn = 1
          ORDER BY Time ASC
        `;
        params = [mapName];
      } else {
        sql = `
          SELECT 
            Name as name,
            COUNT(*) as finishes,
            ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rank
          FROM record_race
          GROUP BY Name
          ORDER BY finishes DESC
        `;
      }

      try {
        const rows = await new Promise((resolve, reject) => {
          this.DDNetDatabase.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });

        // Format times if it's a map-specific leaderboard
        if (mapName) {
          const formattedRows = rows.map(row => ({
            ...row,
            formattedTime: this.formatTime(row.time),
            timestamp: new Date(row.timestamp).toISOString()
          }));
          resolve(formattedRows);
        } else {
          // Calculate points for each player
          const rowsWithPoints = await Promise.all(
            rows.map(async (row) => {
              const playerPoints = await this.calculatePlayerPoints(row.name);
              return {
                ...row,
                points: playerPoints,
                score: playerPoints // for consistency with other leaderboards
              };
            })
          );
          
          // Sort by points
          rowsWithPoints.sort((a, b) => b.points - a.points);
          
          // Update ranks
          rowsWithPoints.forEach((row, index) => {
            row.rank = index + 1;
          });

          resolve(rowsWithPoints);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  calculatePlayerPoints(playerName) {
    return new Promise((resolve, reject) => {
      this.DDNetDatabase.all(
        'SELECT Map FROM record_race WHERE Name = ?',
        [playerName],
        (err, maps) => {
          if (err) {
            reject(err);
            return;
          }
          
          const totalPoints = maps.reduce((sum, { Map }) => {
            return sum + (this.mapPoints[Map] || 0);
          }, 0);
          
          resolve(totalPoints);
        }
      );
    });
  }

  getKogMaps() {
    return new Promise((resolve, reject) => {
      if (!this.DDNetDatabase) {
        reject(new Error('DDNet database not available'));
        return;
      }

      this.DDNetDatabase.all(`
        SELECT DISTINCT Map as map_name
        FROM record_race
        ORDER BY Map ASC
      `, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows.map(row => row.map_name));
      });
    });
  }

  getPlayerKogMaps(playerName) {
    return new Promise((resolve, reject) => {
      if (!this.DDNetDatabase) {
        reject(new Error('DDNet database not available'));
        return;
      }

      this.DDNetDatabase.all(`
        SELECT 
          Map as map_name,
          Time as time,
          Timestamp as timestamp
        FROM record_race
        WHERE Name = ?
        ORDER BY Timestamp DESC
      `, [playerName], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        // Format the data
        const formattedRows = rows.map(row => ({
          map_name: row.map_name,
          formattedTime: this.formatTime(row.time),
          timestamp: new Date(row.timestamp).toISOString()
        }));

        resolve(formattedRows);
      });
    });
  }

  addKogFinish(playerName, mapName) {
    return new Promise((resolve, reject) => {
      const timestamp = Math.floor(Date.now() / 1000);
      this.db.run(`
        INSERT OR REPLACE INTO kog_finishes (player_name, map_name, timestamp)
        VALUES (?, ?, ?)
      `, [playerName, mapName, timestamp], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }

  async getMapPoints(mapName) {
    return this.mapPoints[mapName] || null;
  }

  // Close database connection
  close() {
    this.db.close();
    if (this.DDNetDatabase) {
      this.DDNetDatabase.close();
    }
  }
}

module.exports = new Database(); 
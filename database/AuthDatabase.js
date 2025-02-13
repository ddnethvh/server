const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

class AuthDatabase {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));
    this.init();
  }

  init() {
    this.db.serialize(() => {
      // Create users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          ign TEXT UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });
  }

  // Create new user
  async createUser(username, password, ign) {
    // Add input validation
    if (!password || typeof password !== 'string') {
      throw new Error('Valid password is required');
    }
    
    // Trim and validate username
    if (!username || typeof username !== 'string') {
      throw new Error('Username is required');
    }
    username = username.trim();
    if (username.length === 0) {
      throw new Error('Username cannot be empty');
    }
    if (username.length > 16) {
      throw new Error('Username must be 1-16 characters');
    }

    // Trim and validate IGN
    if (!ign || typeof ign !== 'string') {
      throw new Error('IGN is required');
    }
    ign = ign.trim();
    if (ign.length === 0) {
      throw new Error('IGN cannot be empty');
    }
    if (ign.length > 16) {
      throw new Error('IGN must be 1-16 characters');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      return new Promise((resolve, reject) => {
        this.db.run(
          'INSERT INTO users (username, password, ign) VALUES (?, ?, ?)',
          [username, hashedPassword, ign],
          function(err) {
            if (err) {
              if (err.code === 'SQLITE_CONSTRAINT') {
                if (err.message.includes('username')) {
                  reject(new Error('Username already exists'));
                } else if (err.message.includes('ign')) {
                  reject(new Error('In-game name already exists'));
                }
              } else {
                reject(err);
              }
              return;
            }
            resolve(this.lastID);
          }
        );
      });
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  // Get user by username
  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  }

  // Get user by ID
  async getUserById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id, username, created_at FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        }
      );
    });
  }

  // Verify password
  async verifyPassword(username, password) {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return false;
    }

    return bcrypt.compare(password, user.password);
  }

  // Update password
  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE users 
         SET password = ?, 
             updated_at = DATETIME('now') 
         WHERE id = ?`,
        [hashedPassword, userId],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.changes > 0);
        }
      );
    });
  }

  // Delete user
  async deleteUser(userId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM users WHERE id = ?',
        [userId],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.changes > 0);
        }
      );
    });
  }

  // Search users (for admin purposes)
  async searchUsers(searchTerm, limit = 10) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT id, username, created_at 
         FROM users 
         WHERE username LIKE ? 
         LIMIT ?`,
        [`%${searchTerm}%`, limit],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        }
      );
    });
  }

  // Get user by IGN
  async getUserByIGN(ign) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE ign = ?',
        [ign],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

module.exports = new AuthDatabase();

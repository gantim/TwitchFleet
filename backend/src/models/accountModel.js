const pool = require('../config/db');

const AccountModel = {
  async getAll() {
    const result = await pool.query('SELECT id, oauth_token, type, active, current_channel, locked_until, created_at FROM accounts');
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByUsername(username) {
    const result = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);
    return result.rows[0];
  },

  async create({ username, oauth_token, type, active = false, current_channel = null, locked_until = null }) {
    const result = await pool.query(
      `INSERT INTO accounts (username, oauth_token, type, active, current_channel, locked_until)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [username, oauth_token, type, active, current_channel, locked_until]
    );
    return result.rows[0];
  },

  async update({ id, username, oauth_token, type, active, current_channel, locked_until }) {
    const result = await pool.query(
      `UPDATE accounts
       SET username = $1,
           oauth_token = $2,
           type = $3,
           active = $4,
           current_channel = $5,
           locked_until = $6
       WHERE id = $7
       RETURNING *`,
      [username, oauth_token, type, active, current_channel, locked_until, id]
    );
    return result.rows[0];
  },

    async deleteById(id) {
    const result = await pool.query('DELETE FROM accounts WHERE id = $1 RETURNING *', [id]);
    return result.rowCount;
  }
};

module.exports = AccountModel;

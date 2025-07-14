const pool = require('../config/db');

const UserModel = {
  async getAll() {
    const result = await pool.query('SELECT id, username, role FROM users');
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  },

  async create({ username, passwordHash, role = 'user' }) {
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, passwordHash, role]
    );
    return result.rows[0];
  },

  async deleteById(id) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async update(id, role) {
    const result = await pool.query(
        'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role',
        [role, id]
    );
    return result.rows[0];
  },

    async bindAccount(userId, accountId) {
    return pool.query(
      'INSERT INTO user_accounts (user_id, account_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, accountId]
    );
  },

  async bindMultipleAccounts(userId, accountIds) {
    const queries = accountIds.map(accountId =>
      pool.query(
        'INSERT INTO user_accounts (user_id, account_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [userId, accountId]
      )
    );
    return Promise.all(queries);
  },

  async getAllBindings() {
    const result = await pool.query(`
      SELECT u.id AS user_id, u.username, a.id AS account_id, a.username AS account_username
      FROM users u
      LEFT JOIN user_accounts ua ON u.id = ua.user_id
      LEFT JOIN accounts a ON ua.account_id = a.id
      ORDER BY u.id
    `);
    return result.rows;
  },

  async getAccountsByUser(userId) {
    const result = await pool.query(`
      SELECT a.*
      FROM accounts a
      JOIN user_accounts ua ON a.id = ua.account_id
      WHERE ua.user_id = $1
    `, [userId]);
    return result.rows;
  },

  async unbindAccount(userId, accountId) {
    return pool.query(
      'DELETE FROM user_accounts WHERE user_id = $1 AND account_id = $2',
      [userId, accountId]
    );
  },

  async unbindAllFromUser(userId) {
    return pool.query(
      'DELETE FROM user_accounts WHERE user_id = $1',
      [userId]
    );
  },

  async unbindAllFromAccount(accountId) {
    return pool.query(
      'DELETE FROM user_accounts WHERE account_id = $1',
      [accountId]
    );
  }
};

module.exports = UserModel;

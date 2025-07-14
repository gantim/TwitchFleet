const pool = require('../config/db');

const LogModel = {
  async addConnection(id, channel, action = 'connect') {
    const result = await pool.query(
      'INSERT INTO connection_logs (account_id, channel, action) VALUES ($1, $2, $3)',
      [id, channel, action]
    );
    return result.rows;
  },

  async addMessage( id, channel, message ) {
    const result = await pool.query(
      'INSERT INTO message_logs (account_id, channel, message) VALUES ($1, $2, $3)',
      [id, channel, message]
    );
    return result.rows;
  },

  async getConnection(id) {
    const result = await pool.query(
      'SELECT * FROM connection_logs WHERE account_id = $1 ORDER BY timestamp DESC',
      [id]
    );
    return result.rows;
  },

  async getMessage(id) {
    const result = await pool.query(
      'SELECT * FROM message_logs WHERE account_id = $1 ORDER BY timestamp DESC',
      [id]
    );
    return result.rows;
  },

  async getAllConnection() {
    const result = await pool.query(
      'SELECT * FROM connection_logs ORDER BY timestamp DESC'
    );
    return result.rows;
  },

  async getAllMessage() {
    const result = await pool.query(
      'SELECT * FROM message_logs ORDER BY timestamp DESC'
    );
    return result.rows;
  }
};

module.exports = LogModel;

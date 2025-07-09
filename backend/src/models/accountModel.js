const { Pool } = require('pg');
const pool = new Pool();

// Инициализация таблицы при старте (один раз)
async function initAccountTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      oauth_token TEXT NOT NULL,
      type TEXT CHECK (type IN ('chat', 'viewer')) NOT NULL,
      active BOOLEAN DEFAULT true,
      current_channel TEXT,
      locked_until TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(username)
    )
  `);
}

async function getActiveAccounts(type = 'chat') {
  const { rows } = await pool.query(
    'SELECT * FROM accounts WHERE active = true AND type = $1',
    [type]
  );
  return rows;
}

async function lockAccount(id, seconds = 10) {
  await pool.query(
    'UPDATE accounts SET locked_until = NOW() + ($1 || \' seconds\')::INTERVAL WHERE id = $2',
    [seconds, id]
  );
}

async function updateChannel(id, channel) {
  await pool.query(
    'UPDATE accounts SET current_channel = $1 WHERE id = $2',
    [channel, id]
  );
}

async function getAccountById(id) {
  const { rows } = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
  return rows[0];
}

async function getAvailableAccount(channel = null) {
  const { rows } = await pool.query(
    `SELECT * FROM accounts
     WHERE type = 'chat' AND active = true
       AND current_channel IS NOT NULL
       AND (locked_until IS NULL OR locked_until < NOW())
     LIMIT 1`
  );
  return rows[0];
}

module.exports = {
  initAccountTable,
  getActiveAccounts,
  lockAccount,
  updateChannel,
  getAccountById,
  getAvailableAccount,
  pool,
};

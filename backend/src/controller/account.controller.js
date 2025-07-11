const pool = require('../db');

class AccountController {
  async getAll(req, res) {
    const result = await pool.query('SELECT * FROM accounts ORDER BY id');
    res.json(result.rows);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Аккаунт не найден' });
    res.json(result.rows[0]);
  }

  async create(req, res) {
    const { username, oauth_token, type, active = true, current_channel = null, locked_until = null } = req.body;

    const result = await pool.query(
      `INSERT INTO accounts (username, oauth_token, type, active, current_channel, locked_until)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [username, oauth_token, type, active, current_channel, locked_until]
    );
    res.status(201).json(result.rows[0]);
  }

  async update(req, res) {
    const { id, username, oauth_token, type, active, current_channel, locked_until } = req.body;

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
    res.json(result.rows[0]);
  }

  async delete(req, res) {
    const { id } = req.params;
    await pool.query('DELETE FROM accounts WHERE id = $1', [id]);
    res.json({ message: 'Бот удалён' });
  }
}

module.exports = new AccountController();

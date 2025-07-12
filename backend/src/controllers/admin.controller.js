const bcrypt = require('bcrypt');
const pool = require('../config/db');

class AdminController {
  async getAllUsers(req, res) {
    const result = await pool.query('SELECT id, username, role FROM users');
    res.json(result.rows);
  }

  async getUser(req, res) {
    const { id } = req.params;
    const result = await pool.query('SELECT id, username, role FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(result.rows[0]);
  }

  async updateUserRole(req, res) {
    const { id, role } = req.body;
    const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role', [role, id]);
    res.json(result.rows[0]);
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Пользователь удалён' });
  }
  
  async createUser(req, res) {
    try {
        const { username, password, role = 'user' } = req.body;

        const candidate = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (candidate.rows.length) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
        [username, hash, role]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (e) {
        res.status(500).json({ error: 'Ошибка при создании пользователя' });
    }
    }
}

module.exports = new AdminController();

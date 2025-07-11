const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserController {
  async register(req, res) {
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
      res.status(500).json({ error: 'Ошибка регистрации' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

      if (!user.rows.length) {
        return res.status(401).json({ error: 'Неверное имя или пароль' });
      }

      const isValid = await bcrypt.compare(password, user.rows[0].password);
      if (!isValid) {
        return res.status(401).json({ error: 'Неверное имя или пароль' });
      }

      const token = jwt.sign(
        {
          id: user.rows[0].id,
          username: user.rows[0].username,
          role: user.rows[0].role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка входа' });
    }
  }

  async me(req, res) {
    try {
      const user = req.user; // уже в req из middleware
      res.json({ id: user.id, username: user.username, role: user.role });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка получения данных' });
    }
  }
}

module.exports = new UserController();
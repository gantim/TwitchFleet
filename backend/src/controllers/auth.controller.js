const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validate = require('../middleware/validate');
require('dotenv').config();

class AuthController {
  async register(req, res){
    try {
      const { username, password, role = 'user'} = req.body

      const errors = validate.validatePassName(username, password);
      if (errors.length > 0) {
        return res.status(400).json({ errors })
      }

      const checkUsername = await pool.query('SELECT * FROM users WHERE username = $1',
        [username])
      if (checkUsername.rows.length > 0) {
        return res.status(400).json({ error: 'Пользователь с таким логином уже существует'})
      }

      const hash = await bcrypt.hash(password, 10)
      const newUser = await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
        [username, hash, role]
      )

      return res.status(201).json(newUser.rows[0])
    } catch (e) {
      console.error('Ошибка регистрации:', e);
      res.status(500).json({error: 'Неизвестная ошибка регистрации'})
    }
  }

  async login(req, res){
    try {
      const username = req.body?.username;
      const password = req.body?.password;

      if (!username || !password) {
        return res.status(400).json({ error: 'Поля обязательны' });
      }

      const user = await pool.query('SELECT * FROM users WHERE username = $1',
        [username]
      )

      if (!user.rows.length) {
        return res.status(401).json({error: 'Неверный логин или пароль'})
      }

      const validPass = await bcrypt.compare(password, user.rows[0].password)
      if (!validPass) {
        return res.status(401).json({error: 'Неверный логин или пароль'})
      }

      const token = jwt.sign(
        {
          id: user.rows[0].id,
          username: user.rows[0].username,
          role: user.rows[0].role
        },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
      );

      res.json({ token });

    } catch (e) {
      console.error('Ошибка авторизации:', e);
      res.status(500).json({error: 'Неизвестная ошибка авторизации'})
    }
  }

  async me(req, res) {
    try {
      const user = req.user;
      res.json({ id: user.id, username: user.username, role: user.role });
    } catch (e) {
      console.error('Ошибка получения данных:', e);
      res.status(500).json({ error: 'Ошибка получения данных' });
    }
  }
}

module.exports = new AuthController();
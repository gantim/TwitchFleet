const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { useDebugValue } = require('react');
require('dotenv').config();

class Validate {
  async validatePassName(req, res){
    const { username, password } = req.body;
    const errors = []

    if (!username || username === 0) {
      errors.push('Имя пользователя обязательно')
    } else { 
      if (username.length <= 4 || username >= 32) {
        errors.push('Имя пользователя должно быть от 3 до 32 символов')
      }

      const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
      if(!usernameRegex.test(username)) {
        errors.push('Имя пользователя может содержать только латинские буквы, цифры, "-", "_" и "."')
      }
    }

    if (!password || password === 0) {
      errors.push('Пароль обязателен')
    } else { 
      if (password.length <= 4 || password >= 32) {
        errors.push('Пароль должен быть от 4 до 32 символов')
      }

      const passwordRegex = /^(?=.*[а-яА-Яa-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]).{6,64}$/;
      if(!passwordRegex.test(password)) {
        errors.push('Пароль должен содержать буквы, цифры и хотя бы один специальный символ')
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors })
    }

    return true
  }
}

class AuthController {
  async register(req, res){
    try {
      const { username, password, role = 'user'} = req.body

      const errors = Validate.validatePassName(username,password);
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
        'INSERT INTO user (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
        [username, hash, role]
      )

      return res.status(201).json(newUser.rows[0])
    } catch (e) {
      res.status(500).json({error: 'Неизвестная ошибка регистрации'})
    }
  }

  async login(req, res){
    try {
      const { username, password } = req.body;
      const user = pool.query('SELECT * FROM users WHERE username = $1',
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
      res.status(500).json({error: 'Неизвестная ошибка авторизации'})
    }
  }

  async me(req, res) {
    try {
      const user = req.user;
      res.json({ id: user.id,
                 username: user.username,
                 role: user.role });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка получения данных' });
    }
  }
}

module.exports = new AuthController();
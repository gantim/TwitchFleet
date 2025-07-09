const express = require('express');
const router = express.Router();
const { pool } = require('../models/accountModel');

// Добавить одного аккаунта
router.post('/accounts', async (req, res) => {
  const { username, oauth_token, type } = req.body;
  if (!username || !oauth_token || !type) {
    return res.status(400).json({ error: 'username, oauth_token, type обязательны' });
  }
  try {
    await pool.query(
      'INSERT INTO accounts (username, oauth_token, type) VALUES ($1, $2, $3)',
      [username, oauth_token, type]
    );
    res.json({ success: true });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: `Аккаунт '${username}' уже существует` });
    }
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Ошибка при добавлении аккаунта' });
  }
});

// Получить всех аккаунтов
router.get('/accounts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM accounts ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении аккаунтов' });
  }
});

// Активировать/деактивировать аккаунт
router.patch('/accounts/:id/activate', async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  if (typeof active !== 'boolean') {
    return res.status(400).json({ error: 'active должен быть true или false' });
  }

  try {
    await pool.query('UPDATE accounts SET active = $1 WHERE id = $2', [active, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при обновлении активности' });
  }
});

// Удалить аккаунт
router.delete('/accounts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM accounts WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при удалении аккаунта' });
  }
});

module.exports = router;

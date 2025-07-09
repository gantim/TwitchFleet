const express = require('express');
const router = express.Router();
const { connectAllToChannel } = require('../services/botManager');

router.post('/join-channel', async (req, res) => {
  const { channel } = req.body;
  if (!channel) {
    return res.status(400).json({ error: 'Поле channel обязательно' });
  }

  try {
    await connectAllToChannel(channel);
    res.json({ success: true });
  } catch (err) {
    console.error('[JOIN CHANNEL ERROR]', err);
    res.status(500).json({ error: 'Ошибка подключения ботов к каналу' });
  }
});

module.exports = router;

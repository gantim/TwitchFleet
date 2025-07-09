const express = require('express');
const router = express.Router();
const { sendMessage } = require('../services/botManager');

router.post('/send-message', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message обязателен' });
  }

  try {
    await sendMessage(message); // теперь без channel
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
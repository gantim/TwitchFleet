const LogModel = require('../models/logModel');

class LogsController {
  async getMessages(req, res) {
    try {
      const logs = await LogModel.getAllMessage();
      res.json(logs);
    } catch (e) {
      console.error('Ошибка получения логов сообщений:', e.message);
      res.status(500).json({ error: 'Ошибка получения логов сообщений' });
    }
  }

  async getConnections(req, res) {
    try {
      const logs = await LogModel.getAllConnection();
      res.json(logs);
    } catch (e) {
      console.error('Ошибка получения логов подключений:', e.message);
      res.status(500).json({ error: 'Ошибка получения логов подключений' });
    }
  }

  async getMessagesById(req, res) {
    try {
      const { id } = req.params;
      const logs = await LogModel.getMessage(id);
      res.json(logs);
    } catch (e) {
      console.error('Ошибка получения логов сообщений для аккаунта:', e.message);
      res.status(500).json({ error: 'Ошибка получения логов сообщений' });
    }
  }

  async getConnectionsById(req, res) {
    try {
      const { id } = req.params;
      const logs = await LogModel.getConnection(id);
      res.json(logs);
    } catch (e) {
      console.error('Ошибка получения логов подключений для аккаунта:', e.message);
      res.status(500).json({ error: 'Ошибка получения логов подключений' });
    }
  }
}

module.exports = new LogsController();

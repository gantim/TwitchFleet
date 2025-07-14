const AccountModel = require('../models/accountModel');
const LogModel = require('../models/logModel');
const tmi = require('tmi.js');

const activeClients = new Map();

class AccountController {
  async getAllAccounts(req, res) {
    try {
      const accounts = await AccountModel.getAll();
      res.json(accounts);
    } catch (e) {
      res.status(500).json({ error: 'Ошибка получения аккаунтов' });
    }
  }

  async getAccount(req, res) {
    try {
      const { id } = req.params;
      const account = await AccountModel.findById(id);
      if (!account) return res.status(404).json({ error: 'Аккаунт не найден' });
      res.json(account);
    } catch (e) {
      res.status(500).json({ error: 'Ошибка получения Аккаунта' });
    }
  }

  async createAccount(req, res) {
    try {
      const { username, oauth_token, type, active = false, current_channel = null, locked_until = null } = req.body;

      const existing = await AccountModel.findByUsername(username);
      if (existing) {
        return res.status(400).json({ error: 'Аккаунт уже существует' });
      }

      const newAccount = await AccountModel.create({ username, oauth_token, type, active, current_channel, locked_until });

      res.status(201).json(newAccount);
    } catch (e) {
      res.status(500).json({ error: 'Ошибка при создании аккаунта' });
    }
  }

  async updateAccount(req, res) {
    try {
      const { id, username, oauth_token, type, active, current_channel, locked_until } = req.body;

      const account = await AccountModel.findById(id);
      if (!account) return res.status(404).json({ error: 'Аккаунт не найден' });

      const updated = {
        username: username ?? account.username,
        oauth_token: oauth_token ?? account.oauth_token,
        type: type ?? account.type,
        active: typeof active === 'boolean' ? active : account.active,
        current_channel: current_channel ?? account.current_channel,
        locked_until: locked_until ?? account.locked_until
      };

      const updatedAccount = await AccountModel.update({ id, ...updated });

      res.status(201).json(updatedAccount);
    } catch (e) {
      res.status(500).json({ error: 'Ошибка при обновлении аккаунта' });
    }
  }

  async deleteAccount(req, res) {
    try {
      const { id } = req.params;
      const deletedCount = await AccountModel.deleteById(id);
      
      if (deletedCount === 0) {
        return res.status(404).json({ error: 'Аккаунт не найден' });
      }

      res.json({ message: 'Аккаунт удалён' });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка удаления аккаунта' });
    }
  }

  async connectAccount(req, res) {
    try {
      const { id } = req.params;
      const { channel } = req.body;

      if (!channel) {
        return res.status(400).json({ error: 'Не указан канал для подключения' });
      }

      const account = await AccountModel.findById(id);
      if (!account) return res.status(404).json({ error: 'Бот не найден' });

      if (account.type !== 'chat') {
        return res.status(400).json({ error: 'Можно подключать только чат-ботов' });
      }

      let previousChannel = null;
      
      if (activeClients.has(id)) {
        const oldClient = activeClients.get(id);

        try {
          await oldClient.disconnect();
        } catch (e) {
          if (!e.message.includes('Socket is not opened')) {
            console.error('Ошибка при отключении:', e.message);
          }
        }

        activeClients.delete(id);

        previousChannel = account.current_channel;
        if (previousChannel) {
          await LogModel.addConnection(id, previousChannel, 'disconnect');
        }
      }

      await AccountModel.update({
        ...account,
        current_channel: channel
      });

      const client = new tmi.Client({
        identity: {
          username: account.username,
          password: account.oauth_token,
        },
        channels: [channel],
      });

      await client.connect();
      await LogModel.addConnection(id, channel, 'connect');
      activeClients.set(id, client);

      res.json({ message: `Бот ${account.username} подключен к каналу ${channel}` });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка подключения аккаунта' });
    }
  }

  async disconnectAccount(req, res) {
    try {
      const { id } = req.params;
      const client = activeClients.get(id);

      if (!client) {
        return res.status(404).json({ error: 'Бот не подключён' });
      }

      const account = await AccountModel.findById(id);
      if (!account) {
        return res.status(404).json({ error: 'Аккаунт не найден' });
      }

      await client.disconnect();
      await LogModel.addConnection(id, account.current_channel, 'disconnect');
      activeClients.delete(id);

      res.json({ message: 'Бот отключён от чата' });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка отключения бота' });
    }
  }

  async messageAccount(req, res) {
    try {
      const { id } = req.params;
      const { text } = req.body;

      const client = activeClients.get(id);
      const account = await AccountModel.findById(id);

      if (!client || !account) {
        return res.status(404).json({ error: 'Бот не подключён' });
      }

      await client.say(account.current_channel || 'test1', text);
      await LogModel.addMessage(id, account.current_channel, text);
      res.json({ message: 'Сообщение отправлено' });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка отправки сообщения' });
    }
  }
}

module.exports = new AccountController();

const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const UserAccountService = require('../models/userModel');
const validate = require('../middleware/validate');

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAll();
      res.json(users);
    } catch (e) {
      res.status(500).json({ error: 'Ошибка получения пользователей' });
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
      res.json(user);
    } catch (e) {
      res.status(500).json({ error: 'Ошибка получения пользователя' });
    }
  }

  async updateUser(req, res) {
    try {
      const { id, username, password, role } = req.body;

      const user = await UserModel.findById(id);
      if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

      const validationErrors = validate.validatePassName(
        username ?? user.username,
        password ?? null
      );

      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
    
      const updatedFields = {
        username: username ?? user.username,
        role: role ?? user.role,
      };
      
      if (password) {
        const bcrypt = require('bcrypt');
        updatedFields.password = await bcrypt.hash(password, 10);
      } else {
        updatedFields.password = user.password;
      }

      const updated = await UserModel.update({ id, ...updatedFields });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: 'Ошибка обновления пользователя' });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await UserModel.deleteById(id);
      res.json({ message: 'Пользователь удалён' });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка удаления пользователя' });
    }
  }

  async createUser(req, res) {
    try {
      const { username, password, role = 'user' } = req.body;

      const validationErrors = validate.validatePassName(username, password);
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }

      const existing = await UserModel.findByUsername(username);
      if (existing) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
      }

      const hash = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({ username, passwordHash: hash, role });

      res.status(201).json(newUser);
    } catch (e) {
      res.status(500).json({ error: 'Ошибка при создании пользователя' });
    }
  }

  async addSingle(req, res) {
    try {
      const { user_id, account_id } = req.body;
      await UserAccountService.bindAccount(user_id, account_id);
      res.json({ message: 'Бот добавлен пользователю' });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка добавления бота' });
    }
  }

  async addMultiple(req, res) {
    try {
      const { user_id, account_ids } = req.body;
      await UserAccountService.bindMultipleAccounts(user_id, account_ids);
      res.json({ message: 'Боты добавлены пользователю' });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка при массовом добавлении' });
    }
  }

  async getAllBindings(req, res) {
    try {
      const bindings = await UserAccountService.getAllBindings();
      res.json(bindings);
    } catch (e) {
      console.error('Ошибка получения привязок:', e.message);
      res.status(500).json({ error: 'Ошибка получения привязок' });
    }
  }

  async getAccountsByUserId(req, res) {
    try {
      const { id } = req.params;
      const accounts = await UserAccountService.getAccountsByUser(id);
      res.json(accounts);
    } catch (e) {
      res.status(500).json({ error: 'Ошибка получения аккаунтов пользователя' });
    }
  }

  async unbindAccount(req, res) {
    try {
      const { user_id, account_id } = req.body;
      await UserAccountService.unbindAccount(user_id, account_id);
      res.json({ message: 'Бот отвязан от пользователя' });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка отвязки бота' });
    }
  }

  async unbindMultiple(req, res) {
    try {
      const { user_id, account_ids } = req.body;

      if (!Array.isArray(account_ids) || account_ids.length === 0) {
        return res.status(400).json({ error: 'Список аккаунтов пуст или некорректен' });
      }

      const queries = account_ids.map(accountId =>
        UserAccountService.unbindAccount(user_id, accountId)
      );

      await Promise.all(queries);
      res.json({ message: 'Выбранные боты отвязаны от пользователя' });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка массовой отвязки ботов' });
    }
  }

  async unbindAllFromUser(req, res) {
    try {
      const { user_id } = req.body;
      await UserAccountService.unbindAllFromUser(user_id);
      res.json({ message: 'Все боты отвязаны от пользователя' });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка отвязки всех ботов от пользователя' });
    }
  }

  async unbindAllFromAccount(req, res) {
    try {
      const { account_id } = req.body;
      await UserAccountService.unbindAllFromAccount(account_id);
      res.json({ message: 'Бот отвязан от всех пользователей' });
    } catch (e) {
      res.status(500).json({ error: 'Ошибка отвязки аккаунта' });
    }
  }
}

module.exports = new UserController();

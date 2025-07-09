const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
const { initAccountTable } = require('./models/accountModel');
const messageRoutes = require('./controllers/messageController');
const accountRoutes = require('./controllers/accountController');
const joinChannelRoutes = require('./controllers/joinChannelController');
const simulateRoutes = require('./controllers/simulateController');

dotenv.config();

app.use(express.json());

// Подключение маршрутов
app.use('/api', messageRoutes);
app.use('/api', accountRoutes);
app.use('/api', joinChannelRoutes);
app.use('/api', simulateRoutes);

// Запуск сервера
(async () => {
  try {
    await initAccountTable();
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Ошибка инициализации:', err);
    process.exit(1);
  }
})();
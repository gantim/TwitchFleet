const { server, broadcast } = require('./app');
const { initAccountTable } = require('./models/accountModel');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initAccountTable();
    server.listen(PORT, () => {
      console.log(`🚀 Сервер (с WS) запущен: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Ошибка запуска сервера:', err);
  }
})();
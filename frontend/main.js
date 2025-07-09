const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const log = require('electron-log');

// Настройка логов
log.transports.file.resolvePath = () => path.join(__dirname, 'logs/main.log');
autoUpdater.logger = log;
autoUpdater.logger.level = 'info';

// Подписка на события автообновления (для отладки)
autoUpdater.on('checking-for-update', () => {
  log.info('Проверка обновлений...');
});
autoUpdater.on('update-available', (info) => {
  log.info('Доступно обновление:', info.version);
});
autoUpdater.on('update-not-available', () => {
  log.info('Обновлений нет');
});
autoUpdater.on('error', (err) => {
  log.error('Ошибка при обновлении:', err);
});
autoUpdater.on('update-downloaded', () => {
  log.info('Обновление загружено, перезапуск...');
  autoUpdater.quitAndInstall();
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('dist/index.html');
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify(); // Запускаем проверку при старте
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

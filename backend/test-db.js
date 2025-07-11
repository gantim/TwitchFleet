const pool = require('./src/db');

(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ БД подключена. Время:', result.rows[0]);
  } catch (err) {
    console.error('❌ Ошибка подключения к БД:', err);
  } finally {
    process.exit();
  }
})();

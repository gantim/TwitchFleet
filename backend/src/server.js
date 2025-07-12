const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Сервер слушает на http://localhost:${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()
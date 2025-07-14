const dotenv = require('dotenv');
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');

dotenv.config()

const app = express();
app.use(express.json());

// // Проверка User-Agent
// app.use((req, res, next) => {
//   const ua = req.headers['user-agent'];
//   if (!ua || !ua.includes('MyFrontendApp')) {
//     return res.status(403).json({ error: 'Подозрительный User-Agent' });
//   }
//   next();
// });

// Проверка Origin
const allowedOrigins = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // если ты используешь cookie / авторизацию
};

app.use(cors(corsOptions));

// Rate Limit (пример — регистрация)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Слишком много регистраций с этого IP. Повторите позже.' }
});

const INTERNAL_HEADERS = {
  'Content-Type': 'application/json',
  'x-internal-key': process.env.INTERNAL_KEY
};

function forward(method, url, extraHeaders = {}) {
  return async (req, res) => {
    const headers = {
      ...INTERNAL_HEADERS,
      ...extraHeaders,
      Authorization: req.headers['authorization'] || ''
    };

    // console.log('[FORWARD]', method, `${process.env.BACKEND_URL}${url(req)}`);
    const response = await fetch(`${process.env.BACKEND_URL}${url(req)}`, {
      method,
      headers,
      body: ['GET', 'DELETE'].includes(method) ? undefined : JSON.stringify(req.body)
    });

    const text = await response.text();
    console.log('[BFF RAW RESPONSE]', text);

    const data = await response.json().catch(() => ({}));
    res.status(response.status).json(data);
  };
}

// AUTH
app.post('/auth/register', forward('POST', () => '/api/auth/register'));
app.post('/auth/login', forward('POST', () => '/api/auth/login'));
app.get('/auth/me', forward('GET', () => '/api/auth/me'));

// ACCOUNTS
app.get('/accounts', forward('GET', () => '/api/accounts'));
app.get('/accounts/:id', forward('GET', req => `/api/accounts/${req.params.id}`));
app.post('/accounts', forward('POST', () => '/api/accounts'));
app.put('/accounts', forward('PUT', () => '/api/accounts'));
app.delete('/accounts/:id', forward('DELETE', req => `/api/accounts/${req.params.id}`));
app.post('/accounts/connect/:id', forward('POST', req => `/api/accounts/connect/${req.params.id}`));
app.post('/accounts/disconnect/:id', forward('POST', req => `/api/accounts/disconnect/${req.params.id}`));
app.post('/accounts/message/:id', forward('POST', req => `/api/accounts/message/${req.params.id}`));

// LOGS
app.get('/logs/messages', forward('GET', () => '/api/logs/messages'));
app.get('/logs/connections', forward('GET', () => '/api/logs/connections'));
app.get('/logs/messages/:id', forward('GET', req => `/api/logs/messages/${req.params.id}`));
app.get('/logs/connections/:id', forward('GET', req => `/api/logs/connections/${req.params.id}`));

// USERS
app.get('/users', forward('GET', () => '/api/users'));
app.post('/users', forward('POST', () => '/api/users'));
app.put('/users', forward('PUT', () => '/api/users'));
app.delete('/users/:id', forward('DELETE', req => `/api/users/${req.params.id}`));
app.get('/users/all', forward('GET', () => '/api/users/all'));
app.get('/users/:id/accounts', forward('GET', req => `/api/users/${req.params.id}/accounts`));
app.post('/users/add', forward('POST', () => '/api/users/add'));
app.post('/users/add-multiple', forward('POST', () => '/api/users/add-multiple'));
app.post('/users/unbind', forward('POST', () => '/api/users/unbind'));
app.post('/users/unbind-multiple', forward('POST', () => '/api/users/unbind-multiple'));
app.post('/users/unbind-user', forward('POST', () => '/api/users/unbind-user'));
app.post('/users/unbind-account', forward('POST', () => '/api/users/unbind-account'));
app.get('/users/:id', forward('GET', req => `/api/users/${req.params.id}`));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Клиент WebSocket подключен');

  ws.on('message', (message) => {
    console.log('Сообщение от клиента:', message.toString());
    ws.send(`Принято: ${message.toString()}`);
  });

  ws.on('close', () => {
    console.log('Клиент отключился');
  });
});

const PORTBFF = process.env.PORTBFF || 4000;
server.listen(PORTBFF, () => console.log(`BFF работает на http://localhost:${PORTBFF}`));
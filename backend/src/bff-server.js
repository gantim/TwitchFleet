const dotenv = require('dotenv')
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

dotenv.config()

const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));
// // Проверка Origin
// const allowedOrigins = [process.env.FRONTEND_URL];
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (!origin || !allowedOrigins.includes(origin)) {
//     return res.status(403).json({ error: 'Запрещённый Origin' });
//   }
//   next();
// });

// // Проверка User-Agent
// app.use((req, res, next) => {
//   const ua = req.headers['user-agent'];
//   if (!ua || !ua.includes('MyFrontendApp')) {
//     return res.status(403).json({ error: 'Подозрительный User-Agent' });
//   }
//   next();
// });

// // Rate Limit (пример — регистрация)
// const registerLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 5,
//   message: { error: 'Слишком много регистраций с этого IP. Повторите позже.' }
// });


app.post('/auth/register', async (req, res) => {
  const response = await fetch(`${process.env.BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': process.env.INTERNAL_KEY
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.status(response.status).json(data);
});

app.post('/auth/login', async (req, res) => {
  const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': process.env.INTERNAL_KEY
    },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.status(response.status).json(data);
});

app.get('/auth/me', async (req, res) => {
  const response = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': req.headers['authorization'],
      'x-internal-key': process.env.INTERNAL_KEY
    }
  });

  const data = await response.json();
  res.status(response.status).json(data);
});

const PORTBFF = process.env.PORTBFF || 4000;
app.listen(PORTBFF, () => console.log(`BFF работает на http://localhost:${PORTBFF}`));

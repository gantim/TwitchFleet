const request = require('supertest');
const app = require('../app');
const internalKey = process.env.INTERNAL_KEY;

let token;

beforeAll(async () => {
  // Создаём пользователя и логинимся
  const username = 'user' + Math.random().toString(36).substring(2, 6);
  const password = 'Valid123!';

  await request(app).post('/api/auth/register').set('x-internal-key', internalKey).send({ username, password });
  const res = await request(app).post('/api/auth/login').set('x-internal-key', internalKey).send({ username, password });

  token = res.body.token;
});

describe('/me', () => {
  jest.setTimeout(10000); // увеличить таймаут (на всякий случай)

  it('валидный токен → user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('x-internal-key', internalKey)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username');
  });

  it('без токена → 401', async () => {
    const res = await request(app).get('/api/auth/me').set('x-internal-key', internalKey);
    expect(res.statusCode).toBe(401);
  });

  it('фейковый/протухший токен → 403', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('x-internal-key', internalKey)
      .set('Authorization', 'Bearer faketoken123');
    expect(res.statusCode).toBe(403);
  });
});

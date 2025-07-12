const request = require('supertest');
const app = require('../app');
const internalKey = process.env.INTERNAL_KEY;

describe('Логин', () => {
  const credentials = { username: 'user_' + Math.random(), password: 'StrongPass123!' };

  beforeAll(async () => {
    await request(app).post('/api/auth/register').set('x-internal-key', internalKey).send(credentials);
  });

  it('успешный логин → token есть', async () => {
    const res = await request(app).post('/api/auth/login').set('x-internal-key', internalKey).send(credentials);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('неверный логин → 401', async () => {
    const res = await request(app).post('/api/auth/login').set('x-internal-key', internalKey).send({ username: 'invalid', password: credentials.password });
    expect(res.statusCode).toBe(401);
  });

  it('неверный пароль → 401', async () => {
    const res = await request(app).post('/api/auth/login').set('x-internal-key', internalKey).send({ username: credentials.username, password: 'Wrong123!' });
    expect(res.statusCode).toBe(401);
  });

  it('пустые поля → 400', async () => {
    const res = await request(app).post('/api/auth/login').set('x-internal-key', internalKey).send({});
    expect(res.statusCode).toBe(400);
  });

  it('неверный формат запроса → 400', async () => {
    const res = await request(app).post('/api/auth/login').set('x-internal-key', internalKey).send('notjson');
    expect(res.statusCode).toBe(400);
  });
});
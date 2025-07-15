const request = require('supertest');
const app = require('../app');
const internalKey = process.env.INTERNAL_KEY;

describe('Регистрация', () => {
  const existingUser = 'existing_user_' + Math.random().toString(36).substring(2, 8);
  const validPassword = 'StrongPass123!';

  beforeAll(async () => {
    await request(app).post('/api/auth/register').set('x-internal-key', internalKey).send({
      username: existingUser,
      password: validPassword
    });
  });

  it('успешная регистрация', async () => {
    const res = await request(app).post('/api/auth/register').set('x-internal-key', internalKey).send({
      username: 'test_' + Math.random().toString(36).substring(2, 8),
      password: validPassword
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('username');
  });

  it('повторный username → 400', async () => {
    const res = await request(app).post('/api/auth/register').set('x-internal-key', internalKey).send({
      username: existingUser,
      password: validPassword
    });

    expect(res.statusCode).toBe(400);
  });

  it('пустые поля → 400', async () => {
    const res = await request(app).post('/api/auth/register').set('x-internal-key', internalKey).send({});
    expect(res.statusCode).toBe(400);
  });

  it('неверные символы в username → 400', async () => {
    const res = await request(app).post('/api/auth/register').set('x-internal-key', internalKey).send({
      username: 'invalid@user!',
      password: validPassword
    });
    expect(res.statusCode).toBe(400);
  });

  it('слишком короткий пароль → 400', async () => {
    const res = await request(app).post('/api/auth/register').set('x-internal-key', internalKey).send({
      username: 'shortpassuser',
      password: 'a1!'
    });
    expect(res.statusCode).toBe(400);
  });

  it('слабый пароль без спецсимволов → 400', async () => {
    const res = await request(app).post('/api/auth/register').set('x-internal-key', internalKey).send({
      username: 'weakpassuser',
      password: 'password123'
    });
    expect(res.statusCode).toBe(400);
  });

  it('SQL-инъекция / XSS → 400', async () => {
    const res = await request(app).post('/api/auth/register').set('x-internal-key', internalKey).send({
      username: '<script>alert(1)</script>',
      password: 'StrongPass123!'
    });
    expect(res.statusCode).toBe(400);
  });
});

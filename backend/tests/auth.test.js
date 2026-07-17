require('./setup');
const request = require('supertest');
const app = require('../src/app');

describe('Auth: POST /api/auth/signup', () => {
  it('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('User');
    expect(res.body.data.user.email).toBe('test@example.com');
  });

  it('rejects signup with a duplicate email', async () => {
    await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'dupe@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/signup').send({
      name: 'Another User',
      email: 'dupe@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects signup with invalid input (short password)', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test User',
      email: 'shortpass@example.com',
      password: '123',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects an Admin signup without the correct adminSecretKey', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Fake Admin',
      email: 'fakeadmin@example.com',
      password: 'password123',
      role: 'Admin',
      adminSecretKey: 'wrong-secret',
    });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('grants Admin role with the correct adminSecretKey', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Real Admin',
      email: 'realadmin@example.com',
      password: 'password123',
      role: 'Admin',
      adminSecretKey: process.env.ADMIN_SECRET_KEY,
    });

    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('Admin');
  });
});

describe('Auth: POST /api/auth/login', () => {
  const credentials = {
    name: 'Login User',
    email: 'login@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    await request(app).post('/api/auth/signup').send(credentials);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: credentials.email,
      password: credentials.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('rejects login with a wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: credentials.email,
      password: 'wrong-password',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects login for a non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
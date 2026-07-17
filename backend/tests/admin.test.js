require('./setup');
const request = require('supertest');
const app = require('../src/app');

const signupAs = async (email, role) => {
  const payload = { name: 'Test User', email, password: 'password123' };
  if (role === 'Admin') {
    payload.role = 'Admin';
    payload.adminSecretKey = process.env.ADMIN_SECRET_KEY;
  }
  const res = await request(app).post('/api/auth/signup').send(payload);
  return res.body.data.token;
};

describe('Admin routes', () => {
  it('blocks a standard User from /api/admin/logs', async () => {
    const userToken = await signupAs('regular@example.com', 'User');

    const res = await request(app)
      .get('/api/admin/logs')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('allows an Admin to view logs, and records an entry when a contact is created', async () => {
    const adminToken = await signupAs('admin@example.com', 'Admin');

    await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Logged Contact', email: 'logged@company.com' });

    const res = await request(app)
      .get('/api/admin/logs')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].action).toBe('ADD_CONTACT');
  });

  it('returns dashboard stats broken down by role', async () => {
    const adminToken = await signupAs('admin2@example.com', 'Admin');
    await signupAs('regular2@example.com', 'User');

    const res = await request(app)
      .get('/api/admin/dashboard-stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalUsers).toBe(2);
    expect(res.body.data.adminCount).toBe(1);
    expect(res.body.data.standardUsers).toBe(1);
  });
});
require('./setup');
const request = require('supertest');
const app = require('../src/app');

const registerAndLogin = async (email) => {
  const res = await request(app).post('/api/auth/signup').send({
    name: 'Contact Owner',
    email,
    password: 'password123',
  });
  return res.body.data.token;
};

describe('Contacts CRUD', () => {
  it('rejects unauthenticated access to contacts', async () => {
    const res = await request(app).get('/api/contacts');
    expect(res.status).toBe(401);
  });

  it('creates a contact for the authenticated user', async () => {
    const token = await registerAndLogin('owner1@example.com');

    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jane Doe',
        email: 'jane@company.com',
        phone: '1234567890',
        company: 'Acme Inc',
        status: 'Lead',
        notes: 'Met at a conference',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.contact.name).toBe('Jane Doe');
    expect(res.body.data.contact.status).toBe('Lead');
  });

  it('rejects creating a contact with an invalid email', async () => {
    const token = await registerAndLogin('owner2@example.com');

    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Bad Email', email: 'not-an-email' });

    expect(res.status).toBe(500); // controller currently surfaces Mongoose validation errors as 500
    expect(res.body.success).toBe(false);
  });

  it('lists only the requesting user\'s own contacts', async () => {
    const tokenA = await registerAndLogin('userA@example.com');
    const tokenB = await registerAndLogin('userB@example.com');

    await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'A Contact', email: 'acontact@company.com' });

    await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: 'B Contact', email: 'bcontact@company.com' });

    const resA = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(resA.status).toBe(200);
    expect(resA.body.data.contacts).toHaveLength(1);
    expect(resA.body.data.contacts[0].name).toBe('A Contact');
  });

  it('supports search by name', async () => {
    const token = await registerAndLogin('searcher@example.com');

    await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Findable Contact', email: 'findme@company.com' });

    await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Other Contact', email: 'other@company.com' });

    const res = await request(app)
      .get('/api/contacts?search=Findable')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.contacts).toHaveLength(1);
    expect(res.body.data.contacts[0].name).toBe('Findable Contact');
  });

  it('updates a contact and reflects the new status', async () => {
    const token = await registerAndLogin('updater@example.com');

    const createRes = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'To Update', email: 'update@company.com', status: 'Lead' });

    const contactId = createRes.body.data.contact._id;

    const updateRes = await request(app)
      .put(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Customer' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.contact.status).toBe('Customer');
  });

  it('prevents one user from updating another user\'s contact', async () => {
    const tokenA = await registerAndLogin('ownerX@example.com');
    const tokenB = await registerAndLogin('intruderY@example.com');

    const createRes = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Owned By A', email: 'ownedbya@company.com' });

    const contactId = createRes.body.data.contact._id;

    const updateRes = await request(app)
      .put(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ status: 'Customer' });

    expect(updateRes.status).toBe(404);
  });

  it('deletes a contact', async () => {
    const token = await registerAndLogin('deleter@example.com');

    const createRes = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'To Delete', email: 'delete@company.com' });

    const contactId = createRes.body.data.contact._id;

    const deleteRes = await request(app)
      .delete(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const listRes = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.body.data.contacts).toHaveLength(0);
  });
});
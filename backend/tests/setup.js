// Shared Jest setup for backend tests.
// Uses in-memory fakes for the User/Contact models (see
// src/models/__mocks__) instead of a real MongoDB connection, so the
// suite runs fast, offline, and identically on any machine or CI runner.

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_jwt_refresh_secret';
process.env.ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'test_admin_secret';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

jest.mock('../src/models/User');
jest.mock('../src/models/Contact');
jest.mock('../src/models/Log');

const User = require('../src/models/User');
const Contact = require('../src/models/Contact');
const Log = require('../src/models/Log');

afterEach(() => {
  User.__reset();
  Contact.__reset();
  Log.__reset();
});
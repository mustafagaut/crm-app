// Lightweight in-memory stand-in for the User Mongoose model.
// Implements only the methods the app actually calls (findOne, create,
// findById().select()), backed by a plain array so tests run instantly
// with no real database and no network access required.

const bcrypt = require('bcrypt');

let users = [];
let nextId = 1;

const makeId = () => String(nextId++);

const toPublic = (user) => ({ ...user });

function reset() {
  users = [];
  nextId = 1;
}

const FakeUser = {
  async findOne(query) {
    if (query.email) {
      return users.find((u) => u.email === query.email) || null;
    }
    return null;
  },

  async create(data) {
    const existing = users.find((u) => u.email === data.email);
    if (existing) {
      const err = new Error('E11000 duplicate key error: email already exists');
      throw err;
    }
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
      throw new Error('Please enter a valid email');
    }
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const user = {
      _id: makeId(),
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role || 'User',
      comparePassword(candidate) {
        return bcrypt.compare(candidate, hashed);
      },
    };
    users.push(user);
    return user;
  },

  findById(id) {
    // Mimics Mongoose's chainable `.findById(id).select('-password')`
    return {
      select: async () => {
        const user = users.find((u) => u._id === String(id));
        if (!user) return null;
        const { password, comparePassword, ...rest } = user;
        return rest;
      },
    };
  },

  async countDocuments(query = {}) {
    if (query.role) {
      return users.filter((u) => u.role === query.role).length;
    }
    return users.length;
  },

  __reset: reset,
  __all: () => users.map(toPublic),
};

module.exports = FakeUser;
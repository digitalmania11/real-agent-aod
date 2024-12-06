const request = require('supertest');
const express = require('express');
const {
  createUser,
  getUsers,
  getUserRole,
  updateUserRole,
  markUserAsFraud,
} = require('./path/to/user.controller');

// Mock MongoDB dependencies
jest.mock('../config/database', () => ({
  getDB: jest.fn(() => ({
    collection: jest.fn(() => ({
      findOne: jest.fn().mockImplementation((query) => {
        if (query.email === 'existing@example.com') {
          return Promise.resolve({ email: 'existing@example.com', role: 'user' });
        }
        return Promise.resolve(null);
      }),
      find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([
          { email: 'test@example.com', role: 'user' },
        ]),
      })),
      insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockInsertedId' }),
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    })),
  })),
}));

const app = express();
app.use(express.json());
app.post('/users', createUser);
app.get('/users', getUsers);
app.get('/users/role', getUserRole);
app.patch('/users/role', updateUserRole);
app.patch('/users/fraud', markUserAsFraud);

describe('User Controller API', () => {
  describe('POST /users', () => {
    it('should create a new user if not existing', async () => {
      const userData = { email: 'newuser@example.com', role: 'user' };
      const response = await request(app).post('/users').send(userData);

      expect(response.statusCode).toBe(200);
      expect(response.body.insertedId).toBe('mockInsertedId');
    });

    it('should return a message if the user already exists', async () => {
      const userData = { email: 'existing@example.com' };
      const response = await request(app).post('/users').send(userData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('user already exist');
      expect(response.body.insertedId).toBe(null);
    });
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const response = await request(app).get('/users');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { email: 'test@example.com', role: 'user' },
      ]);
    });

    it('should return a user by email', async () => {
      const response = await request(app).get('/users?email=test@example.com');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { email: 'test@example.com', role: 'user' },
      ]);
    });
  });

  describe('GET /users/role', () => {
    it('should return the role of a user', async () => {
      const response = await request(app).get('/users/role?email=existing@example.com');

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('user');
    });

    it('should return null for a non-existent user', async () => {
      const response = await request(app).get('/users/role?email=nonexistent@example.com');

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeUndefined();
    });
  });

  describe('PATCH /users/role', () => {
    it('should update the role of a user', async () => {
      const response = await request(app).patch('/users/role?id=mockUserId&role=admin');

      expect(response.statusCode).toBe(200);
      expect(response.body.modifiedCount).toBe(1);
    });
  });

  describe('PATCH /users/fraud', () => {
    it('should mark a user as fraud and update properties status', async () => {
      const response = await request(app).patch('/users/fraud?id=mockUserId&email=fraud@example.com');

      expect(response.statusCode).toBe(200);
      expect(response.body.result.modifiedCount).toBe(1);
      expect(response.body.result2.modifiedCount).toBe(1);
    });
  });
});

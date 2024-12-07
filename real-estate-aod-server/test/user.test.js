const request = require('supertest');
const { ObjectId } = require("mongodb");
const express = require('express');
const {
  createUser,
  getUsers,
  getUserRole,
  updateUserRole,
  markUserAsFraud,
} = require('../controllers/user.controller.js');

const mockDb = require("../config/database").getDB();

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
      updateMany: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
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
      expect(response.body).toBe('user'); // Expected role
    });
  
    it('should return undefined for a non-existent user', async () => {
      const response = await request(app).get('/users/role?email=nonexistent@example.com');

      console.log(response.body);
  
      expect(response.statusCode).toBe(200);
      expect(response.body === undefined || Object.keys(response.body).length === 0).toBe(true);// Expected undefined for no match
    });
  });

  describe('PATCH /users/role', () => {
    it('should update the role of a user', async () => {
      // Create a valid ObjectId for testing
      const validObjectId = new ObjectId();
      
      // Mock the database to expect this specific ObjectId
      jest.spyOn(mockDb.collection(), 'updateOne').mockResolvedValue({ modifiedCount: 1 });
  
      const response = await request(app)
        .patch(`/users/role?id=${validObjectId.toString()}&role=admin`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.modifiedCount).toBe(1);
    });
  });
  describe('PATCH /users/fraud', () => {
    it('should mark a user as fraud and update properties status', async () => {
      // Create a valid ObjectId for testing
      const validObjectId = new ObjectId();
      const testEmail = 'fraud@example.com';
  
      // Mock database to simulate expected behavior
      const mockCollection = mockDb.collection();
      jest.spyOn(mockCollection, 'updateOne').mockResolvedValue({ modifiedCount: 1 });
      jest.spyOn(mockCollection, 'updateMany').mockResolvedValue({ modifiedCount: 1 });
  
      // Send request to the endpoint
      const response = await request(app).patch(
        `/users/fraud?id=${validObjectId.toString()}&email=${testEmail}`
      );
  
      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body.result.modifiedCount).toBe(1);
      expect(response.body.result2.modifiedCount).toBe(1);
    });
});
});

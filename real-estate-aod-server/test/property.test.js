const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

jest.mock('../config/database', () => ({
  getDB: jest.fn(() => ({
    collection: jest.fn(() => ({
      find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([
          {
            _id: '65f8d3b7b3e4c74f5c9a1234',
            propertyTitle: 'Mock Property',
            agentEmail: 'agent@example.com',
            status: 'pending',
          },
        ]),
      })),
      findOne: jest.fn((query) => {
        if (query._id.toString() === '65f8d3b7b3e4c74f5c9a1234') {
          return Promise.resolve({
            _id: '65f8d3b7b3e4c74f5c9a1234',
            propertyTitle: 'Mock Property',
            status: 'pending',
          });
        }
        return Promise.resolve(null);
      }),
      insertOne: jest.fn(() =>
        Promise.resolve({
          insertedId: '65f8d3b7b3e4c74f5c9a1234',
        })
      ),
      updateOne: jest.fn(() =>
        Promise.resolve({
          modifiedCount: 1,
        })
      ),
      deleteOne: jest.fn(() =>
        Promise.resolve({
          deletedCount: 1,
        })
      ),
    })),
  })),
}));

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn((filePath) =>
        Promise.resolve({
          secure_url: `https://cloudinary.com/mock/${filePath}`,
        })
      ),
    },
  },
}));

jest.mock('fs', () => ({
  unlinkSync: jest.fn(),
  existsSync: jest.fn(() => true),
}));

const {
  getAllProperties,
  getPropertyById,
  updateProperty,
  createProperty,
  deleteProperty,
  verifyProperty,
  rejectProperty,
  VideoUpload,
} = require('../controllers/property.controller');

const app = express();
app.use(express.json());

app.get('/properties', getAllProperties);
app.get('/properties/:id', getPropertyById);
app.post('/properties', createProperty);
app.put('/properties/:id', updateProperty);
app.delete('/properties/:id', deleteProperty);
app.put('/properties/verify', verifyProperty);
app.put('/properties/reject', rejectProperty);
app.post('/properties/video', VideoUpload);

describe('Properties Controller', () => {
  describe('GET /properties', () => {
    it('should return all properties', async () => {
      const response = await request(app).get('/properties');
      expect(response.status).toBe(200);
      expect(response.body.propertiesData).toBeInstanceOf(Array);
      expect(response.body.countData).toBeGreaterThan(0);
    });
  });

  describe('GET /properties/:id', () => {
    it('should return a single property by ID', async () => {
      const validObjectId = '65f8d3b7b3e4c74f5c9a1234';
      const response = await request(app).get(`/properties/${validObjectId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', validObjectId);
    });

    it('should return 400 for invalid ObjectId', async () => {
      const response = await request(app).get('/properties/invalidId');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid ObjectId format');
    });
  });

  describe('POST /properties', () => {
    it('should create a new property', async () => {
      const newProperty = {
        propertyTitle: 'New Property',
        agentEmail: 'agent@example.com',
        status: 'pending',
      };
      const response = await request(app).post('/properties').send(newProperty);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('insertedId');
    });
  });

  describe('PUT /properties/:id', () => {
    it('should update a property', async () => {
      const validObjectId = '65f8d3b7b3e4c74f5c9a1234';
      const updateData = { propertyTitle: 'Updated Property' };
      const response = await request(app).put(`/properties/${validObjectId}`).send(updateData);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('modifiedCount', 1);
    });
  });

  describe('DELETE /properties/:id', () => {
    it('should delete a property', async () => {
      const validObjectId = '65f8d3b7b3e4c74f5c9a1234';
      const response = await request(app).delete(`/properties/${validObjectId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('deletedCount', 1);
    });
  });

  describe('PUT /properties/verify', () => {
    it('should verify a property', async () => {
      const response = await request(app).put('/properties/verify').query({ id: '65f8d3b7b3e4c74f5c9a1234' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('modifiedCount', 1);
    });
  });

  describe('PUT /properties/reject', () => {
    it('should reject a property', async () => {
      const response = await request(app).put('/properties/reject').query({ id: '65f8d3b7b3e4c74f5c9a1234' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('modifiedCount', 1);
    });
  });

  describe('POST /properties/video', () => {
    it('should upload a video to Cloudinary', async () => {
      const response = await request(app).post('/properties/video').attach('VideoPitch', 'path/to/mock/video.mp4');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('videoUrl');
    });
  });
});

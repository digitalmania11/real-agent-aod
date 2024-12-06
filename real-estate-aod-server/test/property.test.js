const request = require('supertest');
const express = require('express');
const fs = require('fs');
const {
  getAllProperties,
  getPropertyById,
  updateProperty,
  createProperty,
  deleteProperty,
  verifyProperty,
  rejectProperty,
  VideoUpload,
} = require('../controllers/property.controller.js');

jest.mock('../config/database', () => ({
  getDB: jest.fn(() => ({
    collection: jest.fn(() => ({
      find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([{ id: 'mockPropertyId', title: 'Test Property' }]),
      })),
      findOne: jest.fn().mockResolvedValue({ id: 'mockPropertyId', title: 'Test Property' }),
      insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockInsertedId' }),
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      countDocuments: jest.fn().mockResolvedValue(1),
    })),
  })),
}));

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn().mockResolvedValue({ url: 'mockCloudinaryUrl' }),
    },
  },
}));

const app = express();
app.use(express.json());
app.get('/properties', getAllProperties);
app.get('/properties/:id', getPropertyById);
app.put('/properties/:id', updateProperty);
app.post('/properties', createProperty);
app.delete('/properties/:id', deleteProperty);
app.patch('/properties/verify', verifyProperty);
app.patch('/properties/reject', rejectProperty);
app.post('/properties/video', VideoUpload);

describe('Property Controller API', () => {
  describe('GET /properties', () => {
    it('should return a list of properties', async () => {
      const response = await request(app).get('/properties?status=active');

      expect(response.statusCode).toBe(200);
      expect(response.body.propertiesData).toEqual([{ id: 'mockPropertyId', title: 'Test Property' }]);
      expect(response.body.countData).toBe(1);
    });
  });

  describe('GET /properties/:id', () => {
    it('should return a property by ID', async () => {
      const response = await request(app).get('/properties/mockPropertyId');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ id: 'mockPropertyId', title: 'Test Property' });
    });
  });

  describe('POST /properties', () => {
    it('should create a new property', async () => {
      const propertyData = { title: 'New Property' };
      const response = await request(app).post('/properties').send(propertyData);

      expect(response.statusCode).toBe(201);
      expect(response.body.insertedId).toBe('mockInsertedId');
    });
  });

  describe('PUT /properties/:id', () => {
    it('should update a property by ID', async () => {
      const updatedData = { title: 'Updated Property' };
      const response = await request(app).put('/properties/mockPropertyId').send(updatedData);

      expect(response.statusCode).toBe(200);
      expect(response.body.modifiedCount).toBe(1);
    });
  });

  describe('DELETE /properties/:id', () => {
    it('should delete a property by ID', async () => {
      const response = await request(app).delete('/properties/mockPropertyId');

      expect(response.statusCode).toBe(200);
      expect(response.body.deletedCount).toBe(1);
    });
  });

  describe('PATCH /properties/verify', () => {
    it('should verify a property', async () => {
      const response = await request(app).patch('/properties/verify?id=mockPropertyId');

      expect(response.statusCode).toBe(200);
      expect(response.body.modifiedCount).toBe(1);
    });
  });

  describe('PATCH /properties/reject', () => {
    it('should reject a property', async () => {
      const response = await request(app).patch('/properties/reject?id=mockPropertyId');

      expect(response.statusCode).toBe(200);
      expect(response.body.modifiedCount).toBe(1);
    });
  });

  describe('POST /properties/video', () => {
    it('should upload a video to Cloudinary and return the URL', async () => {
      jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});
      const mockFilePath = 'mock/path/to/video.mp4';

      jest.mocked(fs.unlinkSync).mockImplementationOnce(() => {});

      const mockReq = {
        files: {
          VideoPitch: [
            {
              path: mockFilePath,
            },
          ],
        },
      };

      const response = await request(app).post('/properties/video').send(mockReq);

      expect(response.statusCode).toBe(200);
      expect(response.body.videoUrl).toBe('mockCloudinaryUrl');
    });
  });
});

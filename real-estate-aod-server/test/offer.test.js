const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');

// Import controllers after setting up the mock
jest.mock('../config/database', () => ({
  getDB: jest.fn(() => ({
    collection: jest.fn(() => ({
      find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([
          { 
            _id: '65f8d3b7b3e4c74f5c9a1234', // Use string representation of ObjectId
            propertyID: 'mockPropertyId', 
            agentEmail: 'agent@example.com',
            buyerEmail: 'buyer@example.com',
            status: 'pending'
          }
        ])
      })),
      findOne: jest.fn().mockImplementation((query) => {
        if (query._id) {
          return Promise.resolve({ 
            _id: '65f8d3b7b3e4c74f5c9a1234',
            propertyID: 'mockPropertyId',
            status: 'pending'
          });
        }
        return Promise.resolve(null);
      }),
      insertOne: jest.fn().mockResolvedValue({ 
        insertedId: '65f8d3b7b3e4c74f5c9a1234'
      }),
      updateOne: jest.fn().mockResolvedValue({ 
        modifiedCount: 1 
      }),
      updateMany: jest.fn().mockResolvedValue({ 
        modifiedCount: 1 
      })
    }))
  }))
}));

// Import controllers after setting up the mock
const { 
  getOffers, 
  getOfferById, 
  createOffer, 
  acceptOffer, 
  rejectOffer 
} = require('../controllers/offer.controller');

const app = express();
app.use(express.json());

// Setup routes
app.get('/offers', getOffers);
app.get('/offers/:id', getOfferById);
app.post('/offers', createOffer);
app.put('/offers/accept', acceptOffer);
app.put('/offers/reject', rejectOffer);

describe('Offers Controller', () => {
  describe('GET /offers', () => {
    it('should return offers by property ID', async () => {
      const response = await request(app).get('/offers?id=mockPropertyId');
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return offers by agent email', async () => {
      const response = await request(app).get('/offers?agentEmail=agent@example.com');
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return offers by buyer email', async () => {
      const response = await request(app).get('/offers?buyerEmail=buyer@example.com');
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /offers/:id', () => {
    it('should return a single offer by valid ID', async () => {
      const validObjectId = '65f8d3b7b3e4c74f5c9a1234';
      
      const response = await request(app).get(`/offers/${validObjectId}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('_id', validObjectId);
      expect(response.body).toHaveProperty('propertyID', 'mockPropertyId');
    });

    it('should return 400 for invalid ObjectId', async () => {
      const response = await request(app).get('/offers/invalidId');
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid ObjectId format');
    });
  });

  describe('POST /offers', () => {
    it('should create a new offer', async () => {
      const offerData = {
        propertyID: 'newPropertyId',
        agentEmail: 'agent@example.com',
        buyerEmail: 'buyer@example.com',
        status: 'pending'
      };
      
      const response = await request(app).post('/offers').send(offerData);
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('insertedId');
    });
  });

  describe('PUT /offers/accept', () => {
    it('should accept an offer', async () => {
      const validObjectId = '65f8d3b7b3e4c74f5c9a1234';
      
      const response = await request(app)
        .put('/offers/accept')
        .query({ 
          id: validObjectId, 
          title: 'Test Property' 
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('result1');
      expect(response.body).toHaveProperty('result2');
    });

    it('should return 400 for invalid ObjectId', async () => {
      const response = await request(app)
        .put('/offers/accept')
        .query({ 
          id: 'invalidId', 
          title: 'Test Property' 
        });
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid ObjectId format');
    });
  });

  describe('PUT /offers/reject', () => {
    it('should reject an offer', async () => {
      const validObjectId = '65f8d3b7b3e4c74f5c9a1234';
      
      const response = await request(app)
        .put('/offers/reject')
        .query({ id: validObjectId });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('modifiedCount', 1);
    });

    it('should return 400 for invalid ObjectId', async () => {
      const response = await request(app)
        .put('/offers/reject')
        .query({ id: 'invalidId' });
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid ObjectId format');
    });
  });
});
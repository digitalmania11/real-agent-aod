const request = require('supertest');
const { getOffers, getOfferById, createOffer, acceptOffer, rejectOffer } = require('../controllers/offer.controller');
const express = require('express');
const app = express();
const { getDB } = require('../config/database');

// Mock MongoDB database methods
jest.mock('../config/database', () => ({
  getDB: jest.fn(() => ({
    collection: jest.fn(() => ({
      find: jest.fn(() => ({
        toArray: jest.fn(),
      })),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      updateMany: jest.fn(),
    })),
  })),
}));

// Middleware setup for the test
app.use(express.json());
app.get('/offers', getOffers);
app.get('/offers/:id', getOfferById);
app.post('/offers', createOffer);
app.put('/offers/accept', acceptOffer);
app.put('/offers/reject', rejectOffer);

describe('Offers Controller Tests', () => {

  afterEach(() => {
    jest.clearAllMocks(); // Clears all mock calls after each test
  });

  // Test GET /offers
  it('should return offers based on query parameters', async () => {
    // Mock database response
    const mockOffers = [{ propertyID: '123', agentEmail: 'agent@example.com' }];
    getDB().collection().find().toArray.mockResolvedValue(mockOffers);

    const response = await request(app).get('/offers').query({ id: '123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOffers);
    expect(getDB().collection().find().toArray).toHaveBeenCalledTimes(1);
  });

  // Test GET /offers/:id
  it('should return an offer by its ID', async () => {
    const mockOffer = { _id: '123', propertyTitle: 'Test Property' };
    getDB().collection().findOne.mockResolvedValue(mockOffer);

    const response = await request(app).get('/offers/123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOffer);
    expect(getDB().collection().findOne).toHaveBeenCalledWith({ _id: expect.any(Object) });
  });

  // Test POST /offers
  it('should create a new offer', async () => {
    const newOffer = { propertyTitle: 'New Property', agentEmail: 'agent@example.com' };
    getDB().collection().insertOne.mockResolvedValue({ insertedId: '123' });

    const response = await request(app).post('/offers').send(newOffer);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('insertedId');
    expect(getDB().collection().insertOne).toHaveBeenCalledWith(newOffer);
  });

  // Test PUT /offers/accept
  it('should accept an offer and reject others', async () => {
    const mockResult1 = { matchedCount: 1, modifiedCount: 1 };
    const mockResult2 = { matchedCount: 1, modifiedCount: 1 };
    getDB().collection().updateOne.mockResolvedValue(mockResult1);
    getDB().collection().updateMany.mockResolvedValue(mockResult2);

    const response = await request(app).put('/offers/accept').query({ title: 'Test Property', id: '123' });

    expect(response.status).toBe(200);
    expect(response.body.result1).toEqual(mockResult1);
    expect(response.body.result2).toEqual(mockResult2);
    expect(getDB().collection().updateOne).toHaveBeenCalledWith(
      { _id: expect.any(Object) },
      { $set: { status: 'accepted' } }
    );
    expect(getDB().collection().updateMany).toHaveBeenCalledWith(
      { propertyTitle: 'Test Property', status: 'pending' },
      { $set: { status: 'rejected' } }
    );
  });

  // Test PUT /offers/reject
  it('should reject an offer', async () => {
    const mockResult = { matchedCount: 1, modifiedCount: 1 };
    getDB().collection().updateOne.mockResolvedValue(mockResult);

    const response = await request(app).put('/offers/reject').query({ id: '123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResult);
    expect(getDB().collection().updateOne).toHaveBeenCalledWith(
      { _id: expect.any(Object) },
      { $set: { status: 'rejected' } }
    );
  });
});

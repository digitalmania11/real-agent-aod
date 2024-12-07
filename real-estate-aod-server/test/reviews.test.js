const request = require('supertest');
const express = require('express');
const { getReviews, createReview, deleteReview } = require('../controllers/review.controller.js');
const { ObjectId } = require("mongodb");

// Mock MongoDB dependencies
const mockDb = require("../config/database").getDB();

jest.mock('../config/database', () => ({
  getDB: jest.fn(() => ({
    collection: jest.fn(() => ({
      find: jest.fn(() => ({
        sort: jest.fn(() => ({
          toArray: jest.fn().mockResolvedValue([
            { reviewId: 'mockReviewId', reviewText: 'Great property!' },
          ]),
        })),
      })),
      insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockInsertedId' }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    })),
  })),
}));

const app = express();
app.use(express.json());
app.get('/reviews', getReviews);
app.post('/reviews', createReview);
app.delete('/reviews/:id', deleteReview);

describe('Reviews Controller API', () => {
  describe('GET /reviews', () => {
    it('should return a list of reviews by property ID', async () => {
      const response = await request(app).get('/reviews?id=mockPropertyId');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { reviewId: 'mockReviewId', reviewText: 'Great property!' },
      ]);
    });

    it('should return a list of reviews by user email', async () => {
      const response = await request(app).get('/reviews?email=test@example.com');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { reviewId: 'mockReviewId', reviewText: 'Great property!' },
      ]);
    });
  });

  describe('POST /reviews', () => {
    it('should create a new review', async () => {
      const reviewData = { reviewText: 'Excellent service!' };
      const response = await request(app).post('/reviews').send(reviewData);

      expect(response.statusCode).toBe(200);
      expect(response.body.insertedId).toBe('mockInsertedId');
    });
  });

  describe('DELETE /reviews/:id', () => {
    it('should delete a review by ID', async () => {
      // Create a valid ObjectId for testing
      const validObjectId = new ObjectId();
  
      // Mock database to simulate expected behavior
      const mockCollection = mockDb.collection();
      jest.spyOn(mockCollection, 'deleteOne').mockResolvedValue({ deletedCount: 1 });
  
      // Send request to the endpoint
      const response = await request(app).delete(`/reviews/${validObjectId.toString()}`);
  
      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body.deletedCount).toBe(1);
    });
  });
});

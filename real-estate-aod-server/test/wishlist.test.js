const request = require('supertest');
const express = require('express');
const {
  getWishlists,
  getWishlistById,
  createWishlist,
  deleteWishlist,
} = require("../controllers/wishlist.controller.js");

// Mock MongoDB dependencies
jest.mock('../config/database', () => ({
  getDB: jest.fn(() => ({
    collection: jest.fn(() => ({
      find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([
          { wishlistId: 'mockWishlistId', itemName: 'Dream House' },
        ]),
      })),
      findOne: jest.fn().mockResolvedValue({
        wishlistId: 'mockWishlistId',
        itemName: 'Dream House',
      }),
      insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockInsertedId' }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    })),
  })),
}));

const app = express();
app.use(express.json());
app.get('/wishlists', getWishlists);
app.get('/wishlists/:id', getWishlistById);
app.post('/wishlists', createWishlist);
app.delete('/wishlists/:id', deleteWishlist);

describe('Wishlists Controller API', () => {
  describe('GET /wishlists', () => {
    it('should return a list of wishlists by user email', async () => {
      const response = await request(app).get('/wishlists?email=test@example.com');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { wishlistId: 'mockWishlistId', itemName: 'Dream House' },
      ]);
    });
  });

  describe('GET /wishlists/:id', () => {
    it('should return a wishlist by ID', async () => {
      const validObjectId = "64a8f2d64e95b8521c234567"; // Example valid ObjectId
      const response = await request(app).get(`/wishlists/${validObjectId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        wishlistId: 'mockWishlistId',
        itemName: 'Dream House',
      });
    });
  });

  describe('POST /wishlists', () => {
    it('should create a new wishlist', async () => {
      const wishlistData = { itemName: 'Luxury Apartment' };
      const response = await request(app).post('/wishlists').send(wishlistData);

      expect(response.statusCode).toBe(200);
      expect(response.body.insertedId).toBe('mockInsertedId');
    });
  });

  describe('DELETE /wishlists/:id', () => {
    it('should delete a wishlist by ID', async () => {
      const validObjectId = "64a8f2d64e95b8521c234567"; // Replace with a valid ObjectId
      const response = await request(app).delete(`/wishlists/${validObjectId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.deletedCount).toBe(1);
    });
  });
});

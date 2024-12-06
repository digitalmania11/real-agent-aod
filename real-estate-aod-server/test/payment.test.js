const request = require('supertest');
const express = require('express');
const { getPayments, createPayment, createPaymentIntent } = require('../controllers/payment.controller.js');

// Mock MongoDB and Stripe dependencies
jest.mock('../config/database', () => ({
  getDB: jest.fn(() => ({
    collection: jest.fn(() => ({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([{ paymentId: 'test123' }]),
      }),
      insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockPaymentId' }),
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    })),
  })),
}));

jest.mock('stripe', () => jest.fn(() => ({
  paymentIntents: {
    create: jest.fn(({ amount, currency, payment_method_types }) => {
      if (amount && currency === 'usd' && payment_method_types.includes('card')) {
        return Promise.resolve({ client_secret: 'mockClientSecret' });
      } else {
        return Promise.reject(new Error('Invalid parameters'));
      }
    }),
  },
})));

// jest.mock('stripe', () => jest.fn(() => ({
//   paymentIntents: {
//     create: jest.fn(({ amount, currency, payment_method_types }) => {
//       // Check for valid parameters
//       if (amount && currency === 'usd' && payment_method_types.includes('card')) {
//         return Promise.resolve({ client_secret: 'mockClientSecret' });
//       } else {
//         // Reject if parameters are not valid
//         return Promise.reject(new Error('Invalid parameters'));
//       }
//     }),
//   },
// })));

const app = express();
app.use(express.json());
app.get('/payments', getPayments);
app.post('/payments', createPayment);
app.post('/payments/intent', createPaymentIntent);

describe('Payments Module API', () => {
  describe('GET /payments', () => {
    it('should return a list of payments', async () => {
      const response = await request(app).get('/payments?agentEmail=test@example.com');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([{ paymentId: 'test123' }]);
    });
  });

  describe('POST /payments', () => {
    it('should create a new payment and update offer status', async () => {
      const paymentData = {
        offersId: '507f191e810c19729de860ea',
        transactionId: 'mockTransactionId',
      };

      const response = await request(app).post('/payments').send(paymentData);

      expect(response.statusCode).toBe(200);
      expect(response.body.result.insertedId).toBe('mockPaymentId');
      expect(response.body.updateStatus.modifiedCount).toBe(1);
    });
  });

  describe('POST /payments/intent', () => {
    it('should create a payment intent with the correct amount', async () => {
      const response = await request(app).post('/payments/intent').send({ price: 50 });

      expect(response.statusCode).toBe(200);
      expect(response.body.clientSecret).toBe('mockClientSecret');
    });

    it('should return an error for invalid payment parameters', async () => {
      jest.mocked(require('stripe')().paymentIntents.create).mockRejectedValueOnce(new Error('Invalid parameters'));

      const response = await request(app).post('/payments/intent').send({});

      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Invalid parameters');
    });
  });
});

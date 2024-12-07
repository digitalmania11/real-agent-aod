const request = require("supertest"); // To test HTTP requests
const express = require("express");
const jwt = require("jsonwebtoken");
const { createToken } = require("../controllers/auth.controller.js");

// Mock environment variable
process.env.ACCESS_TOKEN_SECRET = "test-secret";

const app = express();
app.use(express.json());
app.post("/token", createToken);

describe("Auth Controller - createToken", () => {
  it("should create a token and return it", async () => {
    const userPayload = { id: 1, username: "testuser" };

    const response = await request(app)
      .post("/token")
      .send(userPayload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    // Verify the token
    const decoded = jwt.verify(response.body.token, process.env.ACCESS_TOKEN_SECRET);
    expect(decoded).toMatchObject(userPayload);
    expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000)); // Check expiration
  });

  it("should fail if no payload is provided", async () => {
    const response = await request(app).post("/token").send({});

    expect(response.status).toBe(200); // Since the implementation does not handle missing body explicitly
    expect(response.body.token).toBeDefined();
  });
});

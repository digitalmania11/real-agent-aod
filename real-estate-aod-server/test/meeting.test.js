const request = require("supertest");
const express = require("express");
const { MongoClient } = require("mongodb");
const {
  scheduleMeetup,
  updateMeetupStatus,
  concludeMeetup,
  getMeetups,
  getMeetingStatus,
} = require("../controllers/meeting.controller.js");

const app = express();
app.use(express.json());

// Mock endpoints
app.post("/schedule-meetup", scheduleMeetup);
app.put("/update-meetup-status", updateMeetupStatus);
app.put("/conclude-meetup", concludeMeetup);
app.get("/meetups", getMeetups);
app.get("/meeting-status", getMeetingStatus);

// Mock database setup
const mockMeetupsCollection = "meetups";

let connection;
let mockDb;

beforeAll(async () => {
  connection = await MongoClient.connect("mongodb://localhost:27017/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  mockDb = connection.db("testdb");

  jest.mock("../config/database", () => ({
    getDB: jest.fn(() => mockDb)
  }));
});

afterAll(async () => {
  if (connection) {
    await connection.close();
  }
});

describe("Property Controller Tests", () => {
  beforeEach(async () => {
    const collection = mockDb.collection(mockMeetupsCollection);
    await collection.deleteMany({});
  });

  test("should schedule a meetup successfully", async () => {
    const meetup = {
      buyerEmail: "buyer@example.com",
      agentEmail: "agent@example.com",
      propertyId: "507f1f77bcf86cd799439011",
      date: "2024-12-06",
      time: "15:30",
      location: "123 Main St",
    };

    const response = await request(app)
      .post("/schedule-meetup")
      .send(meetup);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Meetup scheduled successfully.");
    expect(response.body.data.insertedId).toBeDefined();
  });

  test("should not schedule a meetup with missing fields", async () => {
    const meetup = {
      buyerEmail: "buyer@example.com",
    };

    const response = await request(app)
      .post("/schedule-meetup")
      .send(meetup);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("All fields are required.");
  });

  test("should update meetup status successfully", async () => {
    const meetup = {
      buyerEmail: "buyer@example.com",
      agentEmail: "agent@example.com",
      propertyId: "507f1f77bcf86cd799439011",
      date: "2024-12-06",
      time: "15:30",
      location: "123 Main St",
    };

    const { insertedId } = await mockDb.collection(mockMeetupsCollection).insertOne(meetup);

    const response = await request(app)
      .put("/update-meetup-status")
      .send({ meetupId: insertedId.toString(), status: "confirmed" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Meetup status updated to confirmed.");
  });

  test("should conclude a meetup successfully", async () => {
    const meetup = {
      buyerEmail: "buyer@example.com",
      agentEmail: "agent@example.com",
      propertyId: "507f1f77bcf86cd799439011",
      date: "2024-12-06",
      time: "15:30",
      location: "123 Main St",
    };

    const { insertedId } = await mockDb.collection(mockMeetupsCollection).insertOne(meetup);

    const response = await request(app)
      .put("/conclude-meetup")
      .send({ meetupId: insertedId.toString(), role: "agent", feedback: "Great meetup" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Meetup marked as concluded.");
  });

  test("should get meetups by user", async () => {
    const meetup1 = {
      buyerEmail: "buyer@example.com",
      agentEmail: "agent@example.com",
      propertyId: "507f1f77bcf86cd799439011",
      date: "2024-12-06",
      time: "15:30",
      location: "123 Main St",
    };

    const meetup2 = {
      buyerEmail: "anotherbuyer@example.com",
      agentEmail: "agent@example.com",
      propertyId: "507f1f77bcf86cd799439012",
      date: "2024-12-07",
      time: "16:00",
      location: "456 Main St",
    };

    await mockDb.collection(mockMeetupsCollection).insertMany([meetup1, meetup2]);

    const response = await request(app)
    .get("/meetups")
    .query({ 
      email: "agent@example.com", 
      role: "agent",
      limit: 2
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(2);
  });

  test("should return meeting status for a property and buyer", async () => {
    const meetup = {
      buyerEmail: "buyer@example.com",
      agentEmail: "agent@example.com",
      propertyId: "507f1f77bcf86cd799439011",
      date: "2024-12-06",
      time: "15:30",
      location: "123 Main St",
    };

    await mockDb.collection(mockMeetupsCollection).insertOne(meetup);

    const response = await request(app)
      .get("/meeting-status")
      .query({ propertyId: "507f1f77bcf86cd799439011", buyerEmail: "buyer@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.buyerEmail).toBe("buyer@example.com");
  });
});
const request = require("supertest");
const express = require("express");
const { ObjectId } = require("mongodb");

// Mock the database and the getDB function
jest.mock("../config/database", () => {
  const mockDb = {
    collection: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({ toArray: jest.fn() }),
      insertOne: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
    }),
  };
  return { getDB: jest.fn(() => mockDb) };
});

const { getTrainingMaterials, addTrainingMaterial, getQuizzes, addQuiz, submitQuiz } = require("../controllers/lms.controller.js");

const app = express();
app.use(express.json());
app.get("/training-materials", getTrainingMaterials);
app.post("/training-materials", addTrainingMaterial);
app.get("/quizzes", getQuizzes);
app.post("/quizzes", addQuiz);
app.post("/quizzes/submit", submitQuiz);

describe("User Controller", () => {
  const mockDb = require("../config/database").getDB();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTrainingMaterials", () => {
    it("should return a list of training materials", async () => {
      const materials = [
        { title: "Material 1", description: "Description 1" },
        { title: "Material 2", description: "Description 2" },
      ];

      mockDb.collection().find().toArray.mockResolvedValue(materials);

      const response = await request(app).get("/training-materials");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, materials });
    });

    it("should return a 500 error on failure", async () => {
      mockDb.collection().find().toArray.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/training-materials");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: "Database error" });
    });
  });

  describe("addTrainingMaterial", () => {
    it("should add a training material and return it", async () => {
      const newMaterial = {
        title: "Material Title",
        description: "Material Description",
        type: "video",
        contentUrl: "http://example.com/material",
      };

      mockDb.collection().insertOne.mockResolvedValue({ ops: [newMaterial] });

      const response = await request(app).post("/training-materials").send(newMaterial);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ success: true, material: newMaterial });
    });

    it("should return a 500 error on failure", async () => {
      mockDb.collection().insertOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/training-materials").send({});

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: "Database error" });
    });
  });

  describe("getQuizzes", () => {
    it("should return a list of quizzes", async () => {
      const quizzes = [
        { title: "Quiz 1" },
        { title: "Quiz 2" },
      ];

      mockDb.collection().find().toArray.mockResolvedValue(quizzes);

      const response = await request(app).get("/quizzes");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, quizzes });
    });
  });

  describe("addQuiz", () => {
    it("should add a quiz and return it", async () => {
      const newQuiz = {
        title: "Quiz Title",
        questions: [
          {
            question: "Question text",
            options: ["Option A", "Option B"],
            correctAnswer: "Option A",
          },
        ],
        passingScore: 7,
      };

      mockDb.collection().insertOne.mockResolvedValue({ ops: [newQuiz] });

      const response = await request(app).post("/quizzes").send(newQuiz);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ success: true, quiz: newQuiz });
    });
  });

  describe("submitQuiz", () => {
    it("should calculate the score and update the user", async () => {
      const quiz = {
        _id: "quiz123",
        questions: [
          {
            question: "Question text",
            correctAnswer: "Option A",
          },
        ],
        passingScore: 1,
      };

      const agentId = "agent123";
      const answers = ["Option A"];

      mockDb.collection().findOne.mockResolvedValue(quiz);
      mockDb.collection().updateOne.mockResolvedValue({ matchedCount: 1 });

      const response = await request(app).post("/quizzes/submit").send({
        agentId,
        quizId: quiz._id,
        answers,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, score: 1, passed: true });
    });
  });
});
// src/controllers/user.controller.js
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

const usersCollection = () => getDB().collection("users");
const trainingMaterialsCollection = () => getDB().collection("trainingMaterials");
const quizzesCollection = () => getDB().collection("quizzes");


exports.getTrainingMaterials = async (req, res) => {
    try {
      const materials = await trainingMaterialsCollection().find().toArray();
      res.status(200).json({ success: true, materials });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  // Add training material

//   {
//     "title": "Material Title",
//     "description": "Material Description",
//     "type": "video | guide | faq | article",
//     "contentUrl": "URL to the material"
//   }

exports.addTrainingMaterial = async (req, res) => {
  console.log("req.body", req.body);
  try {
    // Insert multiple modules if req.body.modules is an array
    const result = await trainingMaterialsCollection().updateMany(req.body.modules);

    console.log("Insertion result:", result);
    res.status(201).json({ success: true, materials: result.insertedIds });
  } catch (error) {
    console.error("Insertion error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

  
  // Get quizzes
exports.getQuizzes = async (req, res) => {
    try {
      const quizzes = await quizzesCollection().find().toArray();
      res.status(200).json({ success: true, quizzes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };


  // Add a quiz

//   {
//     "title": "Quiz Title",
//     "questions": [
//       {
//         "question": "Question text",
//         "options": ["Option A", "Option B", "Option C", "Option D"],
//         "correctAnswer": "Option A"
//       }
//     ],
//     "passingScore": 7
//   }

exports.PdfUpload = async (req, res) => {
  try {
    if (req.files && req.files.PdfDocument) {
      const pdfFilePath = req.files.PdfDocument[0].path;

      console.log(pdfFilePath);

      const pdfUploadResponse = await uploadCloudinary(pdfFilePath);

      console.log("pdfUploadResponse", pdfUploadResponse);

      if (pdfUploadResponse || pdfUploadResponse.secure_url) {
        res.status(200).json({ pdfUrl: pdfUploadResponse.secure_url });
      } else {
        res.status(500).json({ error: "Failed to retrieve PDF URL from Cloudinary." });
      }
    } else {
      return res.status(400).json({ error: "No PDF file provided." });
    }
  } catch (error) {
    console.error("Error uploading PDF to Cloudinary:", error);
    res.status(500).json({ error: "Failed to upload PDF." });
  }
};


exports.addQuiz = async (req, res) => {
    try {
      const result = await quizzesCollection().insertOne(req.body);
      res.status(201).json({ success: true, quiz: result.ops[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };



// Submit quiz
exports.submitQuiz = async (req, res) => {
    try {
      const { agentId, quizId, answers } = req.body;
      const quiz = await quizzesCollection().findOne({ _id: quizId });
  
      if (!quiz) {
        return res.status(404).json({ success: false, message: 'Quiz not found' });
      }
  
      let score = 0;
      quiz.questions.forEach((q, idx) => {
        if (q.correctAnswer === answers[idx]) {
          score += 1;
        }
      });
  
      const passingScore = quiz.passingScore || Math.ceil(quiz.questions.length * 0.7);
  
      const updateResult = await usersCollection().updateOne(
        { _id: agentId },
        {
          $push: { quizScores: { quizId, score } },
          $set: { isOnboarded: score >= passingScore },
        }
      );
  
      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ success: false, message: 'Agent not found' });
      }
  
      res.status(200).json({
        success: true,
        score,
        passed: score >= passingScore,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
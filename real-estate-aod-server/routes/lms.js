const express = require('express');
const {
  getTrainingMaterials,
  getAgentStatus,
  addTrainingMaterial,
  getQuizzes,
  addQuiz,
  submitQuiz,
  PdfUpload,
} = require('../controllers/lms.controller');
const {upload,handleUpload} = require("../middleware/pdf.middleware");
const router = express.Router();
/**
 * @route   GET /api/lms/training-materials
 * @desc    Get all training materials
 * @access  Super Admin
 */
router.get('/training-materials', getTrainingMaterials);

/**
 * @route   POST /api/lms/training-materials
 * @desc    Add a new training material
 * @access  Super Admin
 */
router.put('/training-materials', addTrainingMaterial);

// router.post("/properties/video",upload,handleUpload,VideoUpload);
router.post('/module/pdf-upload',upload,handleUpload,PdfUpload);
router.use(express.static(__dirname + '/public'));

/**
 * @route   GET /api/lms/quizzes
 * @desc    Get all quizzes
 * @access  Super Admin / Agents
 */
// router.get('/quizzes', getQuizzes);

/**
 * @route   POST /api/lms/quizzes
 * @desc    Add a new quiz
 * @access  Super Admin
 */
router.post('/quizzes', addQuiz);

/**
 * @route   POST /api/lms/quizzes/:quizId/submit
 * @desc    Submit quiz answers
 * @access  Agents
 */
router.post('/quizzes/:quizId/submit', submitQuiz);

/**
 * @route   GET /api/lms/agents/:agentId/status
 * @desc    Get agent onboarding status
 * @access  Super Admin / Agents
 */
// router.get('/agents/:agentId/status', getAgentStatus);

module.exports = router;

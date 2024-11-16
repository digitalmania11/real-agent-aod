const router = require("express").Router();
const {
  getReviews,
  createReview,
  deleteReview,
} = require("../controllers/review.controller");

router.get("/reviews", getReviews);
router.post("/reviews", createReview);
router.delete("/reviews/:id", deleteReview);

module.exports = router;


// src/routes/property.routes.js
const router = require("express").Router();
const {
  getAllProperties,
  getPropertyById,
  updateProperty,
  createProperty,
  deleteProperty,
  verifyProperty,
  rejectProperty
} = require("../controllers/property.controller");

router.get("/properties", getAllProperties);
router.get("/properties/:id", getPropertyById);
router.patch("/properties/:id", updateProperty);
router.post("/properties", createProperty);
router.delete("/properties/:id", deleteProperty);
router.patch("/make-verified", verifyProperty);
router.patch("/make-rejected", rejectProperty);

module.exports = router;
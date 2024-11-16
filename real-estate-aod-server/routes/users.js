

// src/routes/user.routes.js
const router = require("express").Router();
const {
  createUser,
  getUsers,
  getUserRole,
  updateUserRole,
  markUserAsFraud
} = require("../controllers/user.controller");

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/role", getUserRole);
router.patch("/users", updateUserRole);
router.patch("/users/fraud", markUserAsFraud);

module.exports = router;
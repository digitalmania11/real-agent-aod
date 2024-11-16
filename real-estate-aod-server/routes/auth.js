
// src/routes/auth.routes.js
const router = require("express").Router();
const { createToken } = require("../controllers/auth.controller");

router.post("/jwt", createToken);

module.exports = router;    
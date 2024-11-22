const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token for authenticated routes
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the token is provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Add decoded user to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = { authenticateToken };

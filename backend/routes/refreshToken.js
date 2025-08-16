const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

// Refresh Token Route
router.post("/refresh", authMiddleware, (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated request

    // Generate a new token
    const newToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({ token: newToken });
  } catch (error) {
    return res.status(500).json({ message: "Error generating refresh token.", error: error.message });
  }
});

module.exports = router;
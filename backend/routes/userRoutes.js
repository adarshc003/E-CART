const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

exports.getUserProfile = async (req, res) => {
  res.json(req.user);
};
router.get("/profile", protect, exports.getUserProfile);

module.exports = router;

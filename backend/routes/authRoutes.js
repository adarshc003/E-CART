const express = require("express");
const { register, login, verifyOtp } = require("../controllers/authController");

const router = express.Router();
const { googleAuth } = require("../controllers/authController");


router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/google", googleAuth);


const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});


const upload = require("../middleware/uploadMiddleware");
const { updateProfile } = require("../controllers/authController");

router.put(
  "/update-profile",
  protect,
  upload.single("profileImage"),
  updateProfile
);


module.exports = router;

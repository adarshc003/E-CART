const express = require("express");
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  buyNowCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:productId", protect, removeFromCart);
router.put("/update", protect, updateCart);
router.post("/buy-now", protect, buyNowCart);


module.exports = router;

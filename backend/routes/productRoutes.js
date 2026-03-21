const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getRecommendations,
} = require("../controllers/productController");

const { protect, sellerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

// Get all products (no approval logic now)
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

/* ================= RECOMMENDATION ROUTE ================= */
router.get("/:id/recommendations", getRecommendations);

/* ================= SELLER ROUTES ================= */

// Create product
router.post("/", protect, sellerOnly, createProduct);

// Seller's products
router.get("/my/products", protect, sellerOnly, getMyProducts);

// Update product
router.put("/:id", protect, sellerOnly, updateProduct);

// Delete product
router.delete("/:id", protect, sellerOnly, deleteProduct);

module.exports = router;

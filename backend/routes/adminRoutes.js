const express = require("express");
const {
  getSellerRequests,
  approveSeller,
  removeSeller,
  getSellers,
  getUsers,
  toggleUser,
  getAllProducts,
  removeProduct,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

// sellers
router.get("/seller-requests", getSellerRequests);
router.put("/approve-seller/:id", approveSeller);
router.delete("/remove-seller/:id", removeSeller);
router.get("/sellers", getSellers);

// users
router.get("/users", getUsers);
router.put("/toggle-user/:id", toggleUser);

// products (NO APPROVAL)
router.get("/products", getAllProducts);
router.delete("/products/:id", removeProduct);

module.exports = router;

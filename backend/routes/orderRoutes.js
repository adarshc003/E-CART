const express = require("express");
const {
  
  getMyOrders,
  placeCODOrder,
  placeOnlineOrder,
  getSellerOrders,
  updateSellerOrderStatus,
  getSellerEarnings,
  requestCancelOrder,
  approveCancellation,
} = require("../controllers/orderController");
const { protect, sellerOnly } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/my", protect, getMyOrders);
router.get("/seller", protect, sellerOnly, getSellerOrders);
router.get("/seller/earnings", protect, sellerOnly, getSellerEarnings);
router.post("/cod", protect, placeCODOrder);
router.post("/online", protect, placeOnlineOrder);
router.put("/seller/status",protect,sellerOnly,updateSellerOrderStatus);
router.put("/cancel/request", protect, requestCancelOrder);
router.put("/cancel/approve", protect, sellerOnly, approveCancellation);




module.exports = router;

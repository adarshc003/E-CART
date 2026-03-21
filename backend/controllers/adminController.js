const User = require("../models/User");
const Product = require("../models/Product");

/* ================= SELLER REQUESTS ================= */
exports.getSellerRequests = async (req, res) => {
  try {
    const sellers = await User.find({
      role: "seller",
      isSellerApproved: false,
    });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= APPROVE SELLER ================= */
exports.approveSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.isSellerApproved = true;
    await seller.save();

    res.json({ message: "Seller approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REMOVE SELLER ================= */
exports.removeSeller = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Seller removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET SELLERS ================= */
exports.getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET USERS (ONLY NORMAL USERS) ================= */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
      isSellerApproved: { $ne: true },
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= BLOCK / UNBLOCK USER ================= */
exports.toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: "User status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL PRODUCTS ================= */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "seller",
      "name email"
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REMOVE PRODUCT ================= */
exports.removeProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed by admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

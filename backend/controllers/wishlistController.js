const User = require("../models/User");

/* ================= GET WISHLIST ================= */
exports.getWishlist = async (req, res) => {
  try {
    
    if (req.user.role === "admin") {
      return res.json([]);
    }

    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADD TO WISHLIST ================= */
exports.addToWishlist = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot use wishlist" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.wishlist.includes(req.body.productId)) {
      user.wishlist.push(req.body.productId);
      await user.save();
    }

    res.json({ message: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REMOVE FROM WISHLIST ================= */
exports.removeFromWishlist = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot use wishlist" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.id
    );

    await user.save();
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

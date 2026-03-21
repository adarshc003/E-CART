const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
 // ADMIN
if (decoded.role === "admin") {
  req.user = { role: "admin", _id: decoded.id || null };
  return next();
}


  const user = await User.findById(decoded.id);
  if (!user || user.isBlocked)
    return res.status(403).json({ message: "Access denied" });

  req.user = user;
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};

const sellerOnly = (req, res, next) => {
  if (
    req.user.role !== "seller" ||
    !req.user.isSellerApproved
  ) {
    return res.status(403).json({ message: "Seller not approved" });
  }
  next();
};

module.exports = { protect, adminOnly, sellerOnly };

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ===============================
// GET MY ORDERS
// ===============================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// PLACE COD ORDER
// ===============================
const placeCODOrder = async (req, res) => {
  try {
    const { addressId } = req.body;

    if (!addressId) {
      return res.status(400).json({ message: "Address required" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

const orderItems = [];

for (const item of cart.items) {
  const product = await Product.findById(item.product._id);

  // 🚫 Check stock
  if (!product || product.stock < item.quantity) {
    return res.status(400).json({
      message: `Not enough stock for ${product?.name || "product"}`
    });
  }

  // ✅ Reduce stock
  product.stock -= item.quantity;
  await product.save();

  orderItems.push({
    product: product._id,
    seller: product.seller,
    quantity: item.quantity,
    price: product.price,
  });
}

const order = await Order.create({
  user: req.user._id,
  items: orderItems,
  totalAmount,
  address: addressId,
  paymentMethod: "COD", 
  paymentStatus: "PENDING", 
});


    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const placeOnlineOrder = async (req, res) => {
  try {
    const { addressId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

 const orderItems = [];

for (const item of cart.items) {
  const product = await Product.findById(item.product._id);

  // 🚫 Check stock
  if (!product || product.stock < item.quantity) {
    return res.status(400).json({
      message: `Not enough stock for ${product?.name || "product"}`
    });
  }

  // ✅ Reduce stock
  product.stock -= item.quantity;
  await product.save();

  orderItems.push({
    product: product._id,
    seller: product.seller,
    quantity: item.quantity,
    price: product.price,
  });
}

const order = await Order.create({
  user: req.user._id,
  items: orderItems,
  totalAmount,
  address: addressId,
  paymentMethod: "ONLINE", 
  paymentStatus: "PAID", 
});


    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find()
      .populate("user", "name email")
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "_id" }
      })
      .populate("address")
      .sort({ createdAt: -1 });

    const sellerOrders = orders
      .map(order => {
        const sellerItems = order.items.filter(item => {
          if (!item.product) return false;
          if (!item.product.seller) return false;

          return (
            item.product.seller._id.toString() ===
            sellerId.toString()
          );
        });

        if (sellerItems.length === 0) return null;

        return {
          ...order._doc,
          items: sellerItems
        };
      })
      .filter(Boolean);

    res.json(sellerOrders);
  } catch (err) {
    console.error("Seller Orders Error:", err);
    res.status(500).json({ message: err.message });
  }
};


const updateSellerOrderStatus = async (req, res) => {
  try {
    const { orderId, productId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    const item = order.items.find(
      (i) =>
        i.product.toString() === productId &&
        i.seller.toString() === req.user._id.toString()
    );

    if (!item)
      return res.status(403).json({ message: "Not authorized" });

    item.status = status;
    await order.save();

    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ===============================
// SELLER APPROVE CANCELLATION
// ===============================
const approveCancellation = async (req, res) => {
  try {
    const { orderId, productId } = req.body;

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    const item = order.items.find(
      (i) =>
        i.product.toString() === productId &&
        i.seller.toString() === req.user._id.toString()
    );

    if (!item)
      return res.status(403).json({ message: "Not authorized" });

    if (item.status !== "CANCEL_REQUESTED") {
      return res
        .status(400)
        .json({ message: "No cancel request pending" });
    }

   item.status = "CANCELLED";

// 🔥 restore stock
const product = await Product.findById(item.product);
if (product) {
  product.stock += item.quantity;
  await product.save();
}

await order.save();
    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getSellerEarnings = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find()
      .populate("items.product")
      .populate("user", "name email");

    let totalRevenue = 0;
    let totalOrders = 0;
    let deliveredOrders = 0;
    let pendingOrders = 0;

    const sellerOrders = [];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (
          item.product?.seller?.toString() === sellerId.toString()
        ) {
          totalOrders++;

          if (item.status === "DELIVERED") {
            deliveredOrders++;
            totalRevenue += item.product.price * item.quantity;
          } else {
            pendingOrders++;
          }

          sellerOrders.push({
            orderId: order._id,
            customer: order.user,
            product: item.product.name,
            quantity: item.quantity,
            status: item.status,
            total: item.product.price * item.quantity,
          });
        }
      });
    });

    res.json({
      totalRevenue,
      totalOrders,
      deliveredOrders,
      pendingOrders,
      sellerOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ===============================
// USER CANCEL REQUEST
// ===============================
const requestCancelOrder = async (req, res) => {
  try {
    const { orderId, productId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.find(
      (i) =>
        i.product.toString() === productId &&
        order.user.toString() === req.user._id.toString()
    );

    if (!item) return res.status(403).json({ message: "Not allowed" });

    if (
      ["OUT FOR DELIVERY", "DELIVERED", "CANCELLED"].includes(item.status)
    ) {
      return res.status(400).json({
        message: "Cannot cancel at this stage",
      });
    }

    item.status = "CANCEL_REQUESTED";
    await order.save();

    res.json({ message: "Cancellation request sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  getMyOrders,
  placeCODOrder,
  placeOnlineOrder,
  getSellerOrders,
  updateSellerOrderStatus,
  getSellerEarnings,
  requestCancelOrder,
  approveCancellation,
};

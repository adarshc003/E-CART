const Cart = require("../models/Cart");

// ===============================
// GET CART
// ===============================
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// ADD TO CART
// ===============================
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const qty = Number(quantity);

    if (qty <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += qty; 
    } else {
      cart.items.push({
        product: productId,
        quantity: qty, 
      });
    }

    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// UPDATE CART QUANTITY
// ===============================
const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const qty = Number(quantity);

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (qty <= 0) {
      cart.items = cart.items.filter(
        (i) => i.product.toString() !== productId
      );
    } else {
      item.quantity = qty;
    }

    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// REMOVE FROM CART
// ===============================
const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Buy Now 

const buyNowCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const qty = Number(quantity);

    if (qty <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    
    cart.items = [
      {
        product: productId,
        quantity: qty, 
      },
    ];

    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  buyNowCart,
};

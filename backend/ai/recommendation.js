const Order = require("../models/Order");
const Product = require("../models/Product");

const getFrequentlyBoughtTogether = async (productId) => {
  // Step 1: Check real co-occurrence from orders
  const orders = await Order.find({ "items.product": productId });

  const productFrequency = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const id = item.product.toString();
      if (id !== productId) {
        productFrequency[id] = (productFrequency[id] || 0) + 1;
      }
    });
  });

  const sorted = Object.entries(productFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((item) => item[0]);

  if (sorted.length > 0) {
    return await Product.find({ _id: { $in: sorted } });
  }

  // Step 2: Smart fallback logic
  const currentProduct = await Product.findById(productId);

  if (!currentProduct) return [];

  // If main product → suggest accessories
  if (currentProduct.category !== "Accessories") {
    return await Product.find({
      category: "Accessories",
      _id: { $ne: productId },
    }).limit(5);
  }

  // If accessory → suggest Mobiles & Laptops
  return await Product.find({
    category: { $in: ["Mobiles", "Laptops"] },
    _id: { $ne: productId },
  }).limit(5);
};

module.exports = { getFrequentlyBoughtTogether };

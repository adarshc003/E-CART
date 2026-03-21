const Product = require("../models/Product");
const { generateEmbedding } = require("../ai/embedding");
const { cosineSimilarity } = require("../ai/similarity");
const { getFrequentlyBoughtTogether } = require("../ai/recommendation");

/* ================= GET ALL PRODUCTS ================= */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name");

    if (!req.query.keyword) {
      return res.json(products);
    }

    const keyword = req.query.keyword.toLowerCase();

    const queryEmbedding = await generateEmbedding(keyword);

    const scoredProducts = products
      .map((product) => {
        if (!product.embedding || product.embedding.length === 0)
          return null;

        let score = cosineSimilarity(
          queryEmbedding,
          product.embedding
        );

        
        if (product.name.toLowerCase().includes(keyword)) {
          score += 0.2;
        }

        
        if (product.category.toLowerCase().includes(keyword)) {
          score += 0.15;
        }

        return { product, score };
      })
      .filter(Boolean);

    scoredProducts.sort((a, b) => b.score - a.score);

    
    const filtered = scoredProducts.filter(p => p.score > 0.30);

    if (filtered.length > 0) {
      return res.json(filtered.slice(0, 8).map(p => p.product));
    }

    
    const regexProducts = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } }
      ]
    }).populate("seller", "name");

    return res.json(regexProducts);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* ================= GET SINGLE PRODUCT ================= */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CREATE PRODUCT ================= */
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
    } = req.body;

const text = `
Product name: ${name}.
Category: ${category}.
Description: ${description}.
This is a ${category} product.
`;
    const embedding = await generateEmbedding(text);

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      seller: req.user._id,
      embedding,
      stock,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ================= RECOMMENDATION ================= */
exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await getFrequentlyBoughtTogether(req.params.id);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= SELLER PRODUCTS ================= */
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE PRODUCT ================= */
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE PRODUCT ================= */
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

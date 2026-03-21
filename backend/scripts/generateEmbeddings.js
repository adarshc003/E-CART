const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");
const { generateEmbedding } = require("../ai/embedding");

dotenv.config();

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const run = async () => {
  try {
    const products = await Product.find();

    console.log(`Found ${products.length} products`);

    for (let product of products) {
      const text = `${product.name} ${product.category} ${product.description}`;

      console.log(`Generating embedding for: ${product.name}`);

      const embedding = await generateEmbedding(text);

      product.embedding = embedding;
      await product.save();
    }

    console.log("All embeddings generated successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();

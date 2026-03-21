const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,

    stock: {
  type: Number,
  required: true,
  default: 0,
},
    category: String,
    description: String,
    image: String,

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    embedding: {
  type: [Number],
  default: [],
},


  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

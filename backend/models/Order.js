const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    quantity: Number,
    price: Number,
  status: {
  type: String,
  enum: [
    "PLACED",
    "PROCESSING",
    "SHIPPED",
    "OUT FOR DELIVERY",
    "DELIVERED",
    "CANCEL_REQUESTED",
    "CANCELLED"
  ],
  default: "PLACED",
},

    },
    ],

    address: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Address",
  required: true,
},


    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["ONLINE", "COD"],
      default: "ONLINE",
    },
    paymentStatus: {
      type: String,
      enum: ["PAID", "PENDING"],
      default: "PAID",
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

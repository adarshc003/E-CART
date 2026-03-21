const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
        phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
companyName: {
  type: String,
  required: function () {
    return this.role === "seller";
  },
},

companyAddress: {
  type: String,
  required: function () {
    return this.role === "seller";
  },
},

gstNumber: {
  type: String,
  default: "",

},
profileImage: {
  type: String,
  default: "",
},



    isSellerApproved: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  
      otp: String,
    otpExpiry: Date,
    otpAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);

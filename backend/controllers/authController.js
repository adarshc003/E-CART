const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendOtpEmail = require("../utils/sendOtpEmail");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      isSeller,
      companyName,
      companyAddress,
      gstNumber,
    } = req.body;

    if (!/^[A-Za-z]+ [A-Za-z]+$/.test(name)) {
      return res.status(400).json({ message: "Enter full name" });
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return res.status(400).json({ message: "Only Gmail allowed" });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    if (isSeller) {
      if (!companyName || !companyAddress) {
        return res
          .status(400)
          .json({ message: "Company name and address required for sellers" });
      }

      if (
        gstNumber &&
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          gstNumber
        )
      ) {
        return res.status(400).json({ message: "Invalid GST format" });
      }
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: isSeller ? "seller" : "user",
      isSellerApproved: false,
      companyName: isSeller ? companyName : undefined,
      companyAddress: isSeller ? companyAddress : undefined,
      gstNumber: gstNumber || "",
    });

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL) {
      if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET);

      return res.json({
        token,
        user: { role: "admin", name: "Admin" },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account blocked by admin" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.otpAttempts = 0;
    await user.save();

    try {
      await sendOtpEmail(user.email, otp);
    } catch (err) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.json({
      message: "OTP sent",
      otpRequired: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// exports.login = async (req, res) => {
//   try {
//     console.log("Login request received");

//     const { email, password } = req.body;
//     console.log("Email:", email);

//     const user = await User.findOne({ email });
//     console.log("User found:", user ? "YES" : "NO");

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     console.log("Password match:", match);

//     if (!match) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     console.log("Generating OTP...");

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     console.log("Sending OTP...");
//     await sendOtpEmail(user.email, otp);

//     console.log("OTP Sent");

//     res.json({
//       message: "OTP sent",
//       otpRequired: true,
//     });

//   } catch (err) {
//     console.log("Login error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

/* ================= VERIFY OTP ================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.otp) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otpAttempts >= 3) {
      return res.status(403).json({ message: "Too many attempts" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (user.otp !== hashedOtp || user.otpExpiry < Date.now()) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        isSellerApproved: user.isSellerApproved,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= GOOGLE AUTH ================= */
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "No credential provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        phone: "0000000000",
        password: await bcrypt.hash(Math.random().toString(36), 10),
        profileImage: picture,
        role: "user",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account blocked" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
};


/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const { email, phone, companyName, companyAddress } = req.body;

    if (email) user.email = email;
    if (phone) user.phone = phone;

    if (user.role === "seller") {
      if (companyName) user.companyName = companyName;
      if (companyAddress) user.companyAddress = companyAddress;
    }

    if (req.file) {
      user.profileImage = `/uploads/profile/${req.file.filename}`;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
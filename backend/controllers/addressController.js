const Address = require("../models/Address");

/* ================= ADD ADDRESS ================= */
exports.addAddress = async (req, res) => {
  const address = await Address.create({
    ...req.body,
    user: req.user._id,
  });
  res.status(201).json(address);
};

/* ================= GET ADDRESSES ================= */
exports.getAddresses = async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  res.json(addresses);
};

/* ================= DELETE ADDRESS ================= */
exports.deleteAddress = async (req, res) => {
  const address = await Address.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  res.json({ message: "Address removed successfully" });
};

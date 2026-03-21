import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { FaMapMarkerAlt, FaTrash, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "sonner";

function SelectAddress() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/cart").then((res) => setCart(res.data));
  }, []);

  useEffect(() => {
    API.get("/addresses")
      .then((res) => setAddresses(res.data))
      .catch(() => {});
  }, []);

  const totalAmount = cart.items.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  const removeAddress = async (id) => {
    try {
      await API.delete(`/addresses/${id}`);
      setAddresses(addresses.filter((addr) => addr._id !== id));
      if (selectedAddress === id) setSelectedAddress(null);
      toast.success("Address removed");
    } catch {
      toast.error("Failed to remove address");
    }
  };

  if (cart.items.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        <h4>Your cart is empty 🛒</h4>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: "92%",
        margin: "80px auto",
        maxWidth: "1200px",
      }}
    >
      <div className="row g-5">

        {/* LEFT SIDE */}
        <div className="col-lg-8">
          <h3 style={{ fontWeight: 700, marginBottom: "35px" }}>
            Select Delivery Address
          </h3>

          {addresses.map((addr) => {
            const isSelected = selectedAddress === addr._id;

            return (
              <motion.div
                key={addr._id}
                whileHover={{ y: -6, scale: 1.01 }}
                animate={
                  isSelected
                    ? { scale: 1.02 }
                    : { scale: 1 }
                }
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedAddress(addr._id)}
                style={{
                  marginBottom: "22px",
                  padding: "30px",
                  borderRadius: "28px",
                  cursor: "pointer",
                  background: "#ffffff",
                  border: isSelected
                    ? "2px solid #4f8cff"
                    : "1px solid #f0f0f0",
                  // boxShadow: isSelected
                  //   ? "0 35px 80px rgba(79,140,255,0.25)"
                  //   : "0 25px 60px rgba(0,0,0,0.05)",
                  position: "relative",
                  transition: "0.3s ease",
                }}
              >
                {/* Subtle Animated Glow */}
                {isSelected && (
                  <motion.div
                    layoutId="addressGlow"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "28px",
                      background:
                        "linear-gradient(135deg,#4f8cff20,#6c5ce720)",
                      zIndex: 0,
                    }}
                  />
                )}

                <div style={{ position: "relative", zIndex: 2 }}>
                  <div className="d-flex justify-content-between">

                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "12px",
                        }}
                      >
                        <FaMapMarkerAlt color="#4f8cff" />
                        <span style={{ fontWeight: 600 }}>
                          {addr.name}
                        </span>
                      </div>

                      <div style={{ fontSize: "14px", color: "#666" }}>
                        {addr.street}, {addr.city}
                      </div>

                      <div style={{ fontSize: "14px", color: "#666" }}>
                        {addr.state} – {addr.pincode}
                      </div>
                    </div>

                    {/* Small Premium Check */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          color: "#4f8cff",
                          fontSize: "20px",
                        }}
                      >
                        <FaCheckCircle />
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAddress(addr._id);
                    }}
                    style={{
                      marginTop: "18px",
                      border: "none",
                      background: "transparent",
                      color: "#ff4d4f",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <FaTrash size={12} /> Remove Address
                  </button>
                </div>
              </motion.div>
            );
          })}

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/add-address")}
            style={{
              marginTop: "10px",
              padding: "14px 26px",
              borderRadius: "18px",
              border: "1px solid #4f8cff",
              background: "transparent",
              color: "#4f8cff",
              fontWeight: 600,
              transition: "0.3s",
            }}
          >
            + Add New Address
          </motion.button>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-4">
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "#ffffff",
              borderRadius: "32px",
              padding: "42px",
              boxShadow: "0 40px 90px rgba(0,0,0,0.06)",
              border: "1px solid #f0f0f0",
              position: "sticky",
              top: "130px",
            }}
          >
            <h5 style={{ fontWeight: 700, marginBottom: "25px" }}>
              Order Summary
            </h5>

            {cart.items
              .filter((item) => item.product)
              .map((item) => (
                <div
                  key={item.product._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    marginBottom: "10px",
                    color: "#555",
                  }}
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}

            <hr style={{ margin: "20px 0" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              disabled={!selectedAddress}
              onClick={() => {
                const selectedAddrObj = addresses.find(
                  (addr) => addr._id === selectedAddress
                );

                navigate("/payment", {
                  state: {
                    addressId: selectedAddress,
                    address: selectedAddrObj,
                  },
                });
              }}
              style={{
                marginTop: "28px",
                width: "100%",
                padding: "16px",
                borderRadius: "20px",
                border: "none",
                background: selectedAddress
                  ? "linear-gradient(135deg,#4f8cff,#6c5ce7)"
                  : "#d1d5db",
                color: "#fff",
                fontWeight: 600,
                cursor: selectedAddress ? "pointer" : "not-allowed",
                transition: "0.3s",
              }}
            >
              Proceed to Payment
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default SelectAddress;

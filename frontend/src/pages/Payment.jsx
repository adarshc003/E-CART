import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaShieldAlt,
  FaLock,
} from "react-icons/fa";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { address, addressId } = location.state || {};
  const [method, setMethod] = useState("ONLINE");
  const [loading, setLoading] = useState(false);

  if (!address || !addressId) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        <h4>No address selected</h4>
      </div>
    );
  }

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    try {
      setLoading(true);

      if (method === "COD") {
        const res = await API.post("/orders/cod", { addressId });

        navigate("/order-success", {
          state: {
            paymentMethod: "Cash on Delivery",
            orderId: res.data._id,
          },
        });
        return;
      }

      localStorage.setItem("checkoutAddressId", addressId);

      const res = await API.post(
        "/payment/create-checkout-session",
        { addressId }
      );

      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const PaymentOption = ({
    type,
    icon,
    title,
    description,
  }) => {
    const isActive = method === type;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => setMethod(type)}
        style={{
          padding: "22px",
          borderRadius: "20px",
          border: isActive
            ? "2px solid #4f8cff"
            : "1px solid #eaeaea",
          background: "#ffffff",
          boxShadow: isActive
            ? "0 15px 35px rgba(79,140,255,0.15)"
            : "0 8px 20px rgba(0,0,0,0.05)",
          cursor: "pointer",
          transition: "0.3s",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        {/* Active Indicator */}
        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            border: isActive
              ? "6px solid #4f8cff"
              : "2px solid #ccc",
            transition: "0.3s",
          }}
        />

        <div style={{ display: "flex", gap: "18px" }}>
          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "14px",
              background: "#f3f7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4f8cff",
              fontSize: "18px",
            }}
          >
            {icon}
          </div>

          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "16px",
                marginBottom: "4px",
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#777",
              }}
            >
              {description}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      style={{
        width: "92%",
        margin: "80px auto",
        maxWidth: "1100px",
      }}
    >
      <div className="row g-5">
        {/* ================= LEFT ================= */}
        <div className="col-lg-8">
          <h3
            style={{
              fontWeight: 700,
              marginBottom: "35px",
            }}
          >
            Select Payment Method
          </h3>

          <PaymentOption
            type="ONLINE"
            icon={<FaCreditCard />}
            title="Online Payment"
            description="Secure payment via Card, UPI, Net Banking"
          />

          <PaymentOption
            type="COD"
            icon={<FaMoneyBillWave />}
            title="Cash on Delivery"
            description="Pay when the product is delivered"
          />

          {/* Trust Info */}
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              borderRadius: "18px",
              background: "#f8fbff",
              border: "1px solid #edf2ff",
              display: "flex",
              gap: "25px",
              fontSize: "13px",
              color: "#555",
            }}
          >
            <span>
              <FaShieldAlt /> Secure Transactions
            </span>
            <span>
              <FaLock /> 256-bit SSL Encryption
            </span>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="col-lg-4">
          <div
            style={{
              padding: "30px",
              borderRadius: "24px",
              background: "#ffffff",
              boxShadow: "0 25px 60px rgba(0,0,0,0.06)",
              border: "1px solid #f0f0f0",
              position: "sticky",
              top: "130px",
            }}
          >
            <h6
              style={{
                fontSize: "13px",
                color: "#777",
                marginBottom: "10px",
              }}
            >
              DELIVERY ADDRESS
            </h6>

            <div style={{ fontWeight: 600 }}>
              {address.name}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#666",
                marginTop: "4px",
              }}
            >
              {address.street}, {address.city}
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#666",
              }}
            >
              {address.state} – {address.pincode}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={placeOrder}
              style={{
                marginTop: "30px",
                width: "100%",
                padding: "15px",
                borderRadius: "18px",
                border: "none",
                background: "#4f8cff",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "15px",
                boxShadow:
                  "0 12px 25px rgba(79,140,255,0.35)",
              }}
            >
              {loading
                ? "Processing..."
                : method === "COD"
                ? "Confirm Order"
                : "Pay Now"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;

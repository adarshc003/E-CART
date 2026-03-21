import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { toast } from "sonner";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasExecuted = useRef(false);

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  /* Detect screen */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");

    const createOnlineOrder = async () => {
      try {
        const addressId = localStorage.getItem("checkoutAddressId");

        if (!addressId) {
          toast.error("Address missing");
          navigate("/cart");
          return;
        }

        const res = await API.post("/orders/online", { addressId });

        localStorage.removeItem("checkoutAddressId");

        setOrderData({
          orderId: res.data._id,
          paymentMethod: "Online Payment",
        });
      } catch (err) {
        toast.error("Failed to create order");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      createOnlineOrder();
    } else if (location.state) {
      setOrderData(location.state);
      setLoading(false);
    } else {
      navigate("/home");
    }
  }, [location, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        Processing your order...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "20px" : "0",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#ffffff",
          borderRadius: isMobile ? "22px" : "32px",
          padding: isMobile ? "35px 25px" : "60px 55px",
          textAlign: "center",
          boxShadow: "0 35px 80px rgba(0,0,0,0.06)",
          border: "1px solid #f1f1f1",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
          style={{
            fontSize: isMobile ? "55px" : "80px",
            color: "#22c55e",
            marginBottom: "20px",
          }}
        >
          <FaCheckCircle />
        </motion.div>

        <h2
          style={{
            fontWeight: 700,
            marginBottom: "10px",
            fontSize: isMobile ? "20px" : "26px",
          }}
        >
          Order Confirmed 🎉
        </h2>

        <p
          style={{
            color: "#666",
            marginBottom: "30px",
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          Your order has been successfully placed.
        </p>

        <div
          style={{
            background: "#f8fbff",
            borderRadius: "20px",
            padding: isMobile ? "15px" : "20px",
            marginBottom: "30px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#777" }}>
              Order ID
            </span>
            <span style={{ fontWeight: 600 }}>
              {orderData?.orderId}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#777" }}>
              Payment Method
            </span>
            <span style={{ fontWeight: 600 }}>
              {orderData?.paymentMethod}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <button
            onClick={() => navigate("/home")}
            style={{
              padding: isMobile
                ? "10px 18px"
                : "12px 28px",
              borderRadius: "40px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              fontWeight: 600,
              fontSize: isMobile ? "13px" : "14px",
              cursor: "pointer",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            style={{
              padding: isMobile
                ? "10px 18px"
                : "12px 28px",
              borderRadius: "40px",
              border: "none",
              background:
                "linear-gradient(135deg,#4f8cff,#6c5ce7)",
              color: "#fff",
              fontWeight: 600,
              fontSize: isMobile ? "13px" : "14px",
              cursor: "pointer",
              boxShadow:
                "0 10px 25px rgba(79,140,255,0.25)",
              width: isMobile ? "100%" : "auto",
            }}
          >
            View Orders
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;

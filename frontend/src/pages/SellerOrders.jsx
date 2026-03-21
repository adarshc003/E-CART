import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FaUser,
  FaCreditCard,
  FaBoxOpen,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/seller");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load seller orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, productId, status) => {
    try {
      await API.put("/orders/seller/status", {
        orderId,
        productId,
        status,
      });
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        Loading seller orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px", color: "#777" }}>
        <FaBoxOpen size={50} />
        <h5 style={{ marginTop: "15px" }}>
          No orders received yet
        </h5>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <h3 style={{ fontWeight: 700, marginBottom: "35px" }}>
        Manage Orders
      </h3>

      {orders.map((order) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "#ffffff",
            borderRadius: "26px",
            padding: "30px",
            marginBottom: "35px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.05)",
            border: "1px solid #f1f1f1",
          }}
        >
          {/* ================= HEADER ================= */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              marginBottom: "25px",
            }}
          >
            <div>
              <div style={{ fontSize: "13px", color: "#777" }}>
                ORDER ID
              </div>
              <div style={{ fontWeight: 600 }}>
                {order._id}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", color: "#777" }}>
                TOTAL AMOUNT
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                ₹ {order.totalAmount}
              </div>
            </div>
          </div>

          {/* ================= CUSTOMER & PAYMENT ================= */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              flexWrap: "wrap",
              marginBottom: "30px",
              fontSize: "14px",
            }}
          >
            <div>
              <FaUser style={{ marginRight: "6px" }} />
              {order.user?.name} ({order.user?.email})
            </div>

            <div>
              <FaCreditCard style={{ marginRight: "6px" }} />
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                  background:
                    order.paymentMethod === "ONLINE"
                      ? "#e6f9f0"
                      : "#fff3cd",
                  color:
                    order.paymentMethod === "ONLINE"
                      ? "#16a34a"
                      : "#856404",
                }}
              >
                {order.paymentMethod}
              </span>

              <span
                style={{
                  marginLeft: "10px",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                  background:
                    order.paymentStatus === "PAID"
                      ? "#e6f9f0"
                      : "#f1f3f5",
                  color:
                    order.paymentStatus === "PAID"
                      ? "#16a34a"
                      : "#666",
                }}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* ================= ITEMS ================= */}
          {order.items?.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                gap: "20px",
                padding: "18px",
                borderRadius: "18px",
                background: "#f8fbff",
                marginBottom: "18px",
                alignItems: "center",
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  background: "#fff",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #eee",
                }}
              >
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  style={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <h6 style={{ fontWeight: 600 }}>
                  {item.product?.name}
                </h6>

                <div style={{ fontSize: "13px", color: "#777" }}>
                  Quantity: {item.quantity}
                </div>

                <div style={{ fontWeight: 600, marginTop: "4px" }}>
                  ₹ {item.price}
                </div>

                {/* Status Control */}
                {item.status !== "CANCELLED" &&
                  item.status !== "CANCEL_REQUESTED" && (
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          item.product._id,
                          e.target.value
                        )
                      }
                      style={{
                        marginTop: "10px",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        fontSize: "13px",
                      }}
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="PROCESSING">
                        PROCESSING
                      </option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="OUT FOR DELIVERY">
                        OUT FOR DELIVERY
                      </option>
                      <option value="DELIVERED">
                        DELIVERED
                      </option>
                    </select>
                  )}

                {/* Cancel Request */}
                {item.status === "CANCEL_REQUESTED" && (
                  <button
                    onClick={() =>
                      API.put("/orders/cancel/approve", {
                        orderId: order._id,
                        productId: item.product._id,
                      }).then(fetchOrders)
                    }
                    style={{
                      marginTop: "10px",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: "none",
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Approve Cancellation
                  </button>
                )}

                {item.status === "CANCELLED" && (
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#dc2626",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    <FaTimesCircle /> Cancelled
                  </div>
                )}

                {item.status === "DELIVERED" && (
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#16a34a",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    <FaCheckCircle /> Delivered
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

export default SellerOrders;

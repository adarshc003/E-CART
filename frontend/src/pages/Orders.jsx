import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "sonner";
import {
  FaBoxOpen,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelModal, setCancelModal] = useState({
    open: false,
    orderId: null,
    productId: null,
  });

  const steps = [
    "PLACED",
    "PROCESSING",
    "SHIPPED",
    "OUT FOR DELIVERY",
    "DELIVERED",
  ];

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my");
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const confirmCancel = async () => {
    try {
      await API.put("/orders/cancel/request", {
        orderId: cancelModal.orderId,
        productId: cancelModal.productId,
      });

      toast.success("Cancellation requested");
      setCancelModal({ open: false });
      fetchOrders();
    } catch {
      toast.error("Unable to cancel");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        <FaBoxOpen size={50} color="#bbb" />
        <h5 style={{ marginTop: "15px" }}>No orders yet</h5>
      </div>
    );
  }

  return (
    <div style={{ width: "92%", margin: "80px auto", maxWidth: "1100px" }}>
      <h3 style={{ fontWeight: 700, marginBottom: "40px" }}>
        My Orders
      </h3>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            background: "#fff",
            borderRadius: "24px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.06)",
            marginBottom: "40px",
            border: "1px solid #f0f0f0",
            overflow: "hidden",
          }}
        >
          {/* ===== ORDER HEADER ===== */}
          <div
            style={{
              padding: "25px 35px",
              background: "linear-gradient(135deg,#f8faff,#f3f6ff)",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: "13px", color: "#777" }}>
                ORDER ID
              </div>
              <div style={{ fontWeight: 600 }}>{order._id}</div>

              <div
                style={{
                  marginTop: "8px",
                  display: "inline-block",
                  padding: "6px 14px",
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
                {order.paymentMethod === "ONLINE"
                  ? "Paid Online"
                  : "Cash on Delivery"}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", color: "#777" }}>
                ORDER TOTAL
              </div>
              <div style={{ fontWeight: 700, fontSize: "22px" }}>
                ₹{order.totalAmount}
              </div>
            </div>
          </div>

          {/* ===== ORDER ITEMS ===== */}
          <div style={{ padding: "35px" }}>
            {order.items.map((item, index) => {
              const currentStep = steps.indexOf(item.status);

              const deliveryDate = new Date(order.createdAt);
              deliveryDate.setDate(deliveryDate.getDate() + 5);

              return (
                <div key={index} style={{ marginBottom: "45px" }}>
                  {/* PRODUCT INFO */}
                  <div style={{ display: "flex", gap: "20px" }}>
                    <div
                      style={{
                        width: "110px",
                        height: "110px",
                        background: "#f8f9fa",
                        borderRadius: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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

                    <div style={{ flex: 1 }}>
                      <h6 style={{ fontWeight: 600 }}>
                        {item.product?.name}
                      </h6>

                      <div style={{ fontSize: "14px", color: "#777" }}>
                        Quantity: {item.quantity}
                      </div>

                      <div style={{ fontWeight: 600, marginTop: "5px" }}>
                        ₹{item.product?.price}
                      </div>

                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "13px",
                          color: "#555",
                        }}
                      >
                        Estimated Delivery:{" "}
                        <b>{deliveryDate.toDateString()}</b>
                      </div>

                      {["PLACED", "PROCESSING", "SHIPPED"].includes(
                        item.status
                      ) && (
                        <button
                          onClick={() =>
                            setCancelModal({
                              open: true,
                              orderId: order._id,
                              productId: item.product._id,
                            })
                          }
                          style={{
                            marginTop: "12px",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            border: "1px solid #ff4d4f",
                            background: "transparent",
                            color: "#ff4d4f",
                            fontSize: "13px",
                          }}
                        >
                          Cancel Order
                        </button>
                      )}

                      {item.status === "CANCELLED" && (
                        <div
                          style={{
                            marginTop: "10px",
                            color: "#dc3545",
                            fontWeight: 600,
                          }}
                        >
                          <FaTimesCircle /> Cancelled
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ===== MODERN STATUS TIMELINE ===== */}
                  <div style={{ marginTop: "30px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        position: "relative",
                      }}
                    >
                      {steps.map((step, i) => (
                        <div
                          key={step}
                          style={{
                            textAlign: "center",
                            flex: 1,
                            position: "relative",
                          }}
                        >
                          {i !== steps.length - 1 && (
                            <div
                              style={{
                                position: "absolute",
                                top: "12px",
                                left: "50%",
                                width: "100%",
                                height: "3px",
                                background:
                                  i < currentStep
                                    ? "#4f8cff"
                                    : "#e5e7eb",
                                zIndex: 0,
                              }}
                            />
                          )}

                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              margin: "0 auto",
                              background:
                                i <= currentStep
                                  ? "#4f8cff"
                                  : "#e5e7eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: "12px",
                              position: "relative",
                              zIndex: 2,
                            }}
                          >
                            {i <= currentStep ? (
                              <FaCheckCircle size={12} />
                            ) : null}
                          </div>

                          <div
                            style={{
                              fontSize: "11px",
                              marginTop: "8px",
                              color:
                                i === currentStep
                                  ? "#4f8cff"
                                  : "#777",
                              fontWeight:
                                i === currentStep ? 600 : 400,
                            }}
                          >
                            {step.replaceAll("_", " ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr style={{ marginTop: "40px" }} />
                </div>
              );
            })}

            {/* ===== DELIVERY ADDRESS ===== */}
            <div>
              <div style={{ fontSize: "13px", color: "#777" }}>
                DELIVERY ADDRESS
              </div>
              <div style={{ fontWeight: 600 }}>
                {order.address?.name}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                {order.address
                  ? `${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
                  : ""}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ===== PREMIUM CANCEL MODAL ===== */}
      {cancelModal.open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "35px",
              width: "380px",
              boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            <h5 style={{ fontWeight: 600 }}>
              Cancel this order?
            </h5>

            <p style={{ fontSize: "14px", color: "#777" }}>
              This action cannot be undone.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "25px",
              }}
            >
              <button
                onClick={() => setCancelModal({ open: false })}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "14px",
                  border: "1px solid #ddd",
                  background: "#f5f5f5",
                }}
              >
                Keep Order
              </button>

              <button
                onClick={confirmCancel}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "14px",
                  border: "none",
                  background:
                    "linear-gradient(135deg,#ff4d4f,#ff7875)",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;

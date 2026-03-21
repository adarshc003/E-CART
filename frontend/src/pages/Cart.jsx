import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();

  /* ================= FETCH CART ================= */
  useEffect(() => {
    API.get("/cart")
      .then((res) => setCart(res.data))
      .catch(() => toast.error("Failed to load cart"));
  }, []);

  /* ================= UPDATE QUANTITY ================= */
const updateQty = async (productId, qty, stock) => {
  try {
    if (qty <= 0) {
      await removeItem(productId);
      return;
    }

    if (qty > stock) {
      return toast.error("Exceeds available stock");
    }

    const res = await API.put("/cart/update", {
      productId,
      quantity: qty,
    });

    setCart(res.data);
  } catch {
    toast.error("Update failed");
  }
};

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (productId) => {
    try {
      const res = await API.delete(`/cart/${productId}`);
      setCart(res.data);
      toast("Item removed");
    } catch {
      toast.error("Remove failed");
    }
  };

  /* ================= PRICE CALC ================= */
  const subtotal = cart.items.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  const originalTotal = cart.items.reduce((sum, item) => {
    if (!item.product) return sum;
    const original = item.product.price * 1.2; 
    return sum + original * item.quantity;
  }, 0);

  const totalSavings = originalTotal - subtotal;
  const finalTotal = subtotal - discount;

  /* ================= APPLY COUPON ================= */
  const applyCoupon = () => {
    if (coupon.toLowerCase() === "save10") {
      const d = subtotal * 0.1;
      setDiscount(d);
      toast.success("Coupon Applied 🎉");
    } else {
      toast.error("Invalid Coupon");
      setDiscount(0);
    }
  };

  /* ================= EMPTY ================= */
  if (cart.items.length === 0) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>Your cart is empty 🛒</h3>
        <button
          onClick={() => navigate("/home")}
          style={{
            marginTop: "20px",
            padding: "12px 30px",
            borderRadius: "30px",
            border: "none",
            background: "linear-gradient(135deg,#4f8cff,#6c5ce7)",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "92%", margin: "60px auto" }}>
      <div className="row g-5">

        {/* ================= LEFT ITEMS ================= */}
        <div className="col-lg-8">
          <h3 style={{ marginBottom: "30px", fontWeight: 600 }}>
            My Cart ({cart.items.length})
          </h3>

          <AnimatePresence>
            {cart.items
              .filter((item) => item.product)
              .map((item) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: "#fff",
                    borderRadius: "22px",
                    padding: "25px",
                    marginBottom: "20px",
                    border: "1px solid #f0f0f0",
                    boxShadow:
                      "0 20px 40px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="row align-items-center">

                    {/* IMAGE */}
                    <div className="col-md-3 text-center">
                      <img
                        src={item.product.image}
                        alt=""
                        style={{
                          height: "120px",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="col-md-5">
                      <h5>{item.product.name}</h5>

{item.product.stock > 0 ? (
  <div style={{ fontSize: "12px", color: "#16a34a" }}>
    {item.product.stock} available
  </div>
) : (
  <div style={{ fontSize: "12px", color: "red" }}>
    Out of Stock
  </div>
)}

{item.quantity > item.product.stock && (
  <div style={{ color: "red", fontSize: "12px" }}>
    Only {item.product.stock} available. Reduce quantity.
  </div>
)}

                      <div
                        style={{
                          color: "#16a34a",
                          fontSize: "14px",
                        }}
                      >
                        You save ₹
                        {Math.round(
                          item.product.price * 0.2
                        )}
                      </div>

                      <button
                        onClick={() =>
                          removeItem(
                            item.product._id
                          )
                        }
                        style={{
                          border: "none",
                          background: "none",
                          color: "#ff4d4f",
                          padding: 0,
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    {/* QTY */}
                    <div className="col-md-2 text-center">
                      <div
                        style={{
                          display: "inline-flex",
                          border:
                            "1px solid #ddd",
                          borderRadius: "30px",
                          padding: "6px 12px",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={() =>
                            updateQty(
                              item.product._id,
                              item.quantity - 1, item.product.stock
                            )
                          }
                          style={{
                            border: "none",
                            background: "none",
                          }}
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                         onClick={() => {
  if (item.quantity >= item.product.stock) {
    return toast.error("No more stock available");
  }
  updateQty(item.product._id, item.quantity + 1, item.product.stock);
}}
                          style={{
                            border: "none",
                            background: "none",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="col-md-2 text-end">
                      <h5>
                        ₹
                        {item.product.price *
                          item.quantity}
                      </h5>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* ================= RIGHT SUMMARY ================= */}
        <div className="col-lg-4">
          <div
            style={{
              background: "#fff",
              borderRadius: "25px",
              padding: "35px",
              border: "1px solid #f0f0f0",
              boxShadow:
                "0 25px 50px rgba(0,0,0,0.06)",
              position: "sticky",
              top: "120px",
            }}
          >
            <h6 style={{ fontWeight: 600 }}>
              PRICE DETAILS
            </h6>

            <div className="d-flex justify-content-between mt-3">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="d-flex justify-content-between text-success">
              <span>You Saved</span>
              <span>₹{Math.round(totalSavings)}</span>
            </div>

            {discount > 0 && (
              <div className="d-flex justify-content-between text-primary">
                <span>Coupon</span>
                <span>-₹{Math.round(discount)}</span>
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span>₹{Math.round(finalTotal)}</span>
            </div>

            {/* COUPON */}
            <div className="mt-4 d-flex gap-2">
              <input
                type="text"
                placeholder="Coupon code"
                className="form-control"
                value={coupon}
                onChange={(e) =>
                  setCoupon(e.target.value)
                }
              />
              <button
                onClick={applyCoupon}
                className="btn btn-outline-primary"
              >
                Apply
              </button>
            </div>

            <button
              onClick={() => {
  const invalidItem = cart.items.find(
    (item) =>
      item.product &&
      item.quantity > item.product.stock
  );

  if (invalidItem) {
    return toast.error(
      `Reduce quantity for ${invalidItem.product.name}`
    );
  }

  navigate("/checkout");
}}
              style={{
                marginTop: "25px",
                width: "100%",
                padding: "15px",
                borderRadius: "15px",
                border: "none",
                background:
                  "linear-gradient(135deg,#4f8cff,#6c5ce7)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

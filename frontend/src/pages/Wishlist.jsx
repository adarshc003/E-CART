import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaHeartBroken,
  FaStar,
  FaTrash,
  FaShoppingCart,
} from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "framer-motion";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH ================= */
  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      setWishlist(res.data);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REMOVE ================= */
  const removeItem = async (id) => {
    try {
      await API.delete(`/wishlist/${id}`);
      setWishlist((prev) =>
        prev.filter((item) => item._id !== id)
      );
      toast("Removed from wishlist");
    } catch {
      toast.error("Failed to remove");
    }
  };

  /* ================= MOVE TO CART ================= */
  const moveToCart = async (id) => {
    try {
      await API.post("/cart", { productId: id, quantity: 1 });
      await API.delete(`/wishlist/${id}`);
      setWishlist((prev) =>
        prev.filter((item) => item._id !== id)
      );
      toast.success("Moved to cart 🛒");
    } catch {
      toast.error("Login required");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        Loading wishlist...
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (wishlist.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "120px",
        }}
      >
        <FaHeartBroken size={60} color="#bbb" />
        <h4 style={{ marginTop: "20px" }}>
          Your wishlist is empty
        </h4>
        <p style={{ color: "#777" }}>
          Save items you love and view them here
        </p>

        <button
          onClick={() => navigate("/home")}
          style={{
            marginTop: "20px",
            padding: "12px 30px",
            borderRadius: "30px",
            border: "none",
            background:
              "linear-gradient(135deg,#4f8cff,#6c5ce7)",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "92%", margin: "80px auto" }}>
      <h3 style={{ fontWeight: 700, marginBottom: "40px" }}>
        My Wishlist
      </h3>

      <div className="row">
        {wishlist.map((item) => {
          const discount =
            (item._id.charCodeAt(0) % 15) + 5;
          const originalPrice = Math.round(
            item.price / (1 - discount / 100)
          );
          const rating = (Math.random() * 1 + 4).toFixed(1);

          return (
            <div
              key={item._id}
              className="col-lg-4 col-md-6 mb-4"
            >
              <motion.div
                whileHover={{ y: -8 }}
                style={{
                  background: "#fff",
                  borderRadius: "22px",
                  padding: "25px",
                  border: "1px solid #f1f1f1",
                  boxShadow:
                    "0 25px 60px rgba(0,0,0,0.05)",
                  height: "100%",
                  position: "relative",
                }}
              >
                {/* Discount */}
                <div
                  style={{
                    position: "absolute",
                    top: "18px",
                    left: "18px",
                    background:
                      "linear-gradient(135deg,#ff4d4f,#ff7a45)",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: "30px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {discount}% OFF
                </div>

                {/* Image */}
                <div
                  onClick={() =>
                    navigate(`/product/${item._id}`)
                  }
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      height: "180px",
                      objectFit: "contain",
                      width: "100%",
                    }}
                  />
                </div>

                {/* Name */}
                <h6
                  style={{
                    fontWeight: 600,
                    minHeight: "40px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(`/product/${item._id}`)
                  }
                >
                  {item.name}
                </h6>

                {/* Rating */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      background: "#16a34a",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  >
                    {rating} ★
                  </span>
                </div>

                {/* Price */}
                <div style={{ marginBottom: "15px" }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                    }}
                  >
                    ₹{item.price}
                  </span>

                  <span
                    style={{
                      marginLeft: "10px",
                      textDecoration: "line-through",
                      color: "#999",
                      fontSize: "0.9rem",
                    }}
                  >
                    ₹{originalPrice}
                  </span>
                </div>

                {/* Buttons */}
                <div className="d-grid gap-2">
                  <button
                    onClick={() =>
                      moveToCart(item._id)
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "12px",
                      border: "none",
                      background:
                        "linear-gradient(135deg,#4f8cff,#6c5ce7)",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    <FaShoppingCart /> Move to Cart
                  </button>

                  <button
                    onClick={() =>
                      removeItem(item._id)
                    }
                    style={{
                      padding: "8px",
                      borderRadius: "12px",
                      border: "1px solid #eee",
                      background: "#fff",
                      fontWeight: 500,
                      color: "#ff4d4f",
                    }}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;

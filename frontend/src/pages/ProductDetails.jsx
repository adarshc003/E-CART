import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  FaHeart,
  FaRegHeart,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "framer-motion";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    setLoading(true);

    API.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));

    //  Fetch AI Recommendations
    API.get(`/products/${id}/recommendations`)
      .then((res) => setRecommendations(res.data))
      .catch(() => {});
  }, [id]);

  /* ================= FETCH WISHLIST ================= */
  useEffect(() => {
    API.get("/wishlist")
      .then((res) => setWishlistIds(res.data.map((p) => p._id)))
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        Loading product...
      </div>
    );
  }

  if (!product) return null;

  const isWishlisted = wishlistIds.includes(product._id);

  const discount = (product._id.charCodeAt(0) % 20) + 5;
  const originalPrice = Math.round(
    product.price / (1 - discount / 100)
  );
  const savings = originalPrice - product.price;

  const rating = (Math.random() * 1 + 4).toFixed(1);
  const reviews = Math.floor(Math.random() * 2000 + 200);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  /* ================= ACTIONS ================= */

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await API.delete(`/wishlist/${product._id}`);
        setWishlistIds(wishlistIds.filter((i) => i !== product._id));
        toast("Removed from wishlist");
      } else {
        await API.post("/wishlist", { productId: product._id });
        setWishlistIds([...wishlistIds, product._id]);
        toast.success("Added to wishlist ❤️");
      }
    } catch {
      toast.error("Login required");
    }
  };

  const addToCart = async () => {
    try {
      if (quantity > product.stock) {
  return toast.error("Not enough stock available");
}
      setBtnLoading(true);
      await API.post("/cart", {
        productId: product._id,
        quantity,
      });
      toast.success(`${quantity} item(s) added to cart 🛒`);
    } catch {
      toast.error("Login required");
    } finally {
      setBtnLoading(false);
    }
  };

  const buyNow = async () => {
    try {
      if (quantity > product.stock) {
  return toast.error("Not enough stock available");
}
      setBtnLoading(true);
      await API.post("/cart/buy-now", {
        productId: product._id,
        quantity,
      });
      navigate("/checkout");
    } catch {
      toast.error("Login required");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div style={{ width: "92%", margin: "80px auto" }}>
      <div className="row g-5">
 {/* ================= LEFT IMAGE ================= */}
<div className="col-lg-6">
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    style={{
      background: "linear-gradient(145deg,#ffffff,#f5f8ff)",
      borderRadius: "32px",
      padding: "40px",
      border: "1px solid #f0f0f0",
      boxShadow: "0 30px 60px rgba(0,0,0,0.05)",
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
    }}
  >
    {/* OFFER BADGE (Floating Left) */}
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        background:  "linear-gradient(135deg,#ff4d4f,#ff7875)",
        color: "#fff",
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
        zIndex: 2,
      }}
    >
      {discount}% OFF
    </div>

    {/*  WISHLIST BUTTON (Floating Right) */}
    <button
      onClick={toggleWishlist}
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        border: "none",
        background: "#ffffff",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 2,
      }}
    >
      {isWishlisted ? (
        <FaHeart color="#ff3f6c" size={18} />
      ) : (
        <FaRegHeart color="#333" size={18} />
      )}
    </button>

    {/* PRODUCT IMAGE */}
    <img
      src={product.image}
      alt={product.name}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      style={{
        maxHeight: "420px",
        width: "100%",
        objectFit: "contain",
        transition: "0.4s ease",
        transform: zoom ? "scale(1.08)" : "scale(1)",
      }}
    />
  </motion.div>
</div>


        {/* ================= RIGHT DETAILS ================= */}
        <div className="col-lg-6">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "#fff",
              borderRadius: "32px",
              padding: "50px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 30px 60px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ fontWeight: 700 }}>{product.name}</h2>
            <p style={{ color: "#777" }}>{product.category}</p>

            <div style={{ marginBottom: "15px" }}>
              <span style={{ fontSize: "34px", fontWeight: 700 }}>
                ₹{product.price}
              </span>
              <span
                style={{
                  marginLeft: "12px",
                  textDecoration: "line-through",
                  color: "#999",
                }}
              >
                ₹{originalPrice}
              </span>
            </div>

            <div style={{ marginBottom: "15px" }}>
  {product.stock > 0 ? (
    <span style={{ color: "green", fontWeight: 600 }}>
      Only {product.stock} left
    </span>
  ) : (
    <span style={{ color: "red", fontWeight: 600 }}>
      Out of Stock
    </span>
  )}
</div>

            <div style={{ marginBottom: "25px" }}>
              <FaTruck /> Delivery by <b>{deliveryDate.toDateString()}</b>
            </div>

            <div className="d-grid gap-3">
              <button
                 disabled={btnLoading || product.stock === 0}
                onClick={buyNow}
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg,#4f8cff,#6c5ce7)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {btnLoading ? "Processing..." : "Buy Now"}
              </button>

              <button
                disabled={btnLoading || product.stock === 0}
                onClick={addToCart}
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  fontWeight: 600,
                }}
              >
                {btnLoading ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            <hr style={{ margin: "30px 0" }} />

            <h6 style={{ fontWeight: 600 }}>Product Description</h6>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              {product.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= AI RECOMMENDATIONS ================= */}
      {recommendations.length > 0 && (
        <div style={{ marginTop: "80px" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "25px" }}>
            Frequently Bought Together
          </h3>

          <div
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              paddingBottom: "10px",
            }}
          >
            {recommendations.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                style={{
                  minWidth: "220px",
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "20px",
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "0.3s ease",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    height: "150px",
                    width: "100%",
                    objectFit: "contain",
                    marginBottom: "15px",
                  }}
                />

                <h6 style={{ fontWeight: 600 }}>{item.name}</h6>
                <p style={{ color: "#666", fontSize: "13px" }}>
                  {item.category}
                </p>

                <div style={{ fontWeight: 700, marginTop: "8px" }}>
                  ₹{item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;

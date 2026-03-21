import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "sonner";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH SELLER PRODUCTS ================= */
  const fetchMyProducts = async () => {
    try {
      const res = await API.get("/products/my/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch seller products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  /* ================= DELETE PRODUCT ================= */
  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this product permanently?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) =>
        prev.filter((p) => p._id !== id)
      );
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        <h5 style={{ fontWeight: 600 }}>
          No products added yet
        </h5>
        <p style={{ color: "#777" }}>
          Add your first product to start selling
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", marginTop: "30px" }}>
      {/* HEADER */}
      <div
        style={{
          marginBottom: "35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: "4px" }}>
            My Products
          </h3>
          <p style={{ fontSize: "14px", color: "#777" }}>
            Manage your listed products
          </p>
        </div>

        <button
          onClick={() => navigate("/add-product")}
          style={{
            padding: "10px 22px",
            borderRadius: "40px",
            border: "none",
            background: "linear-gradient(135deg,#4f8cff,#6c5ce7)",
            color: "#fff",
            fontWeight: 600,
            boxShadow:
              "0 10px 25px rgba(79,140,255,0.25)",
          }}
        >
          + Add Product
        </button>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(280px,1fr))",
          gap: "28px",
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
              background: "#ffffff",
              borderRadius: "26px",
              border: "1px solid #f1f1f1",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.04)",
              overflow: "hidden",
              transition: "0.3s",
            }}
            whileHover={{
              y: -6,
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.08)",
            }}
          >
            {/* IMAGE SECTION */}
            <div
              style={{
                height: "210px",
                background: "#f9fbff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* DETAILS */}
            <div style={{ padding: "24px" }}>
              <h6
                style={{
                  fontWeight: 600,
                  marginBottom: "6px",
                  fontSize: "15px",
                }}
              >
                {product.name}
              </h6>

              <div
                style={{
                  fontSize: "13px",
                  color: "#777",
                  marginBottom: "10px",
                }}
              >
                Category: {product.category}
              </div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: "18px",
                  marginBottom: "14px",
                }}
              >
                ₹{product.price}
              </div>
<div style={{ fontSize: "13px", marginBottom: "10px" }}>
  {product.stock > 0 ? (
    <span style={{ color: "green" }}>
      In Stock: {product.stock}
    </span>
  ) : (
    <span style={{ color: "red" }}>
      Out of Stock
    </span>
  )}
</div>
              {/* STATUS BADGE */}
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 600,
                  background: "#e6f9f0",
                  color: "#16a34a",
                  marginBottom: "18px",
                }}
              >
                Live
              </div>

              {/* ACTION BUTTONS */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #f1f1f1",
                  paddingTop: "14px",
                }}
              >
                <FaEye
                  size={18}
                  style={{
                    cursor: "pointer",
                    color: "#6b7280",
                  }}
                  onClick={() =>
                    navigate(`/product/${product._id}`)
                  }
                />

                <FaEdit
                  size={18}
                  style={{
                    cursor: "pointer",
                    color: "#4f8cff",
                  }}
                  onClick={() =>
                    navigate(`/edit/${product._id}`)
                  }
                />

                <FaTrash
                  size={18}
                  style={{
                    cursor: "pointer",
                    color: "#ef4444",
                  }}
                  onClick={() =>
                    deleteHandler(product._id)
                  }
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default MyProducts;

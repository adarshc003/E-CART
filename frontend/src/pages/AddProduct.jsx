import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    ram: "",
    storage: "",
    color: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/products", form);
      toast.success("Product added successfully");
      navigate("/my-products");
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafcff",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontWeight: 700, marginBottom: "6px" }}>
              Add New Product
            </h2>
            <p style={{ color: "#777", fontSize: "14px" }}>
              Fill in the product details to list it on the marketplace
            </p>
          </div>

          <form onSubmit={submitHandler}>
            <Section title="Basic Details">
              <input
                name="name"
                placeholder="Product Title"
                value={form.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                name="brand"
                placeholder="Brand Name"
                value={form.brand}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Select Category</option>
                <option value="Mobiles">Mobiles</option>
                <option value="Laptops">Laptops</option>
                <option value="Accessories">Accessories</option>
                <option value="Electronics">Electronics</option>
                <option value="Home">Home Appliances</option>
                <option value="Furniture">Furniture</option>
              </select>
            </Section>

            <Section title="Specifications">
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <input name="ram" placeholder="RAM" value={form.ram} onChange={handleChange} style={inputStyle}/>
                <input name="storage" placeholder="Storage" value={form.storage} onChange={handleChange} style={inputStyle}/>
                <input name="color" placeholder="Color" value={form.color} onChange={handleChange} style={inputStyle}/>
              </div>
            </Section>

            <Section title="Pricing & Inventory">
              <input type="number" name="price" placeholder="Selling Price" value={form.price} onChange={handleChange} required style={inputStyle}/>
              <input type="number" name="stock" placeholder="Available Stock" value={form.stock} onChange={handleChange} required style={inputStyle}/>
            </Section>

            <Section title="Product Image">
              <input name="image" placeholder="Product Image URL" value={form.image} onChange={handleChange} required style={inputStyle}/>
            </Section>

            <Section title="Product Description">
              <textarea rows="5" name="description" placeholder="Write detailed product description..." value={form.description} onChange={handleChange} required style={{ ...inputStyle, resize: "none", height: "120px" }}/>
            </Section>

            <div style={{ textAlign: "right" }}>
              <button
                disabled={loading}
                style={{
                  padding: "12px 30px",
                  borderRadius: "40px",
                  border: "none",
                  background: "linear-gradient(135deg,#4f8cff,#6c5ce7)",
                  color: "#fff",
                  fontWeight: 600,
                  boxShadow: "0 10px 25px rgba(79,140,255,0.25)",
                }}
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}


function Section({ title, children }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "24px",
        padding: "30px",
        marginBottom: "30px",
        border: "1px solid #f1f1f1",
        boxShadow: "0 20px 50px rgba(0,0,0,0.04)",
      }}
    >
      <h6
        style={{
          fontWeight: 700,
          marginBottom: "20px",
          letterSpacing: "0.3px",
        }}
      >
        {title}
      </h6>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "14px",
  border: "1px solid #e5e7eb",
  marginBottom: "15px",
  fontSize: "14px",
  outline: "none",
};

export default AddProduct;

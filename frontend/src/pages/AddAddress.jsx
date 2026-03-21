import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FaMapMarkerAlt } from "react-icons/fa";

function AddAddress() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await API.post("/addresses", form);
      toast.success("Address saved successfully");
      navigate("/checkout");
    } catch {
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "100%",
          maxWidth: "720px",
          background: "#ffffff",
          borderRadius: "30px",
          padding: "50px 45px",
          boxShadow: "0 35px 80px rgba(0,0,0,0.06)",
          border: "1px solid #f1f1f1",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "35px", textAlign: "center" }}>
          <FaMapMarkerAlt
            size={40}
            color="#4f8cff"
            style={{ marginBottom: "15px" }}
          />
          <h2 style={{ fontWeight: 700, marginBottom: "8px" }}>
            Add Delivery Address
          </h2>
          <p style={{ color: "#777", fontSize: "14px" }}>
            Enter accurate details to ensure smooth and timely delivery.
          </p>
        </div>

        <form onSubmit={submitHandler}>
          {/* FULL NAME */}
          <InputField
            label="Full Name"
            placeholder="Enter full name"
            value={form.name}
            onChange={(val) => handleChange("name", val)}
          />

          {/* PHONE */}
          <InputField
            label="Phone Number"
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={(val) => handleChange("phone", val)}
          />

          {/* STREET */}
          <InputField
            label="House / Street"
            placeholder="House no, street name"
            value={form.street}
            onChange={(val) => handleChange("street", val)}
          />

          {/* CITY & STATE */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <InputField
              label="City"
              placeholder="City"
              value={form.city}
              onChange={(val) => handleChange("city", val)}
              style={{ flex: 1 }}
            />

            <InputField
              label="State"
              placeholder="State"
              value={form.state}
              onChange={(val) => handleChange("state", val)}
              style={{ flex: 1 }}
            />
          </div>

          {/* PINCODE */}
          <InputField
            label="Pincode"
            placeholder="6-digit pincode"
            value={form.pincode}
            onChange={(val) => handleChange("pincode", val)}
          />

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "30px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "40px",
                border: "none",
                background:
                  "linear-gradient(135deg,#4f8cff,#6c5ce7)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "15px",
                boxShadow:
                  "0 12px 30px rgba(79,140,255,0.25)",
              }}
            >
              {loading ? "Saving..." : "Save Address"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "40px",
                border: "1px solid #ddd",
                background: "#fff",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ========= REUSABLE INPUT COMPONENT ========= */

function InputField({ label, placeholder, value, onChange, style }) {
  return (
    <div style={{ marginBottom: "20px", ...style }}>
      <label
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#555",
          marginBottom: "6px",
          display: "block",
        }}
      >
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
          fontSize: "14px",
          outline: "none",
          transition: "0.2s",
        }}
      />
    </div>
  );
}

export default AddAddress;

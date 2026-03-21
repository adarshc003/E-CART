import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaClipboardList,
  FaBoxOpen,
} from "react-icons/fa";

import MyProducts from "./MyProducts";
import SellerOrders from "./SellerOrders";
import SellerOverview from "./SellerOverview";

function SellerDashboard() {
  const [tab, setTab] = useState("overview");

  const TabButton = ({ label, value, icon }) => {
    const isActive = tab === value;

    return (
      <button
        onClick={() => setTab(value)}
        style={{
          padding: "10px 24px",
          borderRadius: "40px",
          border: "none",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "0.3s",
          background: isActive
            ? "linear-gradient(135deg,#4f8cff,#6c5ce7)"
            : "#f3f6ff",
          color: isActive ? "#fff" : "#333",
          boxShadow: isActive
            ? "0 8px 20px rgba(79,140,255,0.25)"
            : "none",
        }}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        width: "92%",
        margin: "80px auto",
        maxWidth: "1200px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "35px" }}>
        <h2 style={{ fontWeight: 700 }}>
          Seller Dashboard
        </h2>
        <p style={{ color: "#777", marginTop: "6px" }}>
          Manage your store, products, and orders efficiently
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "40px",
        }}
      >
        <TabButton
          label="Overview"
          value="overview"
          icon={<FaChartLine />}
        />

        <TabButton
          label="Manage Orders"
          value="orders"
          icon={<FaClipboardList />}
        />

        <TabButton
          label="My Products"
          value="products"
          icon={<FaBoxOpen />}
        />
      </div>

      {/* Animated Content Area */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "#ffffff",
          borderRadius: "28px",
          padding: "35px",
          boxShadow: "0 30px 70px rgba(0,0,0,0.05)",
          border: "1px solid #f1f1f1",
          minHeight: "400px",
        }}
      >
        {tab === "overview" && <SellerOverview />}
        {tab === "orders" && <SellerOrders />}
        {tab === "products" && <MyProducts />}
      </motion.div>
    </div>
  );
}

export default SellerDashboard;

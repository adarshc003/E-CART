import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

function SellerOverview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/orders/seller/earnings");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        Loading overview...
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, accent, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        flex: 1,
        minWidth: "260px",
        background: "#ffffff",
        borderRadius: "24px",
        padding: "32px",
        border: "1px solid #f1f1f1",
        boxShadow: "0 20px 50px rgba(0,0,0,0.04)",
        position: "relative",
      }}
    >
      {/* Accent Line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "4px",
          width: "100%",
          background: accent,
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
        }}
      />

      <div
        style={{
          fontSize: "13px",
          color: "#777",
          marginBottom: "10px",
          letterSpacing: "0.3px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: 700,
          marginBottom: "6px",
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "#999",
        }}
      >
        {subtitle}
      </div>
    </motion.div>
  );

  return (
    <div style={{ width: "100%" }}>
      {/* HEADER */}
      <div
        style={{
          marginBottom: "45px",
        }}
      >
        <h2
          style={{
            fontWeight: 700,
            marginBottom: "6px",
          }}
        >
          Seller Dashboard
        </h2>

        <p
          style={{
            color: "#777",
            fontSize: "14px",
          }}
        >
          Performance summary and order analytics
        </p>
      </div>

      {/* STATS GRID */}
      <div
        style={{
          display: "flex",
          gap: "28px",
          flexWrap: "wrap",
        }}
      >
        <StatCard
          title="Total Revenue"
          value={`₹${data.totalRevenue}`}
          subtitle="Revenue from delivered orders"
          accent="#16a34a"
          delay={0}
        />

        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          subtitle="All-time orders received"
          accent="#4f8cff"
          delay={0.1}
        />

        <StatCard
          title="Delivered Orders"
          value={data.deliveredOrders}
          subtitle="Successfully completed"
          accent="#22c55e"
          delay={0.2}
        />

        <StatCard
          title="Pending Orders"
          value={data.pendingOrders}
          subtitle="Awaiting processing"
          accent="#f59e0b"
          delay={0.3}
        />
      </div>
    </div>
  );
}

export default SellerOverview;

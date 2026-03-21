import { useEffect, useState } from "react";
import API from "../../services/api";
import { motion } from "framer-motion";
import { FaUserShield, FaUsers, FaStore, FaBoxOpen } from "react-icons/fa";

function AdminDashboard() {
  const [tab, setTab] = useState("requests");
  const [sellerRequests, setSellerRequests] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const loadData = async () => {
    try {
      const [reqRes, sellerRes, userRes, prodRes] = await Promise.all([
        API.get("/admin/seller-requests"),
        API.get("/admin/sellers"),
        API.get("/admin/users"),
        API.get("/admin/products"),
      ]);

      setSellerRequests(reqRes.data);
      setSellers(sellerRes.data);
      setUsers(userRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error("Admin load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ========= ACTIONS ========= */
  const approveSeller = async (id) => {
    await API.put(`/admin/approve-seller/${id}`);
    loadData();
  };

  const removeSeller = async (id) => {
    if (!window.confirm("Remove seller permanently?")) return;
    await API.delete(`/admin/remove-seller/${id}`);
    loadData();
  };

  const toggleUser = async (id) => {
    await API.put(`/admin/toggle-user/${id}`);
    loadData();
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Remove this product?")) return;
    await API.delete(`/admin/products/${id}`);
    loadData();
  };

  /* ========= UI COMPONENTS ========= */

  const TabButton = ({ label, value, count, icon }) => (
    <button
      onClick={() => setTab(value)}
      style={{
        padding: "10px 22px",
        borderRadius: "40px",
        border: "none",
        background:
          tab === value
            ? "linear-gradient(135deg,#4f8cff,#6c5ce7)"
            : "#f3f6ff",
        color: tab === value ? "#fff" : "#333",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow:
          tab === value
            ? "0 8px 20px rgba(79,140,255,0.25)"
            : "none",
        transition: "0.3s",
      }}
    >
      {icon}
      {label}
      <span
        style={{
          background: tab === value ? "rgba(255,255,255,0.2)" : "#fff",
          padding: "2px 8px",
          borderRadius: "20px",
          fontSize: "12px",
        }}
      >
        {count}
      </span>
    </button>
  );

  const Card = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="col-md-4 mb-4"
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "25px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.05)",
          border: "1px solid #f1f1f1",
          height: "100%",
        }}
      >
        {children}
      </div>
    </motion.div>
  );

  return (
    <div style={{ width: "92%", margin: "80px auto", maxWidth: "1200px" }}>
      <h2 style={{ fontWeight: 700, marginBottom: "35px" }}>
        Admin Control Panel
      </h2>

      {/* ========= TABS ========= */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "45px",
        }}
      >
        <TabButton
          label="Seller Requests"
          value="requests"
          count={sellerRequests.length}
          icon={<FaUserShield />}
        />
        <TabButton
          label="Sellers"
          value="sellers"
          count={sellers.length}
          icon={<FaStore />}
        />
        <TabButton
          label="Users"
          value="users"
          count={users.length}
          icon={<FaUsers />}
        />
        <TabButton
          label="Products"
          value="products"
          count={products.length}
          icon={<FaBoxOpen />}
        />
      </div>

      <div className="row">
        {/* SELLER REQUESTS */}
        {tab === "requests" &&
          sellerRequests.map((s) => (
            <Card key={s._id}>
              <h6 style={{ fontWeight: 600 }}>{s.name}</h6>
              <p style={{ color: "#777", fontSize: "14px" }}>{s.email}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button
                  onClick={() => approveSeller(s._id)}
                  style={{
                    flex: 1,
                    borderRadius: "30px",
                    border: "none",
                    padding: "8px",
                    background:
                      "linear-gradient(135deg,#22c55e,#16a34a)",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  Approve
                </button>

                <button
                  onClick={() => removeSeller(s._id)}
                  style={{
                    flex: 1,
                    borderRadius: "30px",
                    border: "1px solid #ff4d4f",
                    background: "transparent",
                    color: "#ff4d4f",
                    fontWeight: 600,
                  }}
                >
                  Reject
                </button>
              </div>
            </Card>
          ))}

        {/* SELLERS */}
        {tab === "sellers" &&
          sellers.map((s) => (
            <Card key={s._id}>
              <h6 style={{ fontWeight: 600 }}>{s.name}</h6>
              <p style={{ color: "#777", fontSize: "14px" }}>{s.email}</p>

              <div
                style={{
                  marginTop: "15px",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: "#e6f9f0",
                  color: "#16a34a",
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "inline-block",
                }}
              >
                Approved Seller
              </div>

              <button
                onClick={() => removeSeller(s._id)}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  borderRadius: "30px",
                  padding: "8px",
                  border: "1px solid #ff4d4f",
                  background: "transparent",
                  color: "#ff4d4f",
                  fontWeight: 600,
                }}
              >
                Remove Seller
              </button>
            </Card>
          ))}

        {/* USERS */}
        {tab === "users" &&
          users.map((u) => (
            <Card key={u._id}>
              <h6 style={{ fontWeight: 600 }}>{u.name}</h6>
              <p style={{ color: "#777", fontSize: "14px" }}>{u.email}</p>

              <button
                onClick={() => toggleUser(u._id)}
                style={{
                  marginTop: "18px",
                  width: "100%",
                  borderRadius: "30px",
                  padding: "8px",
                  border: "none",
                  fontWeight: 600,
                  background: u.isBlocked
                    ? "linear-gradient(135deg,#22c55e,#16a34a)"
                    : "linear-gradient(135deg,#f59e0b,#fbbf24)",
                  color: "#fff",
                }}
              >
                {u.isBlocked ? "Unblock User" : "Block User"}
              </button>
            </Card>
          ))}

        {/* PRODUCTS */}
        {tab === "products" &&
          products.map((p) => (
            <Card key={p._id}>
              <h6 style={{ fontWeight: 600 }}>{p.name}</h6>
              <p style={{ color: "#777", fontSize: "14px" }}>
                Seller: {p.seller?.name || "N/A"}
              </p>
              <p style={{ fontWeight: 700 }}>₹{p.price}</p>

              <button
                onClick={() => removeProduct(p._id)}
                style={{
                  marginTop: "18px",
                  width: "100%",
                  borderRadius: "30px",
                  padding: "8px",
                  border: "1px solid #ff4d4f",
                  background: "transparent",
                  color: "#ff4d4f",
                  fontWeight: 600,
                }}
              >
                Remove Product
              </button>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

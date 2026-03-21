import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaStore,
  FaSearch,
} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const token = localStorage.getItem("token");
  const isHome = location.pathname.startsWith("/home");

  /* Screen size detection */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Fetch user */
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    API.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.clear();
        setUser(null);
      });
  }, [token]);

  /* Search navigation */
  useEffect(() => {
    if (!isHome) return;

    const timer = setTimeout(() => {
      const query = search.trim();
      navigate(query ? `/home?keyword=${query}` : "/home", {
        replace: true,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [search, isHome, navigate]);

  const logoutHandler = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login/user");
  };

  const buttonBase = {
    borderRadius: "40px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "fixed",
          top: "20px",
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 1000,
          padding: "0 15px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1350px",
            padding: "16px 30px",
            borderRadius: "26px",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          {/* LEFT */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link to="/home">
              <FaStore size={22} color="#4f8cff" />
            </Link>
            <Link
              to="/home"
              style={{
                fontSize: isMobile ? "1.2rem" : "1.5rem",
                fontWeight: 600,
                textDecoration: "none",
                color: "#111",
              }}
            >
              ECart
            </Link>
          </div>

          {/* DESKTOP SEARCH */}
          {!isMobile && isHome && (
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "520px" }}>
                <FaSearch
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "18px",
                    transform: "translateY(-50%)",
                    color: "#888",
                  }}
                />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 20px 12px 45px",
                    borderRadius: "40px",
                    border: "1px solid rgba(0,0,0,0.08)",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          )}

          {/* RIGHT SECTION */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* MOBILE SEARCH ICON */}
            {isMobile && isHome && (
              <FaSearch
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => setMobileSearchOpen(true)}
              />
            )}

            {!user ? (
              <>
                {/* LOGIN BUTTON */}
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login/user")}
                  style={{
                    ...buttonBase,
                    padding: isMobile ? "6px 14px" : "10px 22px",
                    fontSize: isMobile ? "12px" : "14px",
                    border: "1px solid #4f8cff",
                    background: "transparent",
                    color: "#4f8cff",
                  }}
                >
                  Login
                </motion.button>

                {/* BECOME SELLER BUTTON */}
                <motion.button
                  whileHover={{
                    y: -2,
                    boxShadow: "0 12px 25px rgba(79,140,255,0.35)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register/seller")}
                  style={{
                    ...buttonBase,
                    padding: isMobile ? "6px 16px" : "10px 26px",
                    fontSize: isMobile ? "12px" : "14px",
                    border: "none",
                    color: "#fff",
                    background: "linear-gradient(135deg,#4f8cff,#6c5ce7)",
                  }}
                >
                  Become Seller
                </motion.button>
              </>
            ) : (
              <>
                {/* CART */}
                <motion.div
                  whileHover={{ y: -3, scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/cart")}
                  style={{
                    cursor: "pointer",
                    fontSize: isMobile ? "20px" : "22px",
                  }}
                >
                  🛒
                </motion.div>

                {/* PROFILE DROPDOWN */}
                <div
                  ref={dropdownRef}
                  style={{ position: "relative" }}
                  onMouseEnter={() => !isMobile && setDropdownOpen(true)}
                  onMouseLeave={() => !isMobile && setDropdownOpen(false)}
                >
                  <div
                    onClick={() => isMobile && setDropdownOpen(!dropdownOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "40px",
                      background: "rgba(255,255,255,0.8)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      cursor: "pointer",
                    }}
                  >
                    <FaUserCircle size={22} />
                   <span>
  {user?.name?.trim() ||
   (user?.role === "admin" ? "Admin" : "Admin")}
</span>


                  </div>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "50px",
                          background: "#fff",
                          borderRadius: "16px",
                          boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
                          minWidth: "180px",
                        }}
                      >
                        <DropdownItem text="My Profile" onClick={() => navigate("/profile")} />
                        <DropdownItem text="My Orders" onClick={() => navigate("/orders")} />
                        <DropdownItem text="Wishlist" onClick={() => navigate("/wishlist")} />
                        {user.role === "seller" && (
                          <DropdownItem text="Seller Dashboard" onClick={() => navigate("/seller")} />
                        )}
                        {user.role === "admin" && (
                          <DropdownItem text="Admin Panel" onClick={() => navigate("/admin")} />
                        )}
                        <DropdownItem text="Logout" danger onClick={logoutHandler} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      <div style={{ height: 120 }} />
    </>
  );
}

function DropdownItem({ text, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 16px",
        cursor: "pointer",
        color: danger ? "#dc2626" : "#111",
      }}
    >
      {text}
    </div>
  );
}

export default Navbar;

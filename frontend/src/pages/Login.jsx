import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (!showOtp) {
        const res = await API.post("/auth/login", { email, password });

        if (res.data.otpRequired) {
          setShowOtp(true);
          setMessage("OTP sent to your email");
          return;
        }

        if (res.data.token) {
          saveAndRedirect(res.data);
        }
      } else {
        const res = await API.post("/auth/verify-otp", {
          email,
          otp,
        });

        saveAndRedirect(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const saveAndRedirect = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role);
    localStorage.setItem("userId", data.user.id);
    navigate("/home");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: -100 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "clamp(30px, 5vw, 45px)",
          borderRadius: "30px",
          background: "#ffffff",
          boxShadow: "0 35px 80px rgba(0,0,0,0.06)",
          border: "1px solid #f1f1f1",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2
            style={{
              fontWeight: 700,
              marginBottom: "6px",
              color: "#111827",
            }}
          >
            Welcome Back
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Sign in to continue to ECART
          </p>
        </div>

        {/* ALERTS */}
        <AnimatePresence>
          {(error || message) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: "18px",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "13px",
                background: error ? "#fff5f5" : "#eef4ff",
                color: error ? "#dc2626" : "#2563eb",
                border: error
                  ? "1px solid #fecaca"
                  : "1px solid #dbeafe",
              }}
            >
              {error || message}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <Input
            icon={<FaEnvelope />}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
          />

          <Input
            icon={<FaLock />}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <AnimatePresence>
            {showOtp && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Input
                  icon={<FaKey />}
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "20px",
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
              cursor: "pointer",
            }}
          >
            {loading
              ? "Please wait..."
              : showOtp
              ? "Verify & Login"
              : "Login"}
          </motion.button>
        </form>

        {/* DIVIDER */}
        <div
          style={{
            textAlign: "center",
            margin: "25px 0 18px",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          OR
        </div>

        
       {/* GOOGLE LOGIN */}
<div style={{ marginTop: "10px" }}>
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        const res = await API.post("/auth/google", {
          credential: credentialResponse.credential,
        });
        saveAndRedirect(res.data);
      } catch (err) {
        console.log(err.response?.data);
        setError("Google login failed");
      }
    }}
    onError={() => setError("Google login failed")}
    theme="outline"
    shape="pill"
    size="large"
    width="100%"
    text="continue_with"
  />
</div>


        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          Don’t have an account?{" "}
          <Link
            to="/register/user"
            style={{
              fontWeight: 600,
              color: "#4f8cff",
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function Input({ icon, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "12px 14px",
          background: "#f9fafb",
        }}
      >
        <span style={{ marginRight: "10px", color: "#4f8cff" }}>
          {icon}
        </span>
        <input
          type={type}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
            fontSize: "14px",
          }}
        />
      </div>
    </div>
  );
}

export default Login;

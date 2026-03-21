import { useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import { toast } from "sonner";
import { FaUserPlus } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const { role } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    companyName: "",
    companyAddress: "",
    gstNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ========= REFS FOR KEYBOARD NAVIGATION ========= */
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const companyNameRef = useRef(null);
  const companyAddressRef = useRef(null);
  const gstRef = useRef(null);

  const getFieldOrder = () => {
    const baseFields = [nameRef, emailRef, phoneRef, passwordRef];

    if (role === "seller") {
      return [
        ...baseFields,
        companyNameRef,
        companyAddressRef,
        gstRef,
      ];
    }

    return baseFields;
  };

  const handleKeyDown = (e, ref) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const fields = getFieldOrder();
      const currentIndex = fields.findIndex(
        (field) => field === ref
      );

      if (currentIndex !== -1) {
        if (currentIndex + 1 < fields.length) {
          fields[currentIndex + 1].current?.focus();
        } else {
          // Last field → submit form
          e.target.form.requestSubmit();
        }
      }
    }
  };

  /* ================= VALIDATION ================= */
  const validateField = (name, value) => {
    let error = "";

    if (name === "name" && !/^[A-Za-z]+ [A-Za-z]+$/.test(value)) {
      error = "Enter first & last name (Eg: Rahul Kumar)";
    }

    if (name === "email" && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
      error = "Only @gmail.com emails allowed";
    }

    if (name === "phone" && !/^[6-9]\d{9}$/.test(value)) {
      error = "Enter valid 10-digit phone number";
    }

    if (name === "password" && value.length < 6) {
      error = "Minimum 6 characters required";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  /* ================= SUBMIT ================= */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      errors.name ||
      errors.email ||
      errors.password ||
      !form.name ||
      !form.email ||
      !form.password ||
      (role === "seller" &&
        (!form.companyName || !form.companyAddress))
    ) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        isSeller: role === "seller",
        companyName: form.companyName,
        companyAddress: form.companyAddress,
        gstNumber: form.gstNumber,
      });

      toast.success("Registration successful 🎉");
      navigate("/login/user");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "30px",
          padding: "50px 45px",
          boxShadow: "0 35px 80px rgba(0,0,0,0.06)",
          border: "1px solid #f1f1f1",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <FaUserPlus
            size={38}
            color="#4f8cff"
            style={{ marginBottom: "15px" }}
          />
          <h2 style={{ fontWeight: 700, marginBottom: "6px" }}>
            Create Account
          </h2>
          <p style={{ fontSize: "14px", color: "#777" }}>
            {role === "seller"
              ? "Register as a Seller"
              : "Register to start shopping"}
          </p>
        </div>

        <form onSubmit={submitHandler} noValidate>

          <InputField label="Full Name" name="name"
            value={form.name} onChange={handleChange}
            error={errors.name} placeholder="First Name Last Name"
            refProp={nameRef}
            onKeyDown={(e)=>handleKeyDown(e,nameRef)}
          />

          <InputField label="Email" name="email"
            type="email" value={form.email}
            onChange={handleChange} error={errors.email}
            placeholder="example@gmail.com"
            refProp={emailRef}
            onKeyDown={(e)=>handleKeyDown(e,emailRef)}
          />

          <InputField label="Phone Number" name="phone"
            value={form.phone} onChange={handleChange}
            error={errors.phone} placeholder="10-digit mobile number"
            refProp={phoneRef}
            onKeyDown={(e)=>handleKeyDown(e,phoneRef)}
          />

          <InputField label="Password" name="password"
            type="password" value={form.password}
            onChange={handleChange} error={errors.password}
            placeholder="Minimum 6 characters"
            refProp={passwordRef}
            onKeyDown={(e)=>handleKeyDown(e,passwordRef)}
          />

          {role === "seller" && (
            <>
              <SectionTitle text="Seller Information" />

              <InputField label="Company Name" name="companyName"
                value={form.companyName} onChange={handleChange}
                placeholder="Enter company name"
                refProp={companyNameRef}
                onKeyDown={(e)=>handleKeyDown(e,companyNameRef)}
              />

              <InputField label="Company Address" name="companyAddress"
                value={form.companyAddress} onChange={handleChange}
                placeholder="Enter company address"
                refProp={companyAddressRef}
                onKeyDown={(e)=>handleKeyDown(e,companyAddressRef)}
              />

              <InputField label="GST Number" name="gstNumber"
                value={form.gstNumber} onChange={handleChange}
                placeholder="Enter GST number"
                refProp={gstRef}
                onKeyDown={(e)=>handleKeyDown(e,gstRef)}
              />
            </>
          )}

          <button disabled={loading}
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
            }}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={{
          marginTop: "25px",
          textAlign: "center",
          fontSize: "14px",
          color: "#666",
        }}>
          Already have an account?{" "}
          <Link to="/login/user" style={{ fontWeight: 600 }}>
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

/* ========= INPUT COMPONENT ========= */

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  refProp,
  onKeyDown
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{
        fontSize: "13px",
        fontWeight: 600,
        color: "#555",
        marginBottom: "6px",
        display: "block",
      }}>
        {label}
      </label>

      <input
        ref={refProp}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        required
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "14px",
          border: error
            ? "1px solid #dc3545"
            : "1px solid #e5e7eb",
          fontSize: "14px",
          outline: "none",
          transition: "0.2s",
        }}
      />

      {error && (
        <div style={{
          fontSize: "12px",
          color: "#dc3545",
          marginTop: "4px",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ text }) {
  return (
    <div style={{
      marginTop: "25px",
      marginBottom: "15px",
      fontWeight: 600,
      fontSize: "14px",
      color: "#4f8cff",
    }}>
      {text}
    </div>
  );
}

export default Register;

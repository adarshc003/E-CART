import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import {
  FaCamera,
  FaCheck,
  FaTimes,
  FaUser,
  FaPen,
} from "react-icons/fa";
import { toast } from "sonner";

function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => {
        setUser(res.data);
        setForm(res.data);
        setImagePreview(res.data.profileImage);
      })
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  const saveField = async (field) => {
    try {
      const formData = new FormData();
      formData.append(field, form[field]);

      await API.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditingField(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await API.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile photo updated");
    } catch {
      toast.error("Upload failed");
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "140px" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={container}>
      <div style={layout}>
        {/* LEFT PROFILE CARD */}
        <div style={leftCard}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={profileImageWrapper}>
              {imagePreview ? (
                <img
                  src={`http://localhost:5000${imagePreview}`}
                  alt="Profile"
                  style={profileImage}
                />
              ) : (
                <FaUser size={50} color="#bbb" />
              )}
            </div>

            {/* PREMIUM CAMERA BUTTON */}
            <button
              onClick={() => fileInputRef.current.click()}
              style={cameraBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translate(25%, 25%) scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translate(25%, 25%) scale(1)";
              }}
            >
              <FaCamera size={13} />
            </button>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          <h3 style={{ marginTop: "20px", fontWeight: 700 }}>
            {user.name}
          </h3>

          <p style={{ color: "#777" }}>
            {user.role?.toUpperCase()}
          </p>
        </div>

        {/* RIGHT DETAILS */}
        <div style={rightCard}>
          <h3 style={{ marginBottom: "30px" }}>
            Account Information
          </h3>

          <EditableField
            label="Email Address"
            field="email"
            form={form}
            setForm={setForm}
            editingField={editingField}
            setEditingField={setEditingField}
            saveField={saveField}
          />

          <EditableField
            label="Phone Number"
            field="phone"
            form={form}
            setForm={setForm}
            editingField={editingField}
            setEditingField={setEditingField}
            saveField={saveField}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= EDITABLE FIELD ================= */

function EditableField({
  label,
  field,
  form,
  setForm,
  editingField,
  setEditingField,
  saveField,
}) {
  const [error, setError] = useState("");
  const isEditing = editingField === field;

  const validate = (value) => {
    let err = "";

    if (field === "email") {
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
        err = "Only valid @gmail.com email allowed";
      }
    }

    if (field === "phone") {
      if (!/^[6-9]\d{9}$/.test(value)) {
        err = "Enter valid 10-digit number";
      }
    }

    setError(err);
    return err === "";
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, [field]: value });
    validate(value);
  };

  const handleSave = () => {
    if (!validate(form[field])) {
      toast.error("Fix errors before saving");
      return;
    }
    saveField(field);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isEditing) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <label style={labelStyle}>{label}</label>

      <div style={inputWrapper}>
        <input
          value={form[field] || ""}
          disabled={!isEditing}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{
            ...inputStyle,
            border: error
              ? "1px solid #ef4444"
              : isEditing
              ? "1px solid #4f8cff"
              : "1px solid #eee",
          }}
        />

        {!isEditing ? (
          <FaPen
            style={pencilIcon}
            onClick={() => {
              setEditingField(field);
              setError("");
            }}
          />
        ) : (
          <div style={actionIcons}>
            <FaCheck
              style={{ color: "#16a34a", cursor: "pointer" }}
              onClick={handleSave}
            />
            <FaTimes
              style={{ color: "#ef4444", cursor: "pointer" }}
              onClick={() => {
                setEditingField(null);
                setError("");
              }}
            />
          </div>
        )}
      </div>

      {error && <div style={errorText}>{error}</div>}
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: "60px 20px",
  display: "flex",
  justifyContent: "center",
};

const layout = {
  width: "100%",
  maxWidth: "1100px",
  display: "flex",
  flexWrap: "wrap",
  gap: "30px",
};

const leftCard = {
  flex: "1 1 300px",
  background: "#fff",
  padding: "40px",
  borderRadius: "24px",
  textAlign: "center",
  boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
};

const rightCard = {
  flex: "2 1 500px",
  background: "#fff",
  padding: "50px",
  borderRadius: "24px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
};

const profileImageWrapper = {
  width: "130px",
  height: "130px",
  borderRadius: "50%",
  background: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const profileImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

/* PREMIUM GLASS CAMERA BUTTON */
const cameraBtn = {
  position: "absolute",
  bottom: "0px",
  right: "0px",
  transform: "translate(25%, 25%)",
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: "50%",
  border: "1px solid rgba(0,0,0,0.08)",
  padding: "9px",
  color: "#374151",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
};

const labelStyle = {
  fontSize: "13px",
  fontWeight: 600,
  marginBottom: "6px",
  display: "block",
  color: "#666",
};

const inputWrapper = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const inputStyle = {
  width: "100%",
  padding: "14px 45px 14px 18px",
  borderRadius: "16px",
  outline: "none",
  transition: "0.3s",
  fontSize: "14px",
};

const pencilIcon = {
  position: "absolute",
  right: "15px",
  color: "#777",
  cursor: "pointer",
};

const actionIcons = {
  position: "absolute",
  right: "15px",
  display: "flex",
  gap: "12px",
};

const errorText = {
  fontSize: "12px",
  color: "#ef4444",
  marginTop: "6px",
};

export default Profile;

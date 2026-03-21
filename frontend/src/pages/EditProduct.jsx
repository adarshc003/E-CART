import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        const p = res.data;
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price || "",
          category: p.category || "",
          stock: p.stock || "",
          image: p.image || "",
        });
      })
      .catch(() => alert("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= SUBMIT ================= */
  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await API.put(`/products/${id}`, form);
      navigate("/my-products");
    } catch {
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-5">
        Loading product details...
      </p>
    );
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <div
        className="p-4"
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h4 className="fw-semibold mb-1 text-center">
          Edit Product
        </h4>
        <p className="text-muted text-center mb-4">
          Update your product details
        </p>

        <form onSubmit={submitHandler}>
          {/* PRODUCT NAME */}
          <div className="mb-3">
            <label className="form-label small">
              Product Name
            </label>
            <input
              className="form-control"
              placeholder="e.g. iPhone 16 Pro Max"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
              style={{ borderRadius: "12px" }}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label small">
              Description
            </label>
            <textarea
              className="form-control"
              placeholder="Brief product description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              required
              style={{ borderRadius: "12px" }}
            />
          </div>

          {/* PRICE */}
          <div className="mb-3">
            <label className="form-label small">
              Price (₹)
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 159999"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
              required
              style={{ borderRadius: "12px" }}
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-3">
            <label className="form-label small">
              Category
            </label>
            <input
              className="form-control"
              placeholder="e.g. Smartphones"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              required
              style={{ borderRadius: "12px" }}
            />
          </div>

          {/* STOCK */}
          <div className="mb-3">
            <label className="form-label small">
              Stock Quantity
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 25"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: e.target.value,
                })
              }
              required
              style={{ borderRadius: "12px" }}
            />
          </div>

          {/* IMAGE */}
          <div className="mb-4">
            <label className="form-label small">
              Image URL
            </label>
            <input
              className="form-control"
              placeholder="https://example.com/product-image.jpg"
              value={form.image}
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.value,
                })
              }
              required
              style={{ borderRadius: "12px" }}
            />
          </div>

          {/* BUTTON */}
          <button
            className="btn btn-warning w-100 fw-semibold"
            style={{
              borderRadius: "14px",
              padding: "10px",
            }}
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;

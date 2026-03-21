import { FaFacebookF, FaInstagram, FaTwitter, FaShieldAlt, FaTruck, FaUndoAlt, FaHeadset } from "react-icons/fa";

function Footer() {
  return (
    <>
     
      <div
        style={{
          background: "#f8fbff",
          padding: "40px 0",
          borderTop: "1px solid #eee",
        }}
      >
        <div className="container">
          <div className="row text-center">

            <div className="col-md-3 mb-3">
              <FaShieldAlt size={28} color="#4f8cff" />
              <h6 className="mt-2 fw-semibold">Secure Payment</h6>
              <small className="text-muted">
                100% secure transactions
              </small>
            </div>

            <div className="col-md-3 mb-3">
              <FaTruck size={28} color="#4f8cff" />
              <h6 className="mt-2 fw-semibold">Fast Delivery</h6>
              <small className="text-muted">
                Delivered within 3–5 days
              </small>
            </div>

            <div className="col-md-3 mb-3">
              <FaUndoAlt size={28} color="#4f8cff" />
              <h6 className="mt-2 fw-semibold">Easy Returns</h6>
              <small className="text-muted">
                7 day replacement policy
              </small>
            </div>

            <div className="col-md-3 mb-3">
              <FaHeadset size={28} color="#4f8cff" />
              <h6 className="mt-2 fw-semibold">24/7 Support</h6>
              <small className="text-muted">
                Dedicated customer help
              </small>
            </div>

          </div>
        </div>
      </div>

      {/* ================= BRAND PARTNERS ================= */}
      <div
        style={{
          background: "#ffffff",
          padding: "35px 0",
          borderTop: "1px solid #eee",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h6 className="fw-semibold mb-4 text-muted">
            Trusted Brand Partners
          </h6>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "50px",
              flexWrap: "wrap",
              opacity: 0.7,
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            <span>Apple</span>
            <span>Samsung</span>
            <span>Sony</span>
            <span>Dell</span>
            <span>HP</span>
            <span>LG</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN FOOTER ================= */}
      <footer
        style={{
          background: "#111827",
          color: "#fff",
          padding: "60px 0 30px",
        }}
      >
        <div className="container">
          <div className="row">

            {/* BRAND */}
            <div className="col-md-4 mb-4">
              <h5 className="fw-bold mb-3">
                ECART
              </h5>
              <p style={{ fontSize: "14px", color: "#bbb" }}>
                Premium online shopping experience with secure payments,
                fast delivery and trusted sellers.
              </p>
            </div>

            {/* LINKS */}
            <div className="col-md-2 mb-4">
              <h6 className="fw-semibold mb-3">Company</h6>
              <p className="small mb-2 text-light">About Us</p>
              <p className="small mb-2 text-light">Careers</p>
              <p className="small mb-2 text-light">Press</p>
            </div>

            <div className="col-md-2 mb-4">
              <h6 className="fw-semibold mb-3">Support</h6>
              <p className="small mb-2 text-light">Help Center</p>
              <p className="small mb-2 text-light">Returns</p>
              <p className="small mb-2 text-light">Shipping</p>
            </div>

            <div className="col-md-2 mb-4">
              <h6 className="fw-semibold mb-3">Legal</h6>
              <p className="small mb-2 text-light">Privacy Policy</p>
              <p className="small mb-2 text-light">Terms of Service</p>
              <p className="small mb-2 text-light">Cookies</p>
            </div>

            {/* SOCIAL */}
            <div className="col-md-2 mb-4">
              <h6 className="fw-semibold mb-3">Follow Us</h6>

              <div className="d-flex gap-3">
                <FaFacebookF style={{ cursor: "pointer" }} />
                <FaInstagram style={{ cursor: "pointer" }} />
                <FaTwitter style={{ cursor: "pointer" }} />
              </div>
            </div>

          </div>

          <hr style={{ borderColor: "#333" }} />

          <div
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#aaa",
            }}
          >
            © {new Date().getFullYear()} ECART. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;

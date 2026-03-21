import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import CategoryBar from "../components/CategoryBar";

function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const productsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= SCREEN SIZE ================= */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= FETCH PRODUCTS ================= */
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const keyword = params.get("keyword");

  let url = "/products";

  if (keyword) {
    url += `?keyword=${encodeURIComponent(keyword)}`;
  }

  API.get(url)
    .then((res) => {
      let result = res.data;

      if (category && category !== "all") {
        result = result.filter(
          (p) =>
            p.category.toLowerCase() === category.toLowerCase()
        );
      }

      setProducts(res.data);
      setFiltered(result);
    })
    .catch(console.log);
}, [location.search]);



  /* ================= RESTORE SCROLL ================= */
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("homeScroll");
    if (savedScroll) {
      window.scrollTo({
        top: parseInt(savedScroll),
        behavior: "auto",
      });
    }
  }, []);

  const handleProductClick = (id) => {
    sessionStorage.setItem("homeScroll", window.scrollY);
    navigate(`/product/${id}`);
  };



  const handleExplore = () => {
    productsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <HeroSlider onExplore={handleExplore} />
      <CategoryBar />

      <div
        ref={productsRef}
        style={{
          width: isMobile ? "95%" : "92%",
          margin: isMobile ? "30px auto" : "60px auto",
        }}
      >
        <h4 style={{ marginBottom: "30px", fontWeight: 600 }}>
          Featured Products
        </h4>

        <div className="row">
          {filtered.map((product) => {
            const rating = (Math.random() * 1 + 4).toFixed(1);
            const reviews = Math.floor(Math.random() * 2000 + 100);
            const originalPrice = Math.round(product.price * 1.2);

            return (
              <div
                className={
                  isMobile
                    ? "col-6 mb-3"
                    : "col-lg-3 col-md-4 col-sm-6 mb-4"
                }
                key={product._id}
              >
                <div
                  onClick={() =>
                    handleProductClick(product._id)
                  }
                  style={{
                    borderRadius: isMobile ? "14px" : "20px",
                    background: "#fff",
                    border: "1px solid #f2f2f2",
                    padding: isMobile ? "12px" : "18px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    height: "100%",
                    position: "relative",
                    boxShadow: isMobile
                      ? "0 4px 12px rgba(0,0,0,0.06)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform =
                        "translateY(-6px)";
                      e.currentTarget.style.boxShadow =
                        "0 20px 40px rgba(0,0,0,0.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform =
                        "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "none";
                    }
                  }}
                >
                  {/* OFFER BADGE */}
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      background:
                        "linear-gradient(135deg,#ff4d4f,#ff7875)",
                      color: "#fff",
                      padding: isMobile
                        ? "3px 8px"
                        : "4px 10px",
                      fontSize: isMobile
                        ? "10px"
                        : "12px",
                      borderRadius: "20px",
                      fontWeight: 600,
                    }}
                  >
                    20% OFF
                  </div>

                  {/* IMAGE */}
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      height: isMobile ? "120px" : "170px",
                      objectFit: "contain",
                      width: "100%",
                      marginBottom: "10px",
                    }}
                  />

                  {/* NAME */}
                  <h6
                    style={{
                      fontWeight: 600,
                      minHeight: isMobile ? "34px" : "42px",
                      fontSize: isMobile
                        ? "0.8rem"
                        : "0.95rem",
                    }}
                  >
                    {product.name}
                  </h6>

                  {/* RATING */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        background: "#16a34a",
                        color: "#fff",
                        fontSize: "11px",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        fontWeight: 600,
                      }}
                    >
                      {rating} ★
                    </span>

                    <span
                      style={{
                        fontSize: "11px",
                        color: "#777",
                      }}
                    >
                      ({reviews})
                    </span>
                  </div>

                  {/* PRICE */}
                  <div>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: isMobile
                          ? "0.95rem"
                          : "1.05rem",
                      }}
                    >
                      ₹{product.price}
                    </span>

                    <span
                      style={{
                        marginLeft: "6px",
                        textDecoration: "line-through",
                        color: "#888",
                        fontSize: "0.8rem",
                      }}
                    >
                      ₹{originalPrice}
                    </span>
                  </div>

                  {/* DELIVERY */}
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "11px",
                      color: "#16a34a",
                      fontWeight: 500,
                    }}
                  >
                    Free Delivery
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Home;

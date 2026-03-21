import { useNavigate, useLocation } from "react-router-dom";
import { FaMobileAlt, FaLaptop, FaCouch, FaTv, FaAddressCard, FaHeadphones } from "react-icons/fa";

function CategoryBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const activeCategory = params.get("category");

  const categories = [
    { name: "All", icon: null },
    { name: "Mobiles", icon: <FaMobileAlt /> },
    { name: "Laptops", icon: <FaLaptop /> },
    { name: "Accessories", icon: <FaHeadphones /> },
    { name: "Electronics", icon: <FaTv /> },
    { name: "Furniture", icon: <FaCouch /> },
    
  ];

  const handleClick = (cat) => {
    if (cat === "All") {
      navigate("/home?category=all"); 
    } else {
      navigate(`/home?category=${cat}`);
    }
  };

  return (
    <div
      style={{
        width: "92%",
        margin: "40px auto 20px",
        display: "flex",
        justifyContent: "center",
        gap: "24px",
        flexWrap: "wrap",
      }}
    >
      {categories.map((cat) => {
        const isActive =
          cat.name === "All"
            ? !activeCategory || activeCategory === "all"
            : activeCategory === cat.name;

        return (
          <button
            key={cat.name}
            onClick={() => handleClick(cat.name)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "40px",
              border: isActive
                ? "1px solid #4f8cff"
                : "1px solid #eee",
              background: isActive
                ? "#f4f8ff"
                : "#ffffff",
              fontWeight: 500,
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            {cat.icon}
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryBar;

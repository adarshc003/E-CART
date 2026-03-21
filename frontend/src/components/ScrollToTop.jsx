import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Only scroll to top when NOT coming from Home
    if (!location.pathname.startsWith("/home")) {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;

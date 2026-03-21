import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function HeroSlider({ onExplore }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slides = [
    {
      tag: "NEW LAUNCH",
      title: "iPhone 15 Pro Max",
      subtitle: "Titanium. Powerful. Pro.",
      price: "₹1,34,900",
      offer: "Up to ₹10,000 Cashback",
      bg: "https://i.pinimg.com/1200x/97/71/6f/97716f02b9480cd65cbf05cc772c22c6.jpg",
    },
    {
      tag: "LIMITED OFFER",
      title: "MacBook Air M3",
      subtitle: "Supercharged for Work & Creativity",
      price: "₹1,14,900",
      offer: "No Cost EMI Available",
      bg: "https://i.pinimg.com/736x/5e/a7/f6/5ea7f6c4f5732eed769c8e15846d75ba.jpg",
    },
    {
      tag: "FLASH SALE",
      title: "Sony WH-1000XM5",
      subtitle: "Industry Leading Noise Cancellation",
      price: "₹29,990",
      offer: "Flat 25% Off Today",
      bg: "https://i.pinimg.com/1200x/52/9a/87/529a87de4ac2b2d8a5c627bd70faf422.jpg",
    },
    {
      tag: "TRENDING",
      title: "Premium Gaming Setup",
      subtitle: "Build Your Ultimate Battle Station",
      price: "Starting ₹79,999",
      offer: "Extra ₹5,000 Bank Discount",
      bg: "https://i.pinimg.com/1200x/29/68/11/29681130ac690894ac1cf672b9832119.jpg",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        borderRadius: isMobile ? "20px" : "40px",
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.12)",
      }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop={true}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                minHeight: isMobile ? "320px" : "450px",
                display: "flex",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-start",
                textAlign: isMobile ? "center" : "left",
                padding: isMobile ? "30px 20px" : "0 80px",
                backgroundImage: `
                  linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.4)),
                  url(${slide.bg})
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  color: "#fff",
                  maxWidth: isMobile ? "100%" : "600px",
                }}
              >
                <span
                  style={{
                    background: "#ff4d4f",
                    padding: "6px 14px",
                    borderRadius: "30px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "1px",
                  }}
                >
                  {slide.tag}
                </span>

                <h1
                  style={{
                    fontSize: isMobile ? "28px" : "48px",
                    marginTop: "20px",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {slide.title}
                </h1>

                <p
                  style={{
                    fontSize: isMobile ? "14px" : "18px",
                    opacity: 0.9,
                    marginBottom: "18px",
                  }}
                >
                  {slide.subtitle}
                </p>

                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: isMobile ? "18px" : "22px",
                  }}
                >
                  {slide.price}
                </h3>

                <p
                  style={{
                    color: "#4f8cff",
                    fontWeight: 600,
                    fontSize: isMobile ? "14px" : "16px",
                  }}
                >
                  {slide.offer}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onExplore}
                  style={{
                    marginTop: "25px",
                    padding: isMobile
                      ? "10px 24px"
                      : "12px 32px",
                    borderRadius: "40px",
                    border: "none",
                    background:
                      "linear-gradient(135deg,#4f8cff,#6c5ce7)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: isMobile ? "14px" : "15px",
                    cursor: "pointer",
                  }}
                >
                  Explore Now
                </motion.button>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default HeroSlider;

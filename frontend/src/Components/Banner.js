import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/Banner.css";

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      title: "Mega Sale on Electronics",
      subtitle: "Up to 70% OFF",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
      overlay: "linear-gradient(135deg, rgba(22, 84, 153, 0.8), rgba(59, 130, 246, 0.5))",
    },
    {
      id: 2,
      title: "New Fashion Collection",
      subtitle: "Exclusive Deals",
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=80",
      overlay: "linear-gradient(135deg, rgba(219, 39, 119, 0.8), rgba(251, 146, 60, 0.5))",
    },
    {
      id: 3,
      title: "Best Home & Garden",
      subtitle: "Limited Time Offer",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
      overlay: "linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(34, 211, 238, 0.5))",
    },
    {
      id: 4,
      title: "Top Mobile Deals",
      subtitle: "Premium Phones",
      image:
        "https://images.unsplash.com/photo-1512499617640-c2f9992b3cbd?auto=format&fit=crop&w=1400&q=80",
      overlay: "linear-gradient(135deg, rgba(0, 57, 117, 0.8), rgba(30, 64, 175, 0.5))",
    },
    {
      id: 5,
      title: "Beauty & Personal Care",
      subtitle: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1400&q=80",
      overlay: "linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(244, 114, 182, 0.5))",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="banner-container">
      <div className="banner-carousel">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`banner-slide ${index === currentSlide ? "active" : ""}`}
            style={{
              backgroundImage: `${banner.overlay}, url(${banner.image})`,
            }}
          >
            <div className="banner-content">
              <h2 className="banner-title">{banner.title}</h2>
              <p className="banner-subtitle">{banner.subtitle}</p>
              <button className="banner-cta">Shop Now</button>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-button prev" onClick={prevSlide}>
        <FiChevronLeft size={24} />
      </button>
      <button className="carousel-button next" onClick={nextSlide}>
        <FiChevronRight size={24} />
      </button>

      <div className="carousel-indicators">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

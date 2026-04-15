import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link
import axios from "axios";
import { FiStar, FiTruck, FiShield } from "react-icons/fi";
import { CartContext } from "../Context/CartContext";
import Banner from "../Components/Banner";
import Categories from "../Components/Categories";
import "../styles/Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState("");

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load products. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const customImages = {
    "Sample Laptop":
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    Smartphone:
      "https://th.bing.com/th/id/OIP.vJA54HhkzjygE59DhOeiXQHaFR?w=223&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    "Wireless Headphones":
      "https://th.bing.com/th/id/OIP.iGFJ7i0DUqTCdgcDIoxo3QHaHa?w=176&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  };

  const handleQuantityChange = (id, value) => {
    const next = Math.max(1, Number(value) || 1);
    setQuantities({ ...quantities, [id]: next });
  };

  const getProductImage = (product) => {
    return (
      product.image ||
      customImages[product.name] ||
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    );
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    addToCart(product, quantity);
    setMessage(`${quantity} x ${product.name} added to cart.`);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    navigate("/checkout");
  };

  return (
    <main className="home-container">
      <Banner />
      <Categories />

      <section className="best-deals-section">
        <div className="section-header">
          <h2 className="section-title">Best Deals for You</h2>

          {/* ✅ FIXED HERE */}
          <Link to="/products" className="see-all-link">
            See All
          </Link>
        </div>

        {message && <div className="status-message">{message}</div>}
        {loading && <div className="status-message">Loading products…</div>}
        {error && <div className="status-message status-error">{error}</div>}
        {!loading && !error && products.length === 0 && (
          <div className="status-message">No products available yet.</div>
        )}

        <div className="product-grid">
          {products.map((p) => (
            <article key={p._id} className="product-card">
              <div className="product-image-wrapper">
                <img
                  className="product-img"
                  src={getProductImage(p)}
                  alt={p.name}
                />
                <span className="product-discount">-20%</span>
              </div>

              <div className="product-body">
                <h3 className="product-name">{p.name}</h3>
                <p className="product-description">{p.description}</p>

                <div className="product-rating">
                  <div className="stars">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <FiStar
                          key={i}
                          size={14}
                          fill="#FFB800"
                          stroke="#FFB800"
                        />
                      ))}
                  </div>
                  <span className="rating-text">(2.4K)</span>
                </div>

                <div className="product-pricing">
                  <span className="product-price">₹{p.price}</span>
                  <span className="product-original-price">
                    ₹{Math.round(p.price * 1.25)}
                  </span>
                </div>

                <div className="delivery-info">
                  <FiTruck size={14} />
                  <span>Free Delivery</span>
                </div>
              </div>

              <div className="product-footer">
                <div className="quantity-control">
                  <label htmlFor={`qty-${p._id}`}>Qty</label>
                  <input
                    id={`qty-${p._id}`}
                    className="quantity-input"
                    type="number"
                    min="1"
                    value={quantities[p._id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(p._id, e.target.value)
                    }
                  />
                </div>

                <div className="button-group">
                  <button
                    className="button-add-cart"
                    onClick={() => handleAddToCart(p)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="button-buy-now"
                    onClick={() => handleBuyNow(p)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section">
        <div className="trust-item">
          <FiTruck size={32} />
          <div>
            <h4>Free Delivery</h4>
            <p>On orders above ₹500</p>
          </div>
        </div>

        <div className="trust-item">
          <FiShield size={32} />
          <div>
            <h4>Secure Checkout</h4>
            <p>100% protected transactions</p>
          </div>
        </div>

        <div className="trust-item">
          <FiShield size={32} />
          <div>
            <h4>Money Back Guarantee</h4>
            <p>30 days return policy</p>
          </div>
        </div>
      </section>
    </main>
  );
}
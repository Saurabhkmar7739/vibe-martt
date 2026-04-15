import { useContext, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiTruck, FiLock, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { CartContext } from "../Context/CartContext";
import "../styles/Cart.css";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const discount = useMemo(() => Math.round(total * 0.1), [total]);
  const finalTotal = total - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    setError("");
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      setError("Please fill in all required fields.");
      return;
    }

    if (paymentMethod === "card" && (!formData.cardName || !formData.cardNumber || !formData.expiry || !formData.cvc)) {
      setError("Please fill in all payment details.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const orderId = `ORD-${Date.now()}`;
      const order = {
        orderId: orderId,
        userId: localStorage.getItem("userId") || "guest",
        userName: formData.fullName,
        userEmail: formData.email,
        userPhone: formData.phone,
        shipping: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        items: cart,
        subtotal: total,
        discount: discount,
        total: finalTotal,
        paymentMethod: paymentMethod,
        status: "Confirmed"
      };

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem("vibeCartOrders") || "[]");
      localStorage.setItem("vibeCartOrders", JSON.stringify([order, ...existing]));

      // Send to backend
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await axios.post("http://localhost:5000/api/orders", order, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (apiErr) {
        console.log("Order saved locally but backend sync failed:", apiErr.message);
      }

      clearCart();
      setStatus("Payment successful! Your order is confirmed.");
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (err) {
      setError("Payment failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="page-header">
          <h1>Checkout</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2>No items to checkout</h2>
          <p>Your cart is empty. Add items before checking out.</p>
          <Link to="/" className="empty-state-button">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="page-header">
        <h1>Secure Checkout</h1>
        <div className="breadcrumb">
          <span><Link to="/cart">Cart</Link></span>
          <span>/</span>
          <span className="active">Checkout</span>
        </div>
      </div>

      <div className="checkout-grid">
        <div>
          <div className="checkout-section">
            <h2 className="section-title">
              <FiTruck size={20} /> Shipping Address
            </h2>

            <div className="form-row">
              <div className="form-field">
                <label>Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="form-field">
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Phone*</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="form-field">
                <label>Address*</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="form-field">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  className="form-input"
                  placeholder="NY"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="form-field">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  className="form-input"
                  placeholder="10001"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2 className="section-title">
              <FiLock size={20} /> Payment Method
            </h2>

            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={loading}
                />
                Credit / Debit Card
              </label>
              <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={loading}
                />
                UPI
              </label>
              <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={loading}
                />
                Cash on Delivery
              </label>
            </div>

            {paymentMethod === 'card' && (
              <>
                <div className="form-row full">
                  <div className="form-field">
                    <label>Cardholder Name*</label>
                    <input
                      type="text"
                      name="cardName"
                      className="form-input"
                      placeholder="Name on card"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-field">
                    <label>Card Number*</label>
                    <input
                      type="text"
                      name="cardNumber"
                      className="form-input"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>Expiry Date*</label>
                    <input
                      type="text"
                      name="expiry"
                      className="form-input"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-field">
                    <label>CVC*</label>
                    <input
                      type="text"
                      name="cvc"
                      className="form-input"
                      placeholder="123"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            {error && <div className="status-message status-error" style={{ marginTop: 16 }}>{error}</div>}
            {status && <div className="status-message" style={{ marginTop: 16 }}>{status}</div>}

            <button 
              className="checkout-button" 
              onClick={handlePayment}
              disabled={loading}
              style={{ marginTop: 24 }}
            >
              {loading ? "Processing..." : `Pay ₹${finalTotal}`}
            </button>
          </div>
        </div>

        <div className="cart-summary">
          <div className="summary-title">Order Summary</div>

          {cart.map(item => (
            <div key={item._id} style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{item.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--muted)' }}>
                <span>{item.quantity}x ₹{item.price}</span>
                <strong style={{ color: 'var(--text)' }}>₹{item.price * item.quantity}</strong>
              </div>
            </div>
          ))}

          <div style={{ paddingTop: 12, borderTop: '2px solid var(--border)' }}>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{total}</strong>
            </div>

            <div className="summary-row">
              <span>Discount (10%)</span>
              <strong style={{ color: '#2e7d32' }}>-₹{discount}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <strong>Free</strong>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <strong>₹{finalTotal}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: 'var(--primary-light)', borderRadius: 6, marginTop: 16, fontSize: 12, color: 'var(--primary)' }}>
            <FiCheckCircle size={16} />
            <span>Secure & encrypted payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

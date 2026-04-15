import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { CartContext } from "../Context/CartContext";
import "../styles/Cart.css";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);

  const getProductImage = (productName) => {
    const imageMap = {
      "Skincare Set": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3",
      "Power Bank": "https://images.unsplash.com/photo-1609042238227-e7213cad54b5?ixlib=rb-4.0.3",
      "Sample Laptop": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3",
      "Smartphone": "https://images.unsplash.com/photo-1511707267537-b85faf00021e?ixlib=rb-4.0.3",
      "Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3",
    };
    return imageMap[productName] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3";
  };
  
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

  const handleDecrease = (item) => {
    const newQty = Number(item.quantity || 1) - 1;
    if (newQty >= 1) {
      updateQuantity(item._id, newQty);
    }
  };

  const handleIncrease = (item) => {
    updateQuantity(item._id, Number(item.quantity || 1) + 1);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>Your cart is empty. Start shopping to add items!</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2>No items in cart</h2>
          <p>Your shopping cart is currently empty</p>
          <Link to="/" className="empty-state-button">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="page-header">
        <h1>Shopping Cart</h1>
        <div className="breadcrumb">
          <span><Link to="/">Home</Link></span>
          <span>/</span>
          <span className="active">Cart ({cart.length} items)</span>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items-section">
          <div className="cart-items-header">
            {cart.length} item{cart.length !== 1 ? "s" : ""} in cart
          </div>

          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-image">
                <img
                  src={
                    item.image ||
                    getProductImage(item.name)
                  }
                  alt={item.name}
                />
              </div>

              <div className="cart-item-body">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>

              <div className="cart-item-footer">
                <div className="quantity-box">
                  <button 
                    aria-label="Decrease quantity"
                    onClick={() => handleDecrease(item)}
                  >
                    <FiMinus size={14} />
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button 
                    aria-label="Increase quantity"
                    onClick={() => handleIncrease(item)}
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                <div className="cart-item-price">
                  <div className="cart-item-price-main">₹{item.price * (item.quantity || 1)}</div>
                  <div className="cart-item-price-original">₹{Math.round(item.price * 1.25)}</div>
                </div>

                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                  aria-label="Remove from cart"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-title">Order Summary</div>
          
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

          <Link to="/checkout" className="checkout-button">
            Proceed to Checkout
          </Link>

          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

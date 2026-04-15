import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiLogOut, FiHome, FiPackage } from "react-icons/fi";
import { CartContext } from "../Context/CartContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🛍️ VibeCart
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/" className="nav-link">
            <FiHome size={16} />
            Home
          </Link>
        </li>

        <li>
          <Link to="/orders" className="nav-link">
            <FiPackage size={16} />
            Orders
          </Link>
        </li>

        {isAdmin && (
          <>
            <li>
              <Link to="/admin" className="nav-link">
                📦 Manage Products
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="nav-link">
                🚚 Manage Orders
              </Link>
            </li>
          </>
        )}

        <li>
          <Link to="/cart" className="nav-link cart-icon-wrapper" aria-label="Cart">
            <FiShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </li>

        <li>
          <button className="nav-button" onClick={logout}>
            <FiLogOut size={16} />
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
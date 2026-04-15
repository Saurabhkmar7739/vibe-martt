import { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const register = async () => {
    setError("");
    setStatus("");
    setLoading(true);

    try {
      // ✅ FIX: use deployed backend URL
      await axios.post(
        "https://vibe-mart-backend.onrender.com/api/users/register",
        data
      );

      setStatus("Registration successful! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Error registering. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-left">
          <h1>Join VibeCart</h1>
          <p>Create your account and start shopping with the best deals and exclusive offers.</p>
        </div>

        <form
          className="auth-card"
          onSubmit={(e) => {
            e.preventDefault();
            register();
          }}
        >
          <div className="auth-header">
            <h2>Create Account</h2>
          </div>

          {status && <div className="status-message">{status}</div>}
          {error && <div className="status-message status-error">{error}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <div className="auth-footer">
            Already have an account? <a href="/login">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}
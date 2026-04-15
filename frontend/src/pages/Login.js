import { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/users/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-left">
          <h1>Welcome Back!</h1>
          <p>Sign in to your VibeCart account to continue shopping and manage your orders.</p>
          <ul className="auth-benefits">
            <li>Quick checkout process</li>
            <li>Track your orders in real-time</li>
            <li>Save your favorites</li>
            <li>Exclusive deals & offers</li>
          </ul>
        </div>

        <form className="auth-card" onSubmit={(e) => { e.preventDefault(); login(); }}>
          <div className="auth-header">
            <h2>Login to VibeCart</h2>
            <p>Enter your credentials to continue</p>
          </div>

          {error && <div className="status-message status-error">{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@email.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="auth-footer">
            Don't have an account? <a href="/register">Create one now</a>
          </div>
        </form>
      </div>
    </div>
  );
}

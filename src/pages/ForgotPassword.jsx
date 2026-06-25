import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Auth.css";
import api from "../utils/api";
function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(
        `/forgot-password?email=${encodeURIComponent(email)}`
      );
      setMessage(res.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="logo">AI Interview Platform</div>

        <h2>Forgot Password</h2>

        <p className="subtitle">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="link-text">{message}</p>}

        <p className="link-text">
          Remember your password?
          <Link to="/login"> Login</Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;

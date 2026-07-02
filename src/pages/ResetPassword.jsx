import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import api from "../utils/api";
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(
        `/reset-password?token=${token}&new_password=${encodeURIComponent(password)}`
      );

      setMessage(res.data.message);

      // Redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Error resetting password"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p className="subtitle">
            Invalid or missing reset token.{" "}
            <Link to="/forgot-password">Request a new one.</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="logo">AI Interview Platform</div>

        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && <p className="link-text">{message}</p>}

      </div>
    </div>
  );
}

export default ResetPassword;
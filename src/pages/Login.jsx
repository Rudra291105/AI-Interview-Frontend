import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import api,{ saveTokens } from "../utils/api";
import "./Auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });//useState because it store email and pass enter by user also to manage all login form variable in one
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });//dynamically identifies which input field changed.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();//prevent pagerefreshing
    setLoading(true);//remainini

    try {
      const res = await api.post("/login", form);//post is use because data is sent to fastapi if we get data is sent in url

      const { access_token, refresh_token, role } = res.data;

      // Store JWT tokens (replaces old user_id / user_name approach)
      saveTokens(access_token, refresh_token);
      localStorage.setItem("role", role);
      if (role==="admin"){
        navigate("/admin")
      }
      else{
        navigate("/dashboard");
      }
      
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Invalid Email or Password";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="logo">AI Interview Platform</div>

        <p className="subtitle">Practice Interviews with AI</p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Link className="forgot-link" to="/forgot-password">
            Forgot Password?
          </Link>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="link-text">
          Don't have an account?
          <Link to="/signup"> Sign Up</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;

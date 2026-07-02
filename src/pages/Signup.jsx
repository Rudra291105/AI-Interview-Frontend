import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./Auth.css";
import api, { saveTokens } from "../utils/api";
function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    graduation_year: "",
    primary_skill: "",
    target_company: "",
    target_role: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend expects graduation_year as integer
      const payload = {
        ...form,
        graduation_year: parseInt(form.graduation_year, 10),//parseInt converts string into number before sending request.
      };

      const res = await  api.post("/register", payload);

      alert(res.data.message || "Registration successful!");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.detail || "Registration Failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/google-login", {
        token: credentialResponse.credential,
      });
      const { access_token, refresh_token, role } = res.data;
      saveTokens(access_token, refresh_token);
      localStorage.setItem("role", role);
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Google sign-up failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    alert("Google sign-in was cancelled or failed. Please try again.");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="logo">AI Interview Platform</div>

        <p className="subtitle">Create your account</p>

        <div className="google-btn-wrap" style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
            width="280"
          />
        </div>

        <div className="card-divider">
          <span className="card-divider-line" />
          <span className="card-divider-text">or sign up with email</span>
          <span className="card-divider-line" />
        </div>

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

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

          <input
            type="text"
            name="college"
            placeholder="College"
            value={form.college}
            onChange={handleChange}
          />

          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={form.branch}
            onChange={handleChange}
          />

          <input
            type="number"
            name="graduation_year"
            placeholder="Graduation Year"
            value={form.graduation_year}
            onChange={handleChange}
          />

          <input
            type="text"
            name="primary_skill"
            placeholder="Primary Skill"
            value={form.primary_skill}
            onChange={handleChange}
          />

          <input
            type="text"
            name="target_company"
            placeholder="Target Company"
            value={form.target_company}
            onChange={handleChange}
          />

          <input
            type="text"
            name="target_role"
            placeholder="Target Role"
            value={form.target_role}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="link-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;
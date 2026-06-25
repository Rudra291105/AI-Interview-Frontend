import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import api from "../utils/api";
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

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="logo">AI Interview Platform</div>

        <p className="subtitle">Create your account</p>

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

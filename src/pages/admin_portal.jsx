import { useState } from "react";
import "./admin_portal.css";

function AdminRequest() {
  const [form, setForm] = useState({
    role: "",
    hiringVolume: "",
    organization: "yes",
    email: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = () => {
    const domain = form.email.split("@")[1];

    const personalDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
    ];

    if (!form.email || personalDomains.includes(domain)) {
      alert("Please enter a valid organization email.");
      return;
    }

    setOtpSent(true);
    alert("Verification code sent successfully.");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.otp !== "0000") {
    alert("Invalid OTP");
    return;
  }

  try {
    const res = await api.post("/request-admin", {
      role: form.role,
      hiring_volume: form.hiringVolume,
      organization_email: form.email,
    });

    alert(res.data.message);

    if (res.data.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    console.error(err);
    alert("Verification failed");
  }
};

  return (
    <div className="admin-request-page">
      <div className="admin-request-card">

        <div className="verify-icon">🛡️</div>

        <h1>Organization Verification</h1>

        <p className="subtitle">
          Verify your organization identity to unlock admin capabilities.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Your Role</label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option>Recruiter</option>
              <option>HR Professional</option>
              <option>Hiring Manager</option>
              <option>Organization Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label>Monthly Hiring Volume</label>

            <select
              name="hiringVolume"
              value={form.hiringVolume}
              onChange={handleChange}
              required
            >
              <option value="">Select Volume</option>
              <option>0 - 10 Candidates</option>
              <option>11 - 50 Candidates</option>
              <option>51 - 200 Candidates</option>
              <option>200+ Candidates</option>
            </select>
          </div>

          <div className="form-group">
            <label>Registered Organization?</label>

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="organization"
                  value="yes"
                  checked={form.organization === "yes"}
                  onChange={handleChange}
                />
                Yes
              </label>

              <label>
                <input
                  type="radio"
                  name="organization"
                  value="no"
                  checked={form.organization === "no"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Organization Email</label>

            <input
              type="email"
              name="email"
              placeholder="hr@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="button"
            className="otp-btn"
            onClick={handleSendOtp}
          >
            Send Verification Code
          </button>

          {otpSent && (
            <>
              <div className="form-group">
                <label>Verification Code</label>

                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="submit-btn">
                Verify & Continue
              </button>
            </>
          )}
        </form>

        <div className="benefits">
          <h3>Admin Access Includes</h3>

          <ul>
            <li>✓ Candidate Management</li>
            <li>✓ Interview Scheduling</li>
            <li>✓ Analytics Dashboard</li>
            <li>✓ Question Bank Access</li>
            <li>✓ Team Management</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default AdminRequest;
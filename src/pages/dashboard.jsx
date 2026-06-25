import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { clearTokens } from "../utils/api";
import "./dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    total_interviews: 0,
    average_score: 0,
    best_score: 0,
    total_questions: 0,
  });

  const [profile, setProfile]        = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [resume, setResume]           = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab]     = useState("overview");

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get("/dashboard"), api.get("/profile")])//both api can run ||
      .then(([dashRes, profileRes]) => {
        setStats(dashRes.data);
        setProfile(profileRes.data);
      })
      .catch((err) => console.error("Dashboard load error:", err))
      .finally(() => setLoadingData(false));
  }, []);

  const handleLogout = async () => {
    try { await api.post("/logout"); } catch (_) {}
    clearTokens();
    navigate("/login");
  };

  const uploadResume = async () => {
    if (!resume) { alert("Please select a resume first"); return; }
    const formData = new FormData();//used to send file to backend
    formData.append("file", resume);
    try {
      const res = await api.post("/upload-resume", formData);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Resume Upload Failed");
    }
  };

  if (loadingData) {
    return (
      <div className="db-loading">
        <div className="db-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { icon: "🎯", label: "Total Interviews", value: stats.total_interviews, color: "blue" },
    { icon: "📊", label: "Average Score",    value: stats.average_score,    color: "purple" },
    { icon: "🏆", label: "Best Score",       value: stats.best_score,       color: "cyan" },
    { icon: "❓", label: "Total Questions",  value: stats.total_questions,  color: "green" },
  ];

  return (
    <div className="db-root">

      {/* ── SIDEBAR ── */}
      <aside className="db-sidebar">
        <div className="db-sidebar-logo">
          <div className="db-logo-mark">AI</div>
          <span className="db-logo-name">InterviewAI</span>
        </div>

        <nav className="db-sidebar-nav">
          {[
            { id: "overview",  icon: "🏠", label: "Overview"  },
            { id: "history",   icon: "📋", label: "History"   },
            { id: "progress",  icon: "📈", label: "Progress"  },
          ].map((item) => (
            <button
              key={item.id}
              className={`db-nav-item ${activeTab === item.id ? "db-nav-item--active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="db-nav-icon">{item.icon}</span>
              {item.label}
            </button>
            
          ))}
           <button
    className="db-nav-item"
    onClick={() => navigate("/admin_portal")}
  >
     <span className="db-nav-icon">🛡️</span>
  Admin Panel
  </button>
        </nav>

        <div className="db-sidebar-bottom">
          <button className="db-nav-item" onClick={() => setShowProfile(true)}>
            <span className="db-nav-icon">👤</span>
            Profile
          </button>
          <button className="db-nav-item db-nav-logout" onClick={handleLogout}>
            <span className="db-nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="db-main">

        {/* Top bar */}
        <header className="db-topbar">
          <div>
            <h1 className="db-welcome">Hey {profile.name || "there"} 👋</h1>
            <p className="db-welcome-sub">Ready to practice today?</p>
          </div>
          <button className="db-start-btn" onClick={() => setShowOptions(true)}>
            + Start Interview
          </button>
        </header>

        {/* Stat cards */}
        <div className="db-stats-grid">
          {statCards.map((card) => (
            <div className={`db-stat-card db-stat-card--${card.color}`} key={card.label}>
              <div className="db-stat-icon">{card.icon}</div>
              <div className="db-stat-info">
                <p className="db-stat-label">{card.label}</p>
                <p className="db-stat-value">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <section className="db-section">
          <h2 className="db-section-title">Quick Actions</h2>
          <div className="db-quick-actions">
            <button className="db-action-card" onClick={() => navigate("/virtual-interview")}>
              <span className="db-action-icon">🎤</span>
              <span className="db-action-label">Virtual Interview</span>
              <span className="db-action-arrow">→</span>
            </button>
            <button className="db-action-card" onClick={() => navigate("/practice")}>
              <span className="db-action-icon">💻</span>
              <span className="db-action-label">Practice</span>
              <span className="db-action-arrow">→</span>
            </button>
            <button className="db-action-card" onClick={() => setShowProfile(true)}>
              <span className="db-action-icon">📄</span>
              <span className="db-action-label">Upload Resume</span>
              <span className="db-action-arrow">→</span>
            </button>
          </div>
        </section>

        {/* Summary table */}
        <section className="db-section">
          <h2 className="db-section-title">Performance Summary</h2>
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Interviews</td>
                  <td>{stats.total_interviews}</td>
                  <td><span className="db-badge db-badge--blue">{stats.total_interviews > 0 ? "Active" : "Get started"}</span></td>
                </tr>
                <tr>
                  <td>Average Score</td>
                  <td>{stats.average_score}</td>
                  <td><span className={`db-badge ${stats.average_score >= 70 ? "db-badge--green" : "db-badge--yellow"}`}>{stats.average_score >= 70 ? "Good" : "Needs work"}</span></td>
                </tr>
                <tr>
                  <td>Best Score</td>
                  <td>{stats.best_score}</td>
                  <td><span className="db-badge db-badge--purple">Personal Best</span></td>
                </tr>
                <tr>
                  <td>Total Questions</td>
                  <td>{stats.total_questions}</td>
                  <td><span className="db-badge db-badge--cyan">Answered</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* ── INTERVIEW TYPE MODAL ── */}
      {showOptions && (
        <div className="db-modal-overlay" onClick={() => setShowOptions(false)}>
          <div className="db-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="db-modal-title">Choose Practice Mode</h2>
            <p className="db-modal-sub">What do you want to work on today?</p>

            <button className="db-modal-option" onClick={() => navigate("/virtual-interview")}>
              <span className="db-modal-option-icon">🎤</span>
              <div>
                <p className="db-modal-option-title">Virtual Interview</p>
                <p className="db-modal-option-desc">HR, Technical or Behavioral — AI asks, you answer</p>
              </div>
            </button>

            <button className="db-modal-option" onClick={() => navigate("/practice")}>
              <span className="db-modal-option-icon">💻</span>
              <div>
                <p className="db-modal-option-title">Coding Practice</p>
                <p className="db-modal-option-desc">DSA problems with AI hints — coming soon</p>
              </div>
            </button>

            <button className="db-modal-close" onClick={() => setShowOptions(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── PROFILE MODAL ── */}
      {showProfile && (
        <div className="db-modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="db-modal db-modal--wide" onClick={(e) => e.stopPropagation()}>
            <h2 className="db-modal-title">👤 Your Profile</h2>

            <div className="db-profile-grid">
              {[
                ["Name", profile.name],
                ["Email", profile.email],
                ["College",profile.college],
                ["Branch", profile.branch],
                ["Graduation Year",profile.graduation_year],
                ["Primary Skill", profile.primary_skill],
                ["Target Company",profile.target_company],
                ["Target Role",   profile.target_role],
              ].map(([label, value]) => (
                <div className="db-profile-field" key={label}>
                  <span className="db-profile-label">{label}</span>
                  <span className="db-profile-value">{value || "Not added yet"}</span>
                </div>
              ))}
            </div>

            <div className="db-resume-section">
              <h3 className="db-resume-title">📎 Resume</h3>
              <div className="db-resume-row">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="db-file-input"
                  onChange={(e) => setResume(e.target.files[0])}
                />
                <button className="db-upload-btn" onClick={uploadResume}>
                  Upload
                </button>
              </div>
            </div>

            <div className="db-profile-actions">
              <button className="db-btn-outline" onClick={() => alert("Edit Profile Coming Soon")}>
                ✏️ Edit Profile
              </button>
              <button className="db-btn-danger" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
            <button className="db-modal-close" onClick={() => setShowProfile(false)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
export default Dashboard;
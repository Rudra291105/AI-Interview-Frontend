import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./Progress.css";

/* ============================== HELPERS ============================== */

// 353 -> "5m 53s"
function formatDuration(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds)) {
    return "—";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}m ${seconds}s`;
}

// "2026-06-30T09:53:46.722471" -> "30 Jun 2026"
function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Maps a 0-100 score to a semantic tier used for badges + progress bars
function scoreTier(score) {
  if (score === null || score === undefined) return "muted";
  if (score >= 70) return "green";
  if (score >= 40) return "amber";
  return "coral";
}

function clampPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

/* ============================== SMALL UI PIECES ============================== */

function ProgressBar({ value, tier, animate }) {
  const pct = clampPercent(value);
  return (
    <div className="pg-bar-track">
      <div
        className={`pg-bar-fill pg-bar-fill--${tier}`}
        style={{ width: animate ? `${pct}%` : "0%" }}
      />
    </div>
  );
}

function ScoreBadge({ score }) {
  const tier = scoreTier(score);
  const label =
    score === null || score === undefined ? "No data" : `${Math.round(score)}%`;
  return <span className={`pg-badge pg-badge--${tier}`}>{label}</span>;
}

/* ============================== MAIN COMPONENT ============================== */

function Progress() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [companySearch, setCompanySearch] = useState("");
  const [companySort, setCompanySort] = useState("score-desc");
  const [recentSort, setRecentSort] = useState("date-desc");

  // Lets progress bars animate from 0 -> value on first paint instead of
  // snapping straight to their final width.
  const [barsReady, setBarsReady] = useState(false);

  const fetchProgress = () => {
    setLoading(true);
    setError(null);
    api
      .get("/dashboard/progress")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Progress load error:", err);
        setError("We couldn't load your progress data. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      const t = setTimeout(() => setBarsReady(true), 60);
      return () => clearTimeout(t);
    }
    setBarsReady(false);
  }, [loading, data]);

  const companies = data?.companies ?? [];
  const roles = data?.roles ?? [];
  const recentInterviews = data?.recent_interviews ?? [];
  const overall = data?.overall ?? null;

  const filteredSortedCompanies = useMemo(() => {
    let list = companies.filter((c) =>
      (c.company || "").toLowerCase().includes(companySearch.trim().toLowerCase())
    );

    list = [...list].sort((a, b) => {
      switch (companySort) {
        case "score-desc":
          return (b.average_score ?? 0) - (a.average_score ?? 0);
        case "score-asc":
          return (a.average_score ?? 0) - (b.average_score ?? 0);
        case "interviews-desc":
          return (b.interviews ?? 0) - (a.interviews ?? 0);
        case "name-asc":
          return (a.company || "").localeCompare(b.company || "");
        default:
          return 0;
      }
    });

    return list;
  }, [companies, companySearch, companySort]);

  const sortedRecentInterviews = useMemo(() => {
    const list = [...recentInterviews];
    list.sort((a, b) => {
      const dateA = new Date(a.completed_at).getTime() || 0;
      const dateB = new Date(b.completed_at).getTime() || 0;
      return recentSort === "date-asc" ? dateA - dateB : dateB - dateA;
    });
    return list;
  }, [recentInterviews, recentSort]);

  const overallCards = overall
    ? [
        { icon: "🎯", label: "Total Interviews", value: overall.total_interviews, color: "indigo" },
        { icon: "📊", label: "Average Score", value: `${Math.round(overall.average_score)}%`, color: "coral" },
        { icon: "🏆", label: "Best Score", value: `${Math.round(overall.best_score)}%`, color: "cyan" },
        { icon: "❓", label: "Total Questions", value: overall.total_questions, color: "green" },
        { icon: "🏢", label: "Companies Practiced", value: overall.companies_practiced, color: "amber" },
        { icon: "🎭", label: "Roles Practiced", value: overall.roles_practiced, color: "indigo" },
        { icon: "⏱️", label: "Average Duration", value: formatDuration(overall.average_duration), color: "coral" },
      ]
    : [];

  /* ---------------------------------------------------------------- */
  /* LOADING STATE                                                    */
  /* ---------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="pg-root">
        <div className="pg-loading">
          <div className="pg-spinner" />
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* ERROR STATE                                                      */
  /* ---------------------------------------------------------------- */
  if (error) {
    return (
      <div className="pg-root">
        <div className="pg-state-card pg-state-card--error">
          <span className="pg-state-icon">⚠️</span>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="pg-btn-primary" onClick={fetchProgress}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* EMPTY STATE                                                      */
  /* ---------------------------------------------------------------- */
  const hasNoData = !overall || overall.total_interviews === 0;

  if (hasNoData) {
    return (
      <div className="pg-root">
        <header className="pg-header">
          <h1>📈 Progress Dashboard</h1>
          <p>Track your interview preparation and performance.</p>
        </header>

        <div className="pg-state-card pg-state-card--empty">
          <span className="pg-state-icon">🌱</span>
          <h2>No progress yet</h2>
          <p>Complete your first interview to start seeing analytics here.</p>
          <button className="pg-btn-primary" onClick={() => navigate("/dashboard")}>
            + Start an Interview
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* MAIN CONTENT                                                     */
  /* ---------------------------------------------------------------- */
  return (
    <div className="pg-root">
      {/* Header */}
      <header className="pg-header">
        <div>
          <h1>📈 Progress Dashboard</h1>
          <p>Track your interview preparation and performance.</p>
        </div>
        <button className="pg-back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </header>

      {/* Overall stats */}
      <section className="pg-section">
        <h2 className="pg-section-title">Overview</h2>
        <div className="pg-stats-grid">
          {overallCards.map((card) => (
            <div className={`pg-stat-card pg-stat-card--${card.color}`} key={card.label}>
              <div className="pg-stat-icon">{card.icon}</div>
              <div className="pg-stat-info">
                <p className="pg-stat-label">{card.label}</p>
                <p className="pg-stat-value">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company analytics */}
      <section className="pg-section">
        <div className="pg-section-head">
          <h2 className="pg-section-title">Company Analytics</h2>
          <div className="pg-controls">
            <input
              type="text"
              className="pg-search"
              placeholder="Search company..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
            />
            <select
              className="pg-select"
              value={companySort}
              onChange={(e) => setCompanySort(e.target.value)}
            >
              <option value="score-desc">Score: High → Low</option>
              <option value="score-asc">Score: Low → High</option>
              <option value="interviews-desc">Most Interviews</option>
              <option value="name-asc">Name A → Z</option>
            </select>
          </div>
        </div>

        {filteredSortedCompanies.length === 0 ? (
          <p className="pg-empty-inline">No companies match your search.</p>
        ) : (
          <div className="pg-companies-grid">
            {filteredSortedCompanies.map((c) => {
              const tier = scoreTier(c.average_score);
              return (
                <div className="pg-company-card" key={c.company}>
                  <div className="pg-company-card-top">
                    <h3>{c.company}</h3>
                    <ScoreBadge score={c.average_score} />
                  </div>

                  <div className="pg-company-stats">
                    <div>
                      <span className="pg-mini-label">Interviews</span>
                      <span className="pg-mini-value">{c.interviews}</span>
                    </div>
                    <div>
                      <span className="pg-mini-label">Questions</span>
                      <span className="pg-mini-value">{c.questions}</span>
                    </div>
                    <div>
                      <span className="pg-mini-label">Best Score</span>
                      <span className="pg-mini-value">{Math.round(c.best_score)}%</span>
                    </div>
                    <div>
                      <span className="pg-mini-label">Last Interview</span>
                      <span className="pg-mini-value">{formatDate(c.last_interview)}</span>
                    </div>
                  </div>

                  <ProgressBar value={c.average_score} tier={tier} animate={barsReady} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Role analytics */}
      <section className="pg-section">
        <h2 className="pg-section-title">Role Analytics</h2>
        {roles.length === 0 ? (
          <p className="pg-empty-inline">No role data yet.</p>
        ) : (
          <div className="pg-roles-grid">
            {roles.map((r) => {
              const tier = scoreTier(r.average_score);
              return (
                <div className="pg-role-card" key={r.role}>
                  <div className="pg-role-card-top">
                    <h3>🎭 {r.role}</h3>
                    <ScoreBadge score={r.average_score} />
                  </div>
                  <div className="pg-role-stats">
                    <div>
                      <span className="pg-mini-label">Interviews</span>
                      <span className="pg-mini-value">{r.interviews}</span>
                    </div>
                    <div>
                      <span className="pg-mini-label">Average Score</span>
                      <span className="pg-mini-value">{Math.round(r.average_score)}%</span>
                    </div>
                  </div>
                  <ProgressBar value={r.average_score} tier={tier} animate={barsReady} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent interviews */}
      <section className="pg-section">
        <div className="pg-section-head">
          <h2 className="pg-section-title">Recent Interviews</h2>
          <select
            className="pg-select"
            value={recentSort}
            onChange={(e) => setRecentSort(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
          </select>
        </div>

        {sortedRecentInterviews.length === 0 ? (
          <p className="pg-empty-inline">No interviews recorded yet.</p>
        ) : (
          <div className="pg-recent-grid">
            {sortedRecentInterviews.map((interview) => (
              <div className="pg-recent-card" key={interview.interview_id}>
                <div className="pg-recent-card-top">
                  <div>
                    <h3>{interview.company || "General"}</h3>
                    <p className="pg-recent-role">{interview.role}</p>
                  </div>
                  <ScoreBadge score={interview.score} />
                </div>

                <div className="pg-recent-stats">
                  <div>
                    <span className="pg-mini-label">Questions</span>
                    <span className="pg-mini-value">{interview.questions}</span>
                  </div>
                  <div>
                    <span className="pg-mini-label">Duration</span>
                    <span className="pg-mini-value">{formatDuration(interview.duration)}</span>
                  </div>
                  <div>
                    <span className="pg-mini-label">Completed</span>
                    <span className="pg-mini-value">{formatDate(interview.completed_at)}</span>
                  </div>
                </div>

                <button
                  className="pg-view-report-btn"
                  onClick={() => navigate(`/report/${interview.interview_id}`)}
                >
                  View Report →
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Progress;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./History.css";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await api.get("/virtual-interview/history");
        setHistory(res.data || []);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const filtered = useMemo(() => {
    return history.filter((item) =>
      `${item.company || ""} ${item.role || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [history, search]);

  const formatDuration = (sec) => {
    if (!sec) return "0 min";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleString();
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="history-loading">Loading interview history...</div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Interview History</h1>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
      </div>

      <input
        className="history-search"
        placeholder="Search by company or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="empty-card">
          <h2>No Interviews Found</h2>
          <p>Complete a virtual interview to see your history.</p>
        </div>
      ) : (
        <div className="history-grid">
          {filtered.map((item) => (
            <div className="history-card" key={item.interview_id}>
              <h2>{item.company || "General Interview"}</h2>
              <p><strong>Role:</strong> {item.role}</p>
              <p><strong>Score:</strong> {item.score}%</p>
              <p><strong>Questions:</strong> {item.questions_count}</p>
              <p><strong>Duration:</strong> {formatDuration(item.duration)}</p>
              <p><strong>Date:</strong> {formatDate(item.completed_at || item.created_at)}</p>
              <p className="feedback">{item.feedback}</p>

              <button
                className="report-btn"
                onClick={() =>
                  navigate(`/history/${item.interview_id}`)
                }
              >
                View Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

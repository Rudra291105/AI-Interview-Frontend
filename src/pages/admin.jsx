import { useEffect, useState } from "react";
import "./admin.css";

const API_BASE = "http://localhost:8000";

function Admin() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInterviews: 0,
    totalQuestions: 0,
    averageScore: 0,
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Add Question States
  const [questionText, setQuestionText] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [difficultyId, setDifficultyId] = useState("");
  const [questionTypeId, setQuestionTypeId] = useState("");

  useEffect(() => {
    setStats({
      totalUsers: 125,
      totalInterviews: 340,
      totalQuestions: 1500,
      averageScore: 78,
    });

    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE}/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question_text: questionText,
          company_id: Number(companyId),
          topic_id: Number(topicId),
          difficulty_id: Number(difficultyId),
          question_type_id: Number(questionTypeId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to add question");
      }

      alert("Question added successfully");

      setQuestionText("");
      setCompanyId("");
      setTopicId("");
      setDifficultyId("");
      setQuestionTypeId("");

      fetchQuestions();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const deleteQuestion = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE}/questions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      alert(data.message);

      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete question");
    }
  };

  const handleCSVUpload = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("access_token");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_BASE}/admin/import-users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Import failed");
      }

      setResult(data);

      alert(
        `Import Completed\nInserted: ${data.inserted}\nFailed: ${data.failed}`
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "Import failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, interviews and platform analytics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <span>{stats.totalUsers}</span>
        </div>

        <div className="stat-card">
          <h3>Total Interviews</h3>
          <span>{stats.totalInterviews}</span>
        </div>

        <div className="stat-card">
          <h3>Total Questions</h3>
          <span>{stats.totalQuestions}</span>
        </div>

        <div className="stat-card">
          <h3>Average Score</h3>
          <span>{stats.averageScore}%</span>
        </div>
      </div>

      <div className="admin-sections">
        <div className="section-card">
          <h2>Bulk User Import</h2>

          <p>Upload a CSV file to create multiple users.</p>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            className="admin-btn"
            onClick={handleCSVUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Import CSV"}
          </button>

          {file && (
            <p className="selected-file">
              Selected: {file.name}
            </p>
          )}

          {result && (
            <div className="result-box">
              <p>
                <strong>Inserted:</strong> {result.inserted}
              </p>

              <p>
                <strong>Failed:</strong> {result.failed}
              </p>
            </div>
          )}
        </div>

        <div className="section-card">
          <h2>User Management</h2>
          <p>Manage platform users.</p>
          <button className="admin-btn">
            Manage Users
          </button>
        </div>

        <div className="section-card">
          <h2>Interview Reports</h2>
          <p>Review interview performance.</p>
          <button className="admin-btn">
            View Reports
          </button>
        </div>

        {/* Add Question Section */}
        <div className="section-card">
          <h2>Add Question</h2>

          <textarea
            className="admin-input"
            placeholder="Question Text"
            rows="4"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />

          <input
            className="admin-input"
            type="number"
            placeholder="Company ID"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          />

          <input
            className="admin-input"
            type="number"
            placeholder="Topic ID"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
          />

          <input
            className="admin-input"
            type="number"
            placeholder="Difficulty ID"
            value={difficultyId}
            onChange={(e) => setDifficultyId(e.target.value)}
          />

          <input
            className="admin-input"
            type="number"
            placeholder="Question Type ID"
            value={questionTypeId}
            onChange={(e) => setQuestionTypeId(e.target.value)}
          />

          <button
            className="admin-btn"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>
        </div>

        <div className="section-card">
          <h2>Question Bank</h2>
          <p>Manage interview questions.</p>

          <table className="question-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Question</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {questions.map((q) => (
                <tr key={q.id}>
                  <td>{q.id}</td>

                  <td>{q.question_text}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteQuestion(q.id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;

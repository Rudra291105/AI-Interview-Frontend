import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./virtualinterview.css";

// ─── Constants ───
const COMPANIES = [
  "", "Google", "Amazon", "Microsoft", "Adobe", "Uber", "Flipkart",
  "Oracle", "Walmart", "PhonePe", "Paytm", "Razorpay", "CRED", "Meesho",
  "Zomato", "Swiggy", "Zoho", "TCS", "Infosys", "Wipro", "HCL",
  "Accenture", "Capgemini", "Cognizant", "Tech Mahindra",
];

const ROLES = [
  "", "Software Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "Data Scientist", "ML Engineer", "DevOps Engineer",
  "Android Developer", "iOS Developer", "Product Manager", "Data Analyst",
];

const MAX_QUESTIONS = 8;

// ─── Helpers ──────────────────────────────────────────────────────
const getDifficultyColor = (difficulty) => {
  if (!difficulty) return "#64748b";
  const d = difficulty.toLowerCase();
  if (d === "easy") return "#22c55e";
  if (d === "medium") return "#f59e0b";
  if (d === "hard") return "#ef4444";
  return "#64748b";
};

const getScoreColor = (score) => {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
};

const ScoreCircle = ({ score, size = 80 }) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width={size} height={size} className="vi-score-circle">
      <circle cx={size / 2} cy={size / 2} r={radius} className="vi-score-circle-bg" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        className="vi-score-circle-fill"
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        stroke={getScoreColor(score)}
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy=".35em" className="vi-score-text">
        {score}
      </text>
    </svg>
  );
};

// ─── Main Component ───────────────────────────────────────────────
function VirtualInterview() {
  const navigate = useNavigate();

  // ── Phase: "setup" | "interview" | "report" ──
  const [phase, setPhase] = useState("setup");

  // Setup form
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  // Interview state
  const [interviewId, setInterviewId] = useState(null);
  const [messages, setMessages] = useState([]);      // chat messages
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionMeta, setQuestionMeta] = useState({ type: "", difficulty: "", isFollowup: false });
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [answer, setAnswer] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);     // start interview
  const [submitting, setSubmitting] = useState(false); // submitting answer
  const [ending, setEnding] = useState(false);        // ending interview

  // Report
  const [report, setReport] = useState(null);

  // Auto-scroll ref
  const chatEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentQuestion, scrollToBottom]);

  // ── Start Interview ──────────────────────────────────────────────
  const handleStart = async () => {
    if (!role) { alert("Please select the role you are interviewing for."); return; }
    setLoading(true);
    try {
      const res = await api.post("/virtual-interview/start", {
        company: company || null,
        role,
      });
      const data = res.data;

      setInterviewId(data.interview_id);

      // Add AI greeting as a chat message
      setMessages([
        {
          id: "greeting",
          role: "ai",
          content: data.greeting,
          type: "greeting",
        },
      ]);

      setCurrentQuestion(data.question);
      setQuestionMeta({
        type: data.question_type,
        difficulty: data.difficulty,
        isFollowup: data.is_followup,
      });
      setQuestionsAsked(0);
      setPhase("interview");
    } catch (err) {
      console.error(err);
      alert("Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Submit Answer ────────────────────────────────────────────────
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) { alert("Please type your answer before submitting."); return; }
    if (!interviewId) return;

    setSubmitting(true);

    // Immediately add user message to chat
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: answer,
    };

    // Add "AI thinking" placeholder
    const thinkingId = `thinking-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: `ai-q-${Date.now()}`,
        role: "ai",
        content: currentQuestion,
        type: "question",
        meta: questionMeta,
      },
      userMsg,
      { id: thinkingId, role: "ai", content: "...", type: "thinking" },
    ]);
    setCurrentQuestion(null);
    setAnswer("");

    try {
      const res = await api.post("/virtual-interview/submit-answer", {
        interview_id: interviewId,
        answer: userMsg.content,
      });
      const data = res.data;

      const newQCount = data.questions_asked;
      setQuestionsAsked(newQCount);

      // Replace thinking bubble with feedback
      const feedbackMsg = {
        id: `feedback-${Date.now()}`,
        role: "ai",
        content: data.feedback,
        type: "feedback",
        score: data.score,
        strengths: data.strengths,
        improvements: data.improvements,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === thinkingId ? feedbackMsg : m))
      );

      if (data.interview_complete || !data.next_question) {
        // All questions done – trigger end
        setTimeout(() => handleEndInterview(interviewId), 800);
      } else {
        setCurrentQuestion(data.next_question);
        setQuestionMeta({
          type: data.question_type,
          difficulty: data.difficulty,
          isFollowup: data.is_followup,
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? { ...m, content: "⚠️ Evaluation failed. Please try submitting again.", type: "error" }
            : m
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── End Interview ────────────────────────────────────────────────
  const handleEndInterview = async (id) => {
    const iid = id || interviewId;
    if (!iid) return;
    setEnding(true);

    // Add a "generating report" message
    setMessages((prev) => [
      ...prev,
      {
        id: "report-generating",
        role: "ai",
        content: "Great job completing the interview! Generating your detailed evaluation report...",
        type: "system",
      },
    ]);

    try {
      const res = await api.post("/virtual-interview/end", { interview_id: iid });
      setReport(res.data);
      setPhase("report");
    } catch (err) {
      console.error(err);
      alert("Failed to generate report. Please try again.");
    } finally {
      setEnding(false);
    }
  };

  // ── Keyboard: Ctrl+Enter to submit ──────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (!submitting) handleSubmitAnswer();
    }
  };

  // ════════════════════════════════════════════════
  // PHASE: SETUP
  // ════════════════════════════════════════════════
  if (phase === "setup") {
    return (
      <div className="vi2-page">
        <div className="vi2-setup-card">
          {/* Header */}
          <div className="vi2-setup-header">
            <div className="vi2-setup-icon">🤖</div>
            <h1>AI Virtual Interview</h1>
            <p>Experience a real technical interview powered by AI. Answer questions naturally — the AI adapts to your responses.</p>
          </div>

          {/* Features */}
          <div className="vi2-features">
            <div className="vi2-feature">
              <span>💬</span>
              <span>Conversational Flow</span>
            </div>
            <div className="vi2-feature">
              <span>🔍</span>
              <span>Smart Follow-ups</span>
            </div>
            <div className="vi2-feature">
              <span>📊</span>
              <span>Detailed Report</span>
            </div>
            <div className="vi2-feature">
              <span>🎯</span>
              <span>Adaptive Difficulty</span>
            </div>
          </div>

          {/* Form */}
          <div className="vi2-form">
            <div className="vi2-field">
              <label>Target Company <span className="vi2-optional">(optional)</span></label>
              <select value={company} onChange={(e) => setCompany(e.target.value)}>
                {COMPANIES.map((c) => (
                  <option key={c} value={c}>{c || "Any / Not specified"}</option>
                ))}
              </select>
            </div>

            <div className="vi2-field">
              <label>Role <span className="vi2-required">*</span></label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r || "Select a role"}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="vi2-setup-actions">
            <button className="vi2-btn vi2-btn-ghost" onClick={() => navigate("/dashboard")}>
              ← Back
            </button>
            <button
              className="vi2-btn vi2-btn-primary"
              onClick={handleStart}
              disabled={loading || !role}
            >
              {loading ? (
                <><span className="vi2-spinner-sm" /> Starting...</>
              ) : (
                <><span>▶</span> Start Interview</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════
  // PHASE: REPORT
  // ════════════════════════════════════════════════
  if (phase === "report" && report) {
    return (
      <div className="vi2-page">
        <div className="vi2-report-page">

          {/* Report Header */}
          <div className="vi2-report-header">
            <div className="vi2-report-title">
              <h1>🎉 Interview Complete!</h1>
              <p>{report.role}{report.company ? ` at ${report.company}` : ""}</p>
            </div>
          </div>

          {/* Score Overview */}
          <div className="vi2-report-scores">
            <div className="vi2-score-main">
              <ScoreCircle score={Math.round(report.overall_score)} size={120} />
              <div>
                <div className="vi2-score-label">Overall Score</div>
                <div className="vi2-score-sublabel">{report.total_questions} questions answered</div>
              </div>
            </div>

            <div className="vi2-score-grid">
              {[
                { label: "Technical Knowledge", value: report.technical_knowledge },
                { label: "Communication", value: report.communication },
                { label: "Confidence", value: report.confidence },
                { label: "Problem Solving", value: report.problem_solving },
              ].map(({ label, value }) => (
                <div className="vi2-score-item" key={label}>
                  <div className="vi2-score-item-header">
                    <span>{label}</span>
                    <span style={{ color: getScoreColor(value), fontWeight: 700 }}>{Math.round(value)}</span>
                  </div>
                  <div className="vi2-score-bar-bg">
                    <div
                      className="vi2-score-bar-fill"
                      style={{ width: `${value}%`, backgroundColor: getScoreColor(value) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="vi2-report-sw">
            <div className="vi2-report-section vi2-section-green">
              <h3>✅ Strengths</h3>
              <ul>
                {report.strengths?.length > 0
                  ? report.strengths.map((s, i) => <li key={i}>{s}</li>)
                  : <li>Keep practising!</li>}
              </ul>
            </div>
            <div className="vi2-report-section vi2-section-red">
              <h3>⚠️ Areas to Improve</h3>
              <ul>
                {report.weaknesses?.length > 0
                  ? report.weaknesses.map((w, i) => <li key={i}>{w}</li>)
                  : <li>No major weaknesses identified.</li>}
              </ul>
            </div>
          </div>

          {/* Suggested Improvements */}
          <div className="vi2-report-full-section">
            <h3>📈 Suggested Improvements</h3>
            <ul className="vi2-list-blue">
              {report.suggested_improvements?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Topics to Study */}
          <div className="vi2-report-full-section">
            <h3>📚 Topics to Study</h3>
            <div className="vi2-topics">
              {report.topics_to_study?.map((topic, i) => (
                <span key={i} className="vi2-topic-tag">{topic}</span>
              ))}
            </div>
          </div>

          {/* Final Feedback */}
          <div className="vi2-report-full-section vi2-final-feedback">
            <h3>💡 Final Feedback</h3>
            <p>{report.final_feedback}</p>
          </div>

          {/* Actions */}
          <div className="vi2-report-actions">
            <button
              className="vi2-btn vi2-btn-ghost"
              onClick={() => { setPhase("setup"); setMessages([]); setReport(null); setInterviewId(null); }}
            >
              🔄 New Interview
            </button>
            <button className="vi2-btn vi2-btn-primary" onClick={() => navigate("/dashboard")}>
              🏠 Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════
  // PHASE: INTERVIEW (Chat UI)
  // ════════════════════════════════════════════════
  const progress = Math.round((questionsAsked / MAX_QUESTIONS) * 100);

  return (
    <div className="vi2-page">
      <div className="vi2-interview-layout">

        {/* ── Top Bar ── */}
        <div className="vi2-topbar">
          <div className="vi2-topbar-left">
            <span className="vi2-logo">🤖 AI Interviewer</span>
            {company && <span className="vi2-topbar-company">{company}</span>}
            <span className="vi2-topbar-role">{role}</span>
          </div>
          <div className="vi2-topbar-right">
            <span className="vi2-q-count">{questionsAsked}/{MAX_QUESTIONS}</span>
            <button
              className="vi2-btn vi2-btn-end"
              onClick={() => handleEndInterview()}
              disabled={ending || submitting || questionsAsked === 0}
            >
              {ending ? "Ending..." : "⏹ End Interview"}
            </button>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="vi2-progress-bar-track">
          <div className="vi2-progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* ── Chat Window ── */}
        <div className="vi2-chat-window">

          {messages.map((msg) => {
            if (msg.role === "user") {
              return (
                <div key={msg.id} className="vi2-msg vi2-msg-user">
                  <div className="vi2-bubble vi2-bubble-user">
                    <p>{msg.content}</p>
                  </div>
                  <div className="vi2-avatar vi2-avatar-user">You</div>
                </div>
              );
            }

            // AI messages
            if (msg.type === "thinking") {
              return (
                <div key={msg.id} className="vi2-msg vi2-msg-ai">
                  <div className="vi2-avatar vi2-avatar-ai">AI</div>
                  <div className="vi2-bubble vi2-bubble-ai vi2-bubble-thinking">
                    <span className="vi2-dot" /><span className="vi2-dot" /><span className="vi2-dot" />
                  </div>
                </div>
              );
            }

            if (msg.type === "question") {
              return (
                <div key={msg.id} className="vi2-msg vi2-msg-ai">
                  <div className="vi2-avatar vi2-avatar-ai">AI</div>
                  <div className="vi2-bubble vi2-bubble-ai vi2-bubble-question">
                    <div className="vi2-q-tags">
                      {msg.meta?.type && (
                        <span className="vi2-tag vi2-tag-type">{msg.meta.type}</span>
                      )}
                      {msg.meta?.difficulty && (
                        <span
                          className="vi2-tag"
                          style={{ backgroundColor: `${getDifficultyColor(msg.meta.difficulty)}22`, color: getDifficultyColor(msg.meta.difficulty) }}
                        >
                          {msg.meta.difficulty}
                        </span>
                      )}
                      {msg.meta?.isFollowup && (
                        <span className="vi2-tag vi2-tag-followup">🔍 Follow-up</span>
                      )}
                    </div>
                    <p>{msg.content}</p>
                  </div>
                </div>
              );
            }

            if (msg.type === "feedback") {
              return (
                <div key={msg.id} className="vi2-msg vi2-msg-ai">
                  <div className="vi2-avatar vi2-avatar-ai">AI</div>
                  <div className="vi2-bubble vi2-bubble-ai vi2-bubble-feedback">
                    <div className="vi2-feedback-score">
                      <span className="vi2-score-badge" style={{ color: getScoreColor((msg.score || 0) * 10) }}>
                        {Math.round((msg.score || 0) * 10)}/100
                      </span>
                    </div>
                    <p>{msg.content}</p>
                    {msg.strengths && (
                      <div className="vi2-fb-row vi2-fb-green">✅ {msg.strengths}</div>
                    )}
                    {msg.improvements && (
                      <div className="vi2-fb-row vi2-fb-orange">💡 {msg.improvements}</div>
                    )}
                  </div>
                </div>
              );
            }

            // greeting / system
            return (
              <div key={msg.id} className="vi2-msg vi2-msg-ai">
                <div className="vi2-avatar vi2-avatar-ai">AI</div>
                <div className={`vi2-bubble vi2-bubble-ai ${msg.type === "system" ? "vi2-bubble-system" : ""}`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            );
          })}

          {/* Current question bubble */}
          {currentQuestion && !submitting && (
            <div className="vi2-msg vi2-msg-ai vi2-msg-current">
              <div className="vi2-avatar vi2-avatar-ai">AI</div>
              <div className="vi2-bubble vi2-bubble-ai vi2-bubble-question vi2-bubble-active">
                <div className="vi2-q-tags">
                  {questionMeta.type && (
                    <span className="vi2-tag vi2-tag-type">{questionMeta.type}</span>
                  )}
                  {questionMeta.difficulty && (
                    <span
                      className="vi2-tag"
                      style={{
                        backgroundColor: `${getDifficultyColor(questionMeta.difficulty)}22`,
                        color: getDifficultyColor(questionMeta.difficulty),
                      }}
                    >
                      {questionMeta.difficulty}
                    </span>
                  )}
                  {questionMeta.isFollowup && (
                    <span className="vi2-tag vi2-tag-followup">🔍 Follow-up</span>
                  )}
                </div>
                <p>{currentQuestion}</p>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* ── Answer Input ── */}
        <div className="vi2-input-area">
          <textarea
            className="vi2-answer-input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here… (Ctrl+Enter to submit)"
            rows={4}
            disabled={submitting || ending || !currentQuestion}
          />
          <div className="vi2-input-footer">
            <span className="vi2-char-hint">{answer.length} characters</span>
            <button
              className="vi2-btn vi2-btn-primary"
              onClick={handleSubmitAnswer}
              disabled={submitting || ending || !currentQuestion || !answer.trim()}
            >
              {submitting ? (
                <><span className="vi2-spinner-sm" /> Evaluating...</>
              ) : (
                <><span>📤</span> Submit Answer</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default VirtualInterview;
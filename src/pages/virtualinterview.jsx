import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./virtualinterview.css";

const QUESTION_TYPES = ["", "Technical", "System Design", "HR", "Behavioral"];
const DIFFICULTIES = ["", "Easy", "Medium", "Hard"];
const COMPANIES = [
  "", "google", "amazon", "microsoft", "adobe", "uber", "flipkart", "oracle",
  "walmart", "phonepe", "paytm", "razorpay", "cred", "meesho", "zomato",
  "swiggy", "zoho", "tcs", "infosys", "wipro", "hcl", "accenture",
  "capgemini", "cognizant", "techmahindra",
];

const TOTAL_QUESTIONS = 5;
const QUESTION_TIME = 120; // 2 minutes

function Interview() {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [company, setCompany] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const [evaluations, setEvaluations] = useState([]);
  const [sessionId] = useState(Date.now());
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [scoreCard, setScoreCard] = useState(null);

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [paused, setPaused] = useState(false);

  // Use a ref for paused so the interval closure always reads the latest value
  const pausedRef = useRef(false);
  const timerRef = useRef(null);

  const getToken = () => localStorage.getItem("access_token");

  // ── Timer: reset & start on each new question ─────────────────────────────
  useEffect(() => {
    if (!started || showScoreCard) return;

    // Reset state for the new question
    setTimeLeft(QUESTION_TIME);
    setPaused(false);
    pausedRef.current = false;

    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, started, showScoreCard]);

  // ── Keep pausedRef in sync with paused state ──────────────────────────────
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const handlePauseResume = () => {
    setPaused((prev) => !prev);
  };

  const handleStopTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(0);
    setPaused(false);
    pausedRef.current = false;
  };

  // ── Interview setup ───────────────────────────────────────────────────────
  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/questions", {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: {
          question_type: questionType || undefined,
          difficulty: difficulty || undefined,
          company: company || undefined,
        },
      });

      const data = response.data;
      if (!data.length) {
        alert("No questions found.");
        return;
      }

      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, Math.min(TOTAL_QUESTIONS, shuffled.length)));
      setCurrentIndex(0);
      setEvaluations([]);
      setAnswer("");
      setStarted(true);
    } catch (error) {
      console.error(error);
      alert("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async (question, userAnswer) => {
    const response = await axios.post(
      "http://localhost:8000/interview-answers/evaluate",
      {
        session_id: sessionId,
        question_id: question.id,
        answer: userAnswer,
      },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data;
  };

  const completeSession = async () => {
    try {
      await axios.post(
        `http://localhost:8000/interview-answers/session/${sessionId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
    } catch (error) {
      console.error("Failed to complete session:", error);
    }
  };

  const generateScoreCard = (allEvaluations) => {
    const scores = allEvaluations.map((e) => Number(e.score || 0));
    const avg = (arr) =>
      Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

    const overallScore = avg(scores.map((s) => s * 10));
    const communication = overallScore;
    const technical = overallScore;
    const confidence = overallScore;

    setScoreCard({
      overallScore,
      communication,
      technical,
      confidence,
      perQuestion: allEvaluations.map((e, i) => ({
        question: questions[i]?.question_text || `Question ${i + 1}`,
        score: Math.round(Number(e.score || 0) * 10),
        feedback: e.feedback || "",
        strengths: e.strengths || "",
        improvements: e.improvements || "",
      })),
      strengths: allEvaluations.map((e) => e.strengths).filter(Boolean),
      improvements: allEvaluations.map((e) => e.improvements).filter(Boolean),
    });

    setShowScoreCard(true);
  };

  const nextQuestion = async () => {
    if (!answer.trim()) {
      alert("Please answer the question before proceeding.");
      return;
    }

    // Stop the timer when submitting
    clearInterval(timerRef.current);

    const currentQuestion = questions[currentIndex];
    setEvaluating(true);

    let evaluation = null;
    try {
      evaluation = await evaluateAnswer(currentQuestion, answer);
    } catch (error) {
      console.error("Evaluation failed:", error);
      evaluation = {
        score: 5,
        feedback: "Evaluation unavailable.",
        strengths: "",
        improvements: "",
      };
    } finally {
      setEvaluating(false);
    }

    const updatedEvaluations = [...evaluations, evaluation];
    setEvaluations(updatedEvaluations);

    if (currentIndex >= questions.length - 1) {
      await completeSession();
      generateScoreCard(updatedEvaluations);
    } else {
      setAnswer("");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // ── Timer display helpers ─────────────────────────────────────────────────
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerLabel = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const timerWarning = timeLeft <= 30 && timeLeft > 0;
  const timerExpired = timeLeft === 0;

  // ── Setup Screen ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="vi-container">
        <h1>AI Virtual Interview</h1>
        <div className="vi-filter-card">
          <h2>Configure Interview</h2>

          <div className="vi-field">
            <label>Question Type</label>
            <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
              {QUESTION_TYPES.map((type) => (
                <option key={type} value={type}>{type || "Any"}</option>
              ))}
            </select>
          </div>

          <div className="vi-field">
            <label>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d || "Any"}</option>
              ))}
            </select>
          </div>

          <div className="vi-field">
            <label>Company</label>
            <select value={company} onChange={(e) => setCompany(e.target.value)}>
              {COMPANIES.map((c) => (
                <option key={c} value={c}>{c || "Any"}</option>
              ))}
            </select>
          </div>

          <div className="vi-actions">
            <button className="vi-btn" onClick={() => navigate("/dashboard")}>
              Cancel
            </button>
            <button
              className="vi-btn vi-btn-primary"
              onClick={startInterview}
              disabled={loading}
            >
              {loading ? "Loading..." : "Start Interview"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Score Card Screen ─────────────────────────────────────────────────────
  if (showScoreCard && scoreCard) {
    return (
      <div className="vi-container">
        <h1>Interview Result</h1>
        <div className="vi-question-card">
          <h2>Overall Score: {scoreCard.overallScore}/100</h2>
          <hr />
          <p>Communication: {scoreCard.communication}/100</p>
          <p>Technical Knowledge: {scoreCard.technical}/100</p>
          <p>Confidence: {scoreCard.confidence}/100</p>

          <h3>Strengths</h3>
          <ul>
            {scoreCard.strengths.length > 0
              ? scoreCard.strengths.map((item, i) => <li key={i}>{item}</li>)
              : <li>No strengths recorded.</li>}
          </ul>

          <h3>Areas To Improve</h3>
          <ul>
            {scoreCard.improvements.length > 0
              ? scoreCard.improvements.map((item, i) => <li key={i}>{item}</li>)
              : <li>No improvements recorded.</li>}
          </ul>

          <h3>Per-Question Breakdown</h3>
          {scoreCard.perQuestion.map((q, i) => (
            <div key={i} className="vi-question-card" style={{ marginTop: "1rem" }}>
              <strong>Q{i + 1}: {q.question}</strong>
              <p>Score: {q.score}/100</p>
              {q.feedback && <p>Feedback: {q.feedback}</p>}
              {q.strengths && <p>✅ {q.strengths}</p>}
              {q.improvements && <p>⚠️ {q.improvements}</p>}
            </div>
          ))}

          <div className="vi-actions" style={{ marginTop: "1.5rem" }}>
            <button
              className="vi-btn vi-btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Return To Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Interview Screen ──────────────────────────────────────────────────────
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="vi-container">
      <h1>AI Virtual Interview</h1>

      <div className="vi-progress">
        Question {currentIndex + 1} of {questions.length}
      </div>

      {/* ── Timer ── */}
      <div
        className={`vi-timer ${timerWarning ? "vi-timer--warning" : ""} ${timerExpired ? "vi-timer--expired" : ""}`}
      >
        <span className="vi-timer__display">
          ⏱ {timerExpired ? "Time's up!" : timerLabel}
          {paused && !timerExpired && <span className="vi-timer__paused-badge"> PAUSED</span>}
        </span>

        <div className="vi-timer__controls">
          {/* Pause / Resume — hidden once timer is stopped */}
          {!timerExpired && (
            <button
              className="vi-btn vi-btn-sm"
              onClick={handlePauseResume}
              disabled={evaluating}
              title={paused ? "Resume timer" : "Pause timer"}
            >
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
          )}

          {/* Stop — hidden once already at 0 */}
          {!timerExpired && (
            <button
              className="vi-btn vi-btn-sm vi-btn-danger"
              onClick={handleStopTimer}
              disabled={evaluating}
              title="Stop timer"
            >
              ⏹ Stop
            </button>
          )}
        </div>
      </div>

      <div className="vi-question-card">
        <h3>Question</h3>
        <p>{currentQuestion.question_text}</p>
      </div>

      <div className="vi-answer-section">
        <label>Your Answer</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={8}
          disabled={evaluating}
        />
      </div>

      <div className="vi-actions">
        <button
          className="vi-btn"
          onClick={() => navigate("/dashboard")}
          disabled={evaluating}
        >
          End Interview
        </button>
        <button
          className="vi-btn vi-btn-primary"
          onClick={nextQuestion}
          disabled={evaluating}
        >
          {evaluating
            ? "Evaluating..."
            : currentIndex === questions.length - 1
            ? "Finish Interview"
            : "Next Question"}
        </button>
      </div>
    </div>
  );
}

export default Interview;
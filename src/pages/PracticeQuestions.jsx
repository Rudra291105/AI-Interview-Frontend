
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import "./PracticeQuestions.css";

function PracticeQuestions() {
const {companyName } = useParams();
const [questions, setQuestions] = useState([]);
const [difficulty, setDifficulty] = useState("");
const [topicId, setTopicId] = useState("");
const [answers, setAnswers] = useState({});
const [evaluations, setEvaluations] = useState({});
const [progress, setProgress] = useState(null);
const [loadingQuestion, setLoadingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
    fetchProgress();
  }, [difficulty]);

  const fetchQuestions = async () => { {/*async is basically tell us that this function can take time */}
    try {
      let url = `/questions?company=${companyName}`;

      if (difficulty) {
        url += `&difficulty=${difficulty}`;
      }

      const response = await api.get(url);{/*await can use only with async because next step execute when only respone is retured from backend */}
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  const fetchProgress = async () => {
  try {
    const companyId = getCompanyId(companyName);

    const response = await api.get(
      `/questions/company/${companyId}/progress`
    );

    setProgress(response.data);
  } catch (error) {
    console.error("Failed to fetch progress:", error);
  }
};
  const fetchQuestionsByTopic = async (selectedTopicId) => {
    try {
      if (!selectedTopicId) {
        fetchQuestions();
        return;
      }

      const response = await api.get(
        `/questions/topic/${selectedTopicId}`
      );

      const filteredQuestions = response.data.filter(
        (q) =>
          q.company_id &&
          q.company_id.toString() ===
            getCompanyId(companyName).toString()
      );

      setQuestions(filteredQuestions);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBookmarked = async () => {
    try {
      const response = await api.get(
        "/questions/bookmarks/all"
      );

      setQuestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompleted = async () => {
    try {
      const response = await api.get(
        "/questions/completed/all"
      );

      setQuestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleBookmark = async (questionId) => {
    try {
      const response = await api.post(
        `/questions/${questionId}/bookmark`
      );

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                is_bookmarked:
                  response.data.is_bookmarked,
              }
            : q
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (questionId) => {
    try {
      const response = await api.post(
        `/questions/${questionId}/complete`
      );

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                is_completed:
                  response.data.is_completed,
              }
            : q
        )
      );
      fetchProgress();
    } catch (error) {
      console.error(error);
    }
  };
  const evaluateAnswer = async (questionId) => {
  try {
    setLoadingQuestion(questionId);

    const response = await api.post(
      "/interview-answers/evaluate",
      {
        session_id: 1,
        question_id: questionId,
        answer: answers[questionId] || "",
      }
    );

    setEvaluations((prev) => ({
      ...prev,
      [questionId]: response.data,
    }));
  } catch (error) {
    console.error(
      "Evaluation Error:",
      error
    );
  } finally {
    setLoadingQuestion(null);
  }
};

  const getCompanyId = (company) => {
    const companies = {
      google: 1,
      amazon: 2,
      microsoft: 3,
      adobe: 4,
      uber: 5,
      flipkart: 6,
      oracle: 7,
      walmart: 8,
      phonepe: 9,
      paytm: 10,
      razorpay: 11,
      cred: 12,
      meesho: 13,
      zomato: 14,
      swiggy: 15,
      zoho: 16,
      tcs: 17,
      infosys: 18,
      wipro: 19,
      hcl: 20,
      accenture: 21,
      capgemini: 22,
      cognizant: 23,
      techmahindra: 24,
    };

    return companies[
      company?.toLowerCase()?.replace(/\s+/g, "")
    ];
  };

  return (
    <div className="questions-page">
<div className="questions-header">

  <div className="header-top">

    <h1>
      {companyName?.toUpperCase()} Interview Questions
    </h1>

    {progress && (
      <div className="company-progress-card">

        <h2>{progress.company} Progress</h2>

        <div className="progress-stats">

          <div>
            <span>Total Questions</span>
            <strong>{progress.total_questions}</strong>
          </div>

          <div>
            <span>Completed</span>
            <strong>{progress.completed_questions}</strong>
          </div>

          <div>
            <span>Remaining</span>
            <strong>{progress.remaining_questions}</strong>
          </div>

        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress.progress}%`,
            }}
          />
        </div>

        <p>{progress.progress}% Completed</p>

      </div>
    )}

  </div>

  <div className="filters-row">

    <select
      value={difficulty}
      onChange={(e) =>
        setDifficulty(e.target.value)
      }
    >
      <option value="">All Difficulty</option>
      <option value="Easy">Easy</option>
      <option value="Medium">Medium</option>
      <option value="Hard">Hard</option>
    </select>

    <select
      value={topicId}
      onChange={(e) => {
        setTopicId(e.target.value);
        fetchQuestionsByTopic(e.target.value);
      }}
    >
      <option value="">All Topics</option>

      <option value="1">OOPS</option>
      <option value="2">DBMS</option>
      <option value="3">Operating System</option>
      <option value="4">DSA</option>
      <option value="5">Arrays</option>
      <option value="6">Strings</option>
      <option value="7">Linked List</option>
      <option value="8">Stack</option>
      <option value="9">Queue</option>
      <option value="10">Tree</option>
      <option value="11">Graph</option>
      <option value="12">Dynamic Programming</option>
      <option value="13">Recursion</option>
      <option value="14">Searching</option>
      <option value="15">Sorting</option>
      <option value="16">Hashing</option>
      <option value="17">Greedy</option>
      <option value="18">Backtracking</option>
      <option value="19">SQL</option>
      <option value="20">Computer Networks</option>
      <option value="21">System Design</option>
      <option value="22">Low Level Design</option>
      <option value="23">Leadership Principles</option>
      <option value="24">Behavioral</option>
      <option value="25">HR</option>
      <option value="26">Communication</option>
      <option value="27">Aptitude</option>
      <option value="28">Java</option>
      <option value="29">Python</option>
      <option value="30">JavaScript</option>
      <option value="31">React</option>
      <option value="32">FastAPI</option>
      <option value="33">PostgreSQL</option>
      <option value="34">Machine Learning</option>
      <option value="35">Cloud Computing</option>
      <option value="36">REST API</option>
      <option value="37">Microservices</option>
    </select>

  </div>

</div>
      <div className="question-filters">
        <button onClick={fetchQuestions}>
          All Questions
        </button>

        <button onClick={fetchBookmarked}>
          🔖 Bookmarked
        </button>

        <button onClick={fetchCompleted}>
          ✅ Completed
        </button>
      </div>

      <div className="questions-container">
        {questions.length === 0 ? (
          <p>No questions found.</p>
        ) : (
          questions.map((q, index) => (
            <div
              className="question-card"
              key={q.id}
            >
              <div className="question-header">
                <h3>
                  Question {index + 1}
                </h3>

                <div className="question-actions">
                  <button
                    className={`icon-btn ${
                      q.is_bookmarked
                        ? "bookmarked"
                        : ""
                    }`}
                    onClick={() =>
                      toggleBookmark(q.id)
                    }
                  >
                    🔖
                  </button>

                  <button
                    className={`icon-btn ${
                      q.is_completed
                        ? "completed"
                        : ""
                    }`}
                    onClick={() =>
                      toggleComplete(q.id)
                    }
                  >
                    ✓
                  </button>
                </div>
              </div>

              <p>{q.question_text}</p>

              <div className="answer-section">
                <textarea
                  className="answer-box"
                  placeholder="Write your answer here..."
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                />
                <button
  className="evaluate-btn"
  onClick={() =>
    evaluateAnswer(q.id)
  }
  disabled={loadingQuestion === q.id}
>
  {loadingQuestion === q.id? "Evaluating...": "Evaluate Answer"} 
</button>
{evaluations[q.id] && (
  <div className="evaluation-card">
    <h4>
      Score:
      {evaluations[q.id].score}/10
    </h4>

    <p>
      <strong>Feedback:</strong>
      {" "}
      {evaluations[q.id].feedback}
    </p>

    <p>
      <strong>Strengths:</strong>
      {" "}
      {evaluations[q.id].strengths}
    </p>

    <p>
      <strong>Improvements:</strong>
      {" "}
      {evaluations[q.id].improvements}
    </p>
  </div>
)}

                <div className="answer-footer">
                  <span>
                    {
                      (answers[q.id] || "")
                        .length
                    }{" "}
                    characters
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PracticeQuestions;

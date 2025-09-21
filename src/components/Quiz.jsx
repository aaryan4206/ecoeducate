import React, { useState } from "react";
import QuizPage from "./QuizPage";
import "./../styles/Quiz.css"; // reuse styles for visual cohesion

const quizzes = [
  { id: 1, topic: "Environment Basics", points: 50, questions: 10, timeLimit: "10 min" },
  { id: 2, topic: "Climate Change", points: 100, questions: 15, timeLimit: "15 min" },
  { id: 3, topic: "Renewable Energy", points: 75, questions: 12, timeLimit: "12 min" },
  { id: 4, topic: "Sustainable Living", points: 60, questions: 8, timeLimit: "8 min" },
];

export default function Quizzes() {
  const [activeQuizId, setActiveQuizId] = useState(null);

  const startQuiz = (id) => {
    const quiz = quizzes.find((q) => q.id === id);
    if (!quiz) return;
    if (window.confirm(`Start the quiz: "${quiz.topic}"?`)) {
      setActiveQuizId(id);
    }
  };

  const endQuiz = () => setActiveQuizId(null);

  if (activeQuizId !== null) {
    return <QuizPage quizId={activeQuizId} onExit={endQuiz} />;
  }

  return (
    <div className="quiz-shell">
      <div className="quiz-card" style={{ padding: "1.2rem 1.2rem 1.4rem" }}>
        <div className="top-row" style={{ marginBottom: ".6rem" }}>
          <h2 className="topic" style={{ margin: 0 }}>Available Quizzes</h2>
          <span className="badge">{quizzes.length} total</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => startQuiz(quiz.id)}
              style={{
                textAlign: "left",
                border: "1px solid #cfe9d6",
                borderRadius: 16,
                padding: "1rem 1.1rem",
                background: "linear-gradient(135deg,#f6fff9,#eef7ff)",
                boxShadow: "0 10px 26px rgba(33,77,56,.10)",
                cursor: "pointer",
                transition: "transform .12s, box-shadow .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 16px 34px rgba(33,77,56,.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 26px rgba(33,77,56,.10)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: ".6rem" }}>
                <h3 style={{ margin: 0, color: "#134b28" }}>
                  Quiz - {quiz.id}: {quiz.topic}
                </h3>
                <span className="badge" style={{ whiteSpace: "nowrap" }}>{quiz.points} pts</span>
              </div>
              <div style={{ display: "flex", gap: ".6rem", marginTop: ".6rem", flexWrap: "wrap" }}>
                <span className="badge">Questions: {quiz.questions}</span>
                <span className="badge">Time: {quiz.timeLimit}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

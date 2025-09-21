import React, { useState } from "react";
import QuizPage from "./QuizPage";

const quizzes = [
  { id: 1, topic: "Environment Basics", points: 50, questions: 10, timeLimit: "10 min" },
  { id: 2, topic: "Climate Change", points: 100, questions: 15, timeLimit: "15 min" },
  { id: 3, topic: "Renewable Energy", points: 75, questions: 12, timeLimit: "12 min" },
  { id: 4, topic: "Sustainable Living", points: 60, questions: 8, timeLimit: "8 min" },
];

export default function Quizzes() {
  const [activeQuizId, setActiveQuizId] = useState(null);

  const startQuiz = (id) => {
    const quiz = quizzes.find(q => q.id === id);
    if(window.confirm(`Do you want to start the quiz on "${quiz.topic}"?`)) {
      setActiveQuizId(id);
    }
  };

  const endQuiz = () => {
    setActiveQuizId(null);
  };

  if(activeQuizId !== null) {
    return <QuizPage quizId={activeQuizId} onExit={endQuiz} />;
  }

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h3>Number of Available Quizzes: {quizzes.length}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            onClick={() => startQuiz(quiz.id)}
            style={{
              border: "1px solid #2e7d32",
              borderRadius: "10px",
              padding: "1.5rem",
              cursor: "pointer",
              backgroundColor: "#e8f5e9",
              boxShadow: "0 4px 8px rgba(46,125,50,0.15)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(46,125,50,0.3)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(46,125,50,0.15)";
            }}
          >
            <h3 style={{ marginTop: 0, color: "#1b5e20" }}>
              Quiz #{quiz.id}: {quiz.topic}
            </h3>
            <p><strong>Points:</strong> {quiz.points}</p>
            <p><strong>Questions:</strong> {quiz.questions}</p>
            <p><strong>Time Limit:</strong> {quiz.timeLimit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

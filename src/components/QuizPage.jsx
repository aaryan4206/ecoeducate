import React, { useEffect, useMemo, useRef, useState } from "react";
import { quizzesData } from "./quizzesData";
import { updateUserEcoPoints } from "./firestoreHelpers";
import { getAuth } from "firebase/auth";
import "./../styles/Quiz.css";

export default function QuizPage({ quizId, onExit }) {
  const quiz = quizzesData[quizId];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const TIME_PER_QUESTION = 15;
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [locked, setLocked] = useState(false); // lock after submit
  const timerRef = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const userName = user?.displayName || user?.email;

  useEffect(() => {
    if (isFinished && userName) updateUserEcoPoints(userName, score);
  }, [isFinished, userName, score]);

  // timer per question
  useEffect(() => {
    setSelected(null);
    setLocked(false);
    setTimeLeft(TIME_PER_QUESTION);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return TIME_PER_QUESTION;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const currentQuestion = quiz.questions[currentIndex];

  const pct = useMemo(
    () => Math.round(((currentIndex) / quiz.questions.length) * 100),
    [currentIndex, quiz.questions.length]
  );

  const select = (opt) => {
    if (locked) return;
    setSelected(opt);
  };

  const handleSubmit = () => {
    if (locked) return;
    clearInterval(timerRef.current);
    // score if correct
    if (selected === currentQuestion.answer) setScore((s) => s + 1);
    setLocked(true);
  };

  const next = () => {
    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsFinished(true);
    }
  };

  // keyboard navigation
  const optIndex = selected ? currentQuestion.options.indexOf(selected) : -1;
  const onKey = (e) => {
    if (isFinished) return;
    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      const opts = currentQuestion.options;
      const nextIndex =
        e.key === "ArrowDown"
          ? Math.min(opts.length - 1, (optIndex + 1 + opts.length) % opts.length)
          : Math.max(0, (optIndex - 1 + opts.length) % opts.length);
      select(opts[nextIndex]);
    } else if (e.key === "Enter") {
      locked ? next() : handleSubmit();
    }
  };

  if (isFinished) {
    const total = quiz.questions.length;
    const pctScore = Math.round((score / total) * 100);
    const kudos =
      pctScore >= 90 ? "Outstanding!" : pctScore >= 70 ? "Great job!" : pctScore >= 50 ? "Nice effort!" : "Keep practicing!";
    return (
      <div className="quiz-shell">
        <div className="result-card">
          <h2 className="kudos">{kudos}</h2>
          <div className="big-score">{score} / {total}</div>
          <p>You earned eco points for completing the quiz.</p>
          <div style={{ display:"flex", gap:".6rem", justifyContent:"center", marginTop:"1rem" }}>
            <button className="cta secondary" onClick={() => { setCurrentIndex(0); setScore(0); setIsFinished(false); }}>Retake</button>
            <button className="cta" onClick={onExit}>Back to Quizzes</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-shell" onKeyDown={onKey} tabIndex={0}>
      <div className="quiz-card">
        <div className="top-row">
          <h2 className="topic">{quiz.topic}</h2>
          <div className="timer-block">
            <div
              className={`timer-ring ${timeLeft <= 5 ? "low" : ""}`}
              style={{ "--pct": (timeLeft / TIME_PER_QUESTION) * 100 }}
            >
              <span>{timeLeft}s</span>
            </div>
          </div>
        </div>

        <div className="meta">
          <span className="badge">Q {currentIndex + 1} / {quiz.questions.length}</span>
          <span className="badge">{quiz.points} pts</span>
          <span className="badge">Limit: {quiz.timeLimit}</span>
        </div>

        <div className="progress"><span style={{ width: `${pct}%` }} /></div>

        <div className="question">Q{currentIndex + 1}. {currentQuestion.question}</div>

        <div className="options">
          {currentQuestion.options.map((opt, i) => {
            const isSel = selected === opt;
            const isCorrect = locked && opt === currentQuestion.answer;
            const isWrong = locked && isSel && opt !== currentQuestion.answer;
            return (
              <button
                key={i}
                type="button"
                className={
                  "opt" +
                  (isSel ? " selected" : "") +
                  (isCorrect ? " correct" : "") +
                  (isWrong ? " incorrect" : "")
                }
                onClick={() => select(opt)}
                disabled={locked}
                aria-pressed={isSel}
              >
                <span className="bullet">{String.fromCharCode(65 + i)}</span>
                <span style={{ flex:1, textAlign:"left" }}>{opt}</span>
                {isCorrect && <span aria-hidden="true">✅</span>}
                {isWrong && <span aria-hidden="true">❌</span>}
              </button>
            );
          })}
        </div>

        <div className="controls">
          <button className="cta secondary" onClick={onExit}>Exit</button>
          {!locked ? (
            <button className="cta" onClick={handleSubmit} disabled={!selected}>Submit</button>
          ) : (
            <button className="cta" onClick={next}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
}

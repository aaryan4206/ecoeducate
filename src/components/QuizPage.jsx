import React, { useState, useEffect, useRef } from "react";
import { quizzesData } from "./quizzesData";
import { updateUserEcoPoints } from "./firestoreHelpers";
import { getAuth } from "firebase/auth";


export default function QuizPage({ quizId, onExit }) {
    const quiz = quizzesData[quizId];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const TIME_PER_QUESTION = 15; // seconds
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    

    const timerRef = useRef(null);

    useEffect(() => {
        // Reset selection and timer on question change
        setSelectedAnswer(null);
        setTimeLeft(TIME_PER_QUESTION);

        // Start countdown timer
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === 1) {
                    clearInterval(timerRef.current);
                    handleNextQuestion();
                    return TIME_PER_QUESTION;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentIndex]);

    const auth = getAuth();
    const user = auth.currentUser;
    // const userEmail = user.email;
    const userName = user.displayName || user.email;
    useEffect(() => {
        if (isFinished && userName) {
            // Only update once after quiz is finished
            updateUserEcoPoints(userName, score);
        }
    }, [isFinished, userName, score]);

    const handleAnswerSelect = (option) => {
        setSelectedAnswer(option);
    };

    const handleNextQuestion = () => {
        // Evaluate score only once per question
        if (selectedAnswer === quiz.questions[currentIndex].answer) {
            setScore(prev => prev + 1);
        }
        if (currentIndex + 1 < quiz.questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        return (
            <div style={{ maxWidth: 600, margin: "auto", padding: "2rem", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                <h2>{quiz.topic} Quiz Completed!</h2>
                <p>Your Score: {score} out of {quiz.questions.length}</p>
                <button onClick={onExit} style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}>
                    Back to Quizzes
                </button>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentIndex];

    return (
        <div style={{ maxWidth: 600, margin: "auto", padding: "2rem", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <h2>{quiz.topic}</h2>
            <p>Points: {quiz.points} | Time Limit: {quiz.timeLimit}</p>
            <p style={{ fontWeight: "bold", color: "#2e7d32" }}>Time Left: {timeLeft} seconds</p>
            <h3>Q{currentIndex + 1}: {currentQuestion.question}</h3>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {currentQuestion.options.map(option => (
                    <li key={option} style={{ margin: "8px 0" }}>
                        <button
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                borderRadius: "5px",
                                border: selectedAnswer === option ? "2px solid #2e7d32" : "1px solid #ccc",
                                backgroundColor: selectedAnswer === option ? "#e8f5e9" : "#fff",
                                cursor: "pointer",
                                fontSize: "1rem",
                            }}
                            onClick={() => handleAnswerSelect(option)}
                        >
                            {option}
                        </button>
                    </li>
                ))}
            </ul>
            <button
                onClick={() => {
                    clearInterval(timerRef.current);
                    handleNextQuestion();
                }}
                disabled={selectedAnswer === null}
                style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: selectedAnswer === null ? "#ccc" : "#2e7d32",
                    color: selectedAnswer === null ? "#666" : "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: selectedAnswer === null ? "not-allowed" : "pointer",
                }}
            >
                Next
            </button>
        </div>

    );
    
}


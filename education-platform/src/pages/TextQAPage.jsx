import React, { useState, useEffect } from "react";
import "../App.css";

export default function TextQAPage() {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load all topics from backend
    useEffect(() => {
        fetch("http://localhost:5000/edu/topics")
            .then((res) => res.json())
            .then((data) => setTopics(data.topics))
            .catch((err) => setError("Failed to load topics"));
    }, []);

    // Load questions for selected topic
    useEffect(() => {
        if (selectedTopic) {
            fetch(`http://localhost:5000/edu/questions/${selectedTopic}`)
.then((res) => res.json())
                    .then((data) => setQuestions(data.questions))
                    .catch((err) => setError("Failed to load questions"));
            setCurrentIdx(0);
            setFeedback(null);
            setUserAnswer("");
        }
    }, [selectedTopic]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userAnswer.trim()) {
            setError("Please enter your answer.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("http://localhost:5000/edu/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic: selectedTopic,
                    question_index: currentIdx,
                    student_answer: userAnswer,
                }),
            });
            if (!res.ok) throw new Error("Failed to get feedback");
            const data = await res.json();
            setFeedback(data);
        } catch (err) {
            setError("Error fetching feedback");
        }
        setLoading(false);
    };

    const handleNext = () => {
        setCurrentIdx((prev) => prev + 1);
        setUserAnswer("");
        setFeedback(null);
        setError("");
    };

    const currentQ = questions[currentIdx];

    return (
        <div className="qa-page">
            <h2 className="qa-title">AI-Generated Feedback (Concept Q&A)</h2>
            {/* Topic Selection */}
            <div className="qa-dropdown">
                <label><strong>Select Topic:</strong></label>
                <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                >
                    <option value="">-- Choose a Topic --</option>
                    {topics.map((topic, idx) => (
                        <option key={idx} value={topic}>
                            {topic}
                        </option>
                    ))}
                </select>
            </div>

            {/* Question Panel */}
            {selectedTopic && currentQ && (
                <div className="qa-question-panel">
                    <strong>Question {currentIdx + 1}:</strong>
                    <div className="qa-question-text">{currentQ}</div>
                </div>
            )}

            {/* Answer Form */}
            {selectedTopic && currentQ && (
                <form className="qa-form" onSubmit={handleSubmit}>
                    <textarea
                        className="qa-input"
                        rows={4}
                        placeholder="Type your answer here..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                    />
                    <button className="submit-btn" type="submit" disabled={loading}>
                        {loading ? "Checking..." : "Check Answer"}
                    </button>
                </form>
            )}

            {/* Feedback */}
            {feedback && (
                <div className="qa-answer-panel">
                    <h3>AI Feedback</h3>
                    <p><strong>Match:</strong> {feedback.feedback.match}</p>
                    <p><strong>Score:</strong> {feedback.feedback.similarity_score}</p>
                    <p><strong>Misconception Check:</strong> {feedback.misconception}</p>
                    <p><strong>Practice Question:</strong> {feedback.practice_question}</p>
                    {currentIdx < questions.length - 1 && (
                        <button
                            className="submit-btn"
                            onClick={handleNext}
                            style={{ marginTop: "1rem" }}
                        >
                            Next Question
                        </button>
                    )}
                </div>
            )}

            {error && <div className="error">{error}</div>}
        </div>
    );
}
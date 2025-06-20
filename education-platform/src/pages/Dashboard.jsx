import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/questions")
      .then(res => res.json())
      .then(setQuestions);
  }, []);

  if (!questions.length) return <div className="loader">Loading...</div>;

  return (
    <div className="dashboard">
      <h2>Available Questions</h2>
      <div className="question-list">
        {questions.map(q => (
          <div className="question-card" key={q.id}>
            <div className="question-title">{q.title}</div>
            <Link className="solve-btn" to={`/question/${q.id}`}>Solve</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

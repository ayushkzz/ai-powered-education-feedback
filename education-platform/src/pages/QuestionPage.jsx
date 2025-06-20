import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import FeedbackPanel from "../components/FeedbackPanel";

export default function QuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the question details
  useEffect(() => {
    setError(null);
    setQuestion(null);
    fetch(`http://localhost:5000/question/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load question");
        return res.json();
      })
      .then(setQuestion)
      .catch(err => setError(err.message));
  }, [id]);

  // Handle code submission
  const handleSubmit = async () => {
    setError(null);
    setResult(null);

    if (!code.trim()) {
      setError("Please write some code before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, question_id: id }),
      });
      if (!res.ok) throw new Error("Submission failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (error) return <div className="error">{error}</div>;
  if (!question) return <div className="loader">Loading...</div>;

  return (
    <div className="code-container">
      <div className="container-left left-panel">
        <div className="question-row">
          <div className="question-card">
            <div className="question-title">{question.title}</div>
            <div className="description">{question.description}</div>
          </div>
        </div>
        {result && (
          <>
            {result.syntax_error &&
              <div className="error" style={{ marginTop: "1rem" }}>
                <b>Syntax Error:</b> {result.syntax_error}
              </div>
            }
            <FeedbackPanel feedback={result.feedback} />
          </>
        )}
      </div>
      <div className="container-right right-panel">
        <div className="code-editor">
          <Editor
            language="python"
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={value => setCode(value || "# Write your code here...")}
            theme="vs-dark"
            options={{ fontSize: 20, minimap: { enabled: false } }}
          />
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Solve"}
          </button>
        </div>
      </div>
    </div>
  );
}

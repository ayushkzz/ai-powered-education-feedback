import React from "react";

export default function FeedbackPanel({ feedback }) {
  if (!feedback) return null;
  return (
    <div className="feedback-panel">
      <h3>AI Feedback:</h3>
      <p>{feedback}</p>
    </div>
  );
}

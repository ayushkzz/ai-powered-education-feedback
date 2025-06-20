import React from "react";

export default function TestResults({ results }) {
  if (!results) return null;
  return (
    <div className="test-results">
      <h3>Test Results:</h3>
      <ul>
        {results.map((res, idx) => (
          <li key={idx} className={res.passed ? "passed" : "failed"}>
            <b>{res.passed ? "Passed" : "Failed"}</b> — Input: <code>{res.input}</code> | Expected: <code>{res.expected}</code> | Got: <code>{res.actual}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}

import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import QuestionPage from "./pages/QuestionPage";
import TextQAPage from "./pages/TextQAPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="header">
        <h1 className="main-title">Python Code Analyzer & AI Q&A</h1>
      </div>
      <div className="container">
        <nav className="main-nav">
          <Link to="/" className="nav-link">Coding Practice</Link>
          <Link to="/qa" className="nav-link">Text Q&A (AI)</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/question/:id" element={<QuestionPage />} />
          <Route path="/qa" element={<TextQAPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

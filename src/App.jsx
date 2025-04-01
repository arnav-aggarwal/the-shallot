// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import { SlantProvider } from "./context/SlantContext";

export default function App() {
  return (
    <SlantProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
        </Routes>
      </Router>
    </SlantProvider>
  );
}

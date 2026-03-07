import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Hệ Thống Thương Mại Điện Tử Trang Sức</h1>
        <p>Jewelry E-Commerce System</p>
        <Routes>
          <Route path="/" element={<div>Home Page - Đang phát triển...</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

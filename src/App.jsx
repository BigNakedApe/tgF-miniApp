import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateDeal from './components/CreateDeal';
import DealHistory from './components/DealHistory';
import Profile from './components/Profile';
import './index.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<CreateDeal />} />
          <Route path="/history" element={<DealHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
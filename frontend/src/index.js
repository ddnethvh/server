import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import MainView from './view/MainView';
import LeaderboardView from './view/LeaderboardView';
import CheatsView from './view/CheatsView';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/leaderboard/:mode" element={<LeaderboardView />} />
        <Route path="/cheats" element={<CheatsView />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
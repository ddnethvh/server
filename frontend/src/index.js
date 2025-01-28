import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import MainView from './view/MainView';
import LeaderboardView from './view/LeaderboardView';
import CheatsView from './view/CheatsView';
import DeveloperView from './view/developer/DeveloperView';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/leaderboard/:mode" element={<LeaderboardView />} />
        <Route path="/cheats" element={<CheatsView />} />
        <Route path="/developer" element={<DeveloperView />} />
        <Route path="/developer/:categoryId/:pageId" element={<DeveloperView />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
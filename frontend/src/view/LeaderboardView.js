import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BiTrophy } from 'react-icons/bi';
import NavBar from '../components/NavBar/NavBar';
import GameMode from '../components/GameMode/GameMode';
import './LeaderboardView.css';

const LeaderboardView = () => {
  const { mode } = useParams();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leaderboard/${mode}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }

        const data = await response.json();
        setLeaderboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [mode]);

  const renderEmptyState = () => (
    <div className="leaderboard-empty">
      <div className="empty-icon">
        <BiTrophy />
      </div>
      <h3>No Rankings Available</h3>
      <p>There are currently no players ranked in <GameMode mode={mode.toUpperCase()} /> mode.</p>
      <p className="empty-subtitle">Be the first to appear on the leaderboard!</p>
    </div>
  );

  // Split data into three parts
  const chunk = Math.ceil(leaderboardData.length / 3);
  const firstColumn = leaderboardData.slice(0, chunk);
  const secondColumn = leaderboardData.slice(chunk, chunk * 2);
  const thirdColumn = leaderboardData.slice(chunk * 2);

  const renderTable = (players, startIndex = 0) => {
    if (players.length === 0) return null;

    return (
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>{mode === 'kog' ? 'Points' : 'Rating'}</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr 
              key={player.rank}
              className={player.rank <= 3 ? `rank-${player.rank}` : undefined}
            >
              <td>#{player.rank}</td>
              <td>{player.name}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderContent = () => {
    if (leaderboardData.length === 0) {
      return renderEmptyState();
    }

    return (
      <>
        {firstColumn.length > 0 && (
          <div className="leaderboard-section">
            <h2>Ranks 1-{firstColumn.length}</h2>
            {renderTable(firstColumn)}
          </div>
        )}

        {secondColumn.length > 0 && (
          <div className="leaderboard-section">
            <h2>Ranks {firstColumn.length + 1}-{firstColumn.length + secondColumn.length}</h2>
            {renderTable(secondColumn)}
          </div>
        )}

        {thirdColumn.length > 0 && (
          <div className="leaderboard-section">
            <h2>Ranks {firstColumn.length + secondColumn.length + 1}-{leaderboardData.length}</h2>
            {renderTable(thirdColumn)}
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <NavBar />
        <div className="leaderboard-content">
          <div className="loading">Loading leaderboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <NavBar />
        <div className="leaderboard-content">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <NavBar />
      <div className="leaderboard-content">
        <h1>
          <GameMode mode={mode} /> Leaderboard
        </h1>
        <div className="cyber-line"></div>
        {renderContent()}
      </div>
    </div>
  );
};

export default LeaderboardView; 
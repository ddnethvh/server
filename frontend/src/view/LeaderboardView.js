import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { BiTrophy, BiSearch } from 'react-icons/bi';
import NavBar from '../components/NavBar/NavBar';
import GameMode from '../components/GameMode/GameMode';
import './LeaderboardView.css';

const LeaderboardView = () => {
  const { mode } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedMap = searchParams.get('map');

  // Fetch available maps for KoG mode
  useEffect(() => {
    const fetchMaps = async () => {
      if (mode !== 'kog') return;
      
      try {
        const response = await fetch('/api/leaderboard/kog/maps');
        if (!response.ok) throw new Error('Failed to fetch maps');
        const data = await response.json();
        setMaps(data);
      } catch (err) {
        console.error('Error fetching maps:', err);
        setError('Failed to load maps');
      }
    };

    fetchMaps();
  }, [mode]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const url = mode === 'kog' && selectedMap 
          ? `/api/leaderboard/${mode}?map=${selectedMap}`
          : `/api/leaderboard/${mode}`;
        
        const response = await fetch(url);
        
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
  }, [mode, selectedMap]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleMapChange = (event) => {
    const map = event.target.value;
    if (map) {
      setSearchParams({ map });
    } else {
      setSearchParams({});
    }
  };

  // Filter players based on search
  const filterPlayers = (players) => {
    if (!searchQuery) return players;
    return players.filter(player => 
      player.name.toLowerCase().includes(searchQuery)
    );
  };

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

    const filteredPlayers = filterPlayers(players);

    return (
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            {selectedMap ? (
              <th>Time</th>
            ) : (
              <th>{mode === 'kog' ? 'Points' : 'Rating'}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((player) => (
            <tr 
              key={player.rank}
              className={`
                ${player.rank <= 3 ? `rank-${player.rank}` : ''}
                ${player.name.toLowerCase().includes(searchQuery) ? 'highlighted' : ''}
              `.trim()}
            >
              <td>#{player.rank}</td>
              <td>{player.name}</td>
              <td>
                {selectedMap ? player.formattedTime : player.score}
              </td>
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
        
        <div className="leaderboard-controls">
          <div className="search-container">
            <BiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          {mode === 'kog' && (
            <div className="map-selector">
              <select 
                value={selectedMap || ''} 
                onChange={handleMapChange}
                className="map-select"
              >
                <option value="">All Maps (Total Points)</option>
                {maps.map(map => (
                  <option key={map} value={map}>{map}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="cyber-line"></div>
        {renderContent()}
      </div>
    </div>
  );
};

export default LeaderboardView; 
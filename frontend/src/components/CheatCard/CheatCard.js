import React from 'react';
import './CheatCard.css';

const CheatCard = ({ name, versions, description, downloadUrl, isPremium }) => {
  return (
    <div className="cheat-card">
      <div className="cheat-name">{name}</div>
      <div className="cheat-versions">
        {versions.map((version, index) => (
          <div key={index} className={`cheat-version ${version.toLowerCase()}`}>
            {version}
          </div>
        ))}
      </div>
      <p className="cheat-description">{description}</p>
      <a 
        href={downloadUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`download-btn ${isPremium ? 'premium-btn' : ''}`}
      >
        <i className="fas fa-download"></i> Download
      </a>
    </div>
  );
};

export default CheatCard; 
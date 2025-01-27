import React from 'react';
import { BiDownload, BiBook } from 'react-icons/bi';
import './CheatCard.css';

const CheatCard = ({ 
  name, 
  versions, 
  description, 
  downloadUrl, 
  docsUrl, 
  isPremium, 
  developers = [] 
}) => {
  return (
    <div className="cheat-card">
      {docsUrl && (
        <a 
          href={docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="docs-link"
          title="Documentation"
        >
          <BiBook />
        </a>
      )}
      <div className="cheat-name">{name}</div>
      <div className="cheat-versions">
        {versions.map((version, index) => (
          <div key={index} className={`cheat-version ${version.toLowerCase()}`}>
            {version}
          </div>
        ))}
      </div>
      <p className="cheat-description">{description}</p>
      {developers.length > 0 && (
        <div className="cheat-developers">
          <div className="developers-label">Developers</div>
          <div className="developers-list">
            {developers.map((dev, index) => (
              <span key={index} className="developer">{dev}</span>
            ))}
          </div>
        </div>
      )}
      <a 
        href={downloadUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`download-btn ${isPremium ? 'premium-btn' : ''}`}
      >
        <BiDownload /> Download
      </a>
    </div>
  );
};

export default CheatCard; 
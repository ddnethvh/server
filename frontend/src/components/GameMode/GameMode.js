import React from 'react';
import './GameMode.css';

const GameMode = ({ mode }) => {
  return (
    <span className={`game-mode ${mode.toLowerCase()}`}>
      {mode}
    </span>
  );
};

export default GameMode; 
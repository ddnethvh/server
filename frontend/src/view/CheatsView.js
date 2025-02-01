import React, { useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import CheatCard from '../components/CheatCard/CheatCard';
import { BiSearch, BiChevronDown } from 'react-icons/bi';
import './CheatsView.css';

const CheatsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDevelopers, setShowDevelopers] = useState(true);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const toggleDevelopers = () => {
    setShowDevelopers(!showDevelopers);
  };

  const cheats = [
    {
      name: "DD.CFF",
      versions: ['Free'],
      description: "The best free cheat available. Known for its stability and frequent updates. Community favorite.",
      downloadUrl: "https://discord.com/invite/4nUaaaaWt5/",
      docsUrl: "https://docs.google.com/document/d/15aQTHKPOn_tYxsfsZ6ogOvB1ThFVDY1nWThgxy4c968/edit?usp=sharing",
      developers: ['scar17off', 'directleaks-tsk']
    },
    {
      name: "KRX Client",
      versions: ['Free', 'Premium', 'Ultimate'],
      description: "The most sophisticated DDNet cheat featuring FentBot™, advanced prediction systems, and input sequence generators. Includes TAS capabilities, perfect for both casual and competitive play. Ultimate tier provides access to exclusive features.",
      downloadUrl: "https://krxclient.xyz/",
      docsUrl: "https://github.com/krxclient/krx-docs/",
      isPremium: true,
      developers: ['krixx1337', 'fluffysnaff']
    },
    {
      name: "Ae86",
      versions: ['Lua', 'Client'],
      description: "Lua version is a modified Sash client with russian translation and a few extra features. Client version is still in development.",
      downloadUrl: "https://ae86client.glitch.me/",
      developers: ['real_ueh']
    },
    {
      name: "Sash",
      versions: ['Free'],
      description: "A reliable free alternative with essential features. Perfect for block mode and casual play.",
      downloadUrl: "https://sash.mybin.ir/",
      developers: ['г-н.вирус']
    },
    {
      name: "Tater+ Client",
      versions: ['Free', 'Premium'],
      description: "A basic cheat with a premium tier. While not as polished as other options, it provides some fundamental features for casual play.",
      downloadUrl: "https://discord.com/invite/DceN7MuHGu/",
      developers: ['Kiocode']
    }
  ];

  const filteredCheats = cheats.filter(cheat => 
    cheat.name.toLowerCase().includes(searchQuery) ||
    cheat.description.toLowerCase().includes(searchQuery) ||
    cheat.developers.some(dev => dev.toLowerCase().includes(searchQuery))
  );

  return (
    <div className="cheats-container">
      <NavBar />
      <div className="cheats-content">
        <h1>Available Cheats</h1>
        <div className="cyber-line"></div>
        
        <div className="controls-wrapper">
          <button 
            className={`controls-toggle ${isControlsOpen ? 'open' : ''}`}
            onClick={() => setIsControlsOpen(!isControlsOpen)}
          >
            <BiChevronDown />
          </button>
          
          <div className={`cheats-controls ${isControlsOpen ? 'open' : ''}`}>
            <div className="search-container">
              <BiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search cheats..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <div className="filter-controls">
              <button 
                className={`filter-btn ${showDevelopers ? 'active' : ''}`}
                onClick={toggleDevelopers}
              >
                Developers
              </button>
            </div>
          </div>
        </div>

        <div className="cheats-grid">
          {filteredCheats.map((cheat, index) => (
            <CheatCard
              key={index}
              name={cheat.name}
              versions={cheat.versions}
              description={cheat.description}
              downloadUrl={cheat.downloadUrl}
              docsUrl={cheat.docsUrl}
              isPremium={cheat.isPremium}
              developers={showDevelopers ? cheat.developers : []}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheatsView; 
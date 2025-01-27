import React, { useState } from 'react';
import { BiChevronDown, BiChevronRight } from 'react-icons/bi';
import './DropdownButton.css';

const DropdownButton = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    setIsOpen(false);
  };

  return (
    <div className="nav-item">
      <button className="nav-button" onClick={toggleDropdown}>
        <span>{label}</span>
        <span className="nav-icon">
          {isOpen ? <BiChevronDown /> : <BiChevronRight />}
        </span>
      </button>
      
      {isOpen && (
        <div className="nav-dropdown" onClick={handleSelect}>
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownButton; 
import React from 'react';
import { FaGraduationCap, FaUserCircle, FaBell } from 'react-icons/fa';
import '../styles/header.css';

const Header = ({ onUploadClick }) => {
  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo-circle">
          <span className="logo-text">SU</span>
        </div>
        <div className="app-title-container">
          <h1 className="app-title">SHINE</h1>
          <span className="up-text">UP</span>
        </div>
      </div>
      
      <nav className="nav-menu">
        <button className="nav-btn active">Home</button>
        <button className="nav-btn">Explore</button>
        <button className="nav-btn">Library</button>
        <button className="nav-btn">Career</button>
      </nav>
      
      <div className="header-actions">
        <button className="icon-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>
        <button className="icon-btn">
          <FaUserCircle />
        </button>
        <button className="upload-btn" onClick={onUploadClick}>
          <FaGraduationCap />
          Upload Video
        </button>
      </div>
    </header>
  );
};

export default Header;
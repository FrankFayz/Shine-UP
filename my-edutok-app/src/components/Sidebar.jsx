import React from 'react';
import { FaHeart, FaDownload, FaShare, FaStickyNote, FaPlay, FaPause } from 'react-icons/fa';

const Sidebar = ({ onDownload, onLike, onShare, onNotes, likes, shares, isPlaying, onTogglePlay }) => {
  const actionButtons = [
    { icon: <FaHeart />, label: likes, action: onLike, color: "#ff6b6b" },
    { icon: <FaDownload />, label: "Download", action: onDownload, color: "#4ecdc4" },
    { icon: <FaShare />, label: shares, action: onShare, color: "#45b7d1" },
    { icon: <FaStickyNote />, label: "AI Notes", action: onNotes, color: "#96ceb4" }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-main-action">
        <button className="play-pause-sidebar" onClick={onTogglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      
      {actionButtons.map((button, index) => (
        <div key={index} className="sidebar-action">
          <button 
            className="sidebar-btn" 
            onClick={button.action}
            style={{ '--btn-color': button.color }}
          >
            {button.icon}
          </button>
          <span className="action-count">{button.label}</span>
        </div>
      ))}
      
      <div className="user-avatar-sidebar">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" 
          alt="User" 
          className="sidebar-avatar"
        />
      </div>
    </div>
  );
};

export default Sidebar;
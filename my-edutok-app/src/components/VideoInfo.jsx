import React from 'react';
import { FaGraduationCap, FaUsers, FaVideo } from 'react-icons/fa';

const VideoInfo = ({ user, title, description, uploadDate }) => {
  const handleProfileClick = () => {
    console.log("Navigating to user profile:", user.name);
  };

  return (
    <div className="video-info">
      <div className="user-info" onClick={handleProfileClick}>
        <img 
          src={user.profilePic} 
          alt={user.name} 
          className="user-avatar"
        />
        <div className="user-details">
          <h3 className="user-name">{user.name}</h3>
          <div className="user-stats">
            <span className="user-stat">
              <FaGraduationCap /> {user.university}
            </span>
            <span className="user-stat">
              <FaUsers /> {user.followers}
            </span>
            <span className="user-stat">
              <FaVideo /> {user.videos} videos
            </span>
          </div>
        </div>
        <button className="follow-btn">Follow</button>
      </div>
      
      <div className="video-details">
        <h2 className="video-title">{title}</h2>
        <p className="video-description">{description}</p>
        <div className="video-meta">
          <span className="video-tag">#MachineLearning</span>
          <span className="video-tag">#AI</span>
          <span className="video-tag">#ComputerScience</span>
          <span className="upload-date">Uploaded: {new Date(uploadDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const VideoPlayer = ({ videoRef, videoUrl, isPlaying, onTogglePlay }) => {
  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <video 
          ref={videoRef}
          className="video-player"
          controls={false}
          autoPlay
          muted
          loop
          onClick={onTogglePlay}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="video-overlay">
          <button className="play-pause-btn" onClick={onTogglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
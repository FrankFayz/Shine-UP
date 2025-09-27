import React, { useState, useRef, useEffect } from 'react';
import '../styles/VideoPlayer.css';
import { 
  FaPlay, 
  FaPause, 
  FaHeart, 
  FaShare, 
  FaDownload, 
  FaStickyNote, 
  FaUpload,
  FaUserPlus,
  FaCheck,
  FaVolumeUp,
  FaVolumeMute
} from 'react-icons/fa';

const VideoPlayer = ({ 
  videoUrl, 
  isPlaying, 
  onTogglePlay,
  onVideoClick,
  showOverlay = true 
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1247);
  const [shareCount, setShareCount] = useState(89);
  const [showNotes, setShowNotes] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      video.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.play().catch(console.error);
      } else {
        video.pause();
      }
    }
  }, [isPlaying]);

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickTime = (clickX / width) * duration;
    
    video.currentTime = clickTime;
    setCurrentTime(clickTime);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    setShareCount(prev => prev + 1);
    navigator.share?.({ url: videoUrl, title: 'Check out this video!' });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'video.mp4';
    link.click();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleVideoClick = (e) => {
    e.stopPropagation();
    if (onVideoClick) {
      onVideoClick();
    } else {
      onTogglePlay();
    }
  };

  return (
    <div className="video-player-container">
      <div 
        className="video-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleVideoClick}
      >
        <video 
          ref={videoRef}
          className="video-player"
          controls={false}
          autoPlay={isPlaying}
          muted={isMuted}
          loop
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Border Glow Effect */}
        <div className="video-border-glow"></div>
        
        {showOverlay && (
          <div className={`video-overlay ${isHovered ? 'hovered' : ''}`}>
            <button className="play-pause-btn" onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div 
          className="video-progress-container"
          onClick={(e) => {
            e.stopPropagation();
            handleProgressClick(e);
          }}
          ref={progressBarRef}
        >
          <div className="video-progress-background"></div>
          <div 
            className="video-progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <div 
            className="video-progress-thumb"
            style={{ left: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Time Display */}
        <div className="video-time-display">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Volume Control */}
        <div className="volume-control">
          <button className="volume-btn" onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}>
            {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              e.stopPropagation();
              handleVolumeChange(e);
            }}
            className="volume-slider"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Control Buttons */}
        <div className="video-controls-bottom">
          <div className="control-buttons-left">
            <button 
              className={`control-btn like-btn ${isLiked ? 'liked' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
            >
              <FaHeart />
              <span className="btn-count">{likeCount}</span>
            </button>
            
            <button className="control-btn share-btn" onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}>
              <FaShare />
              <span className="btn-count">{shareCount}</span>
            </button>
            
            <button className="control-btn download-btn" onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}>
              <FaDownload />
            </button>
          </div>

          <div className="control-buttons-right">
            <button 
              className={`control-btn notes-btn ${showNotes ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowNotes(!showNotes);
              }}
            >
              <FaStickyNote />
            </button>
            
            <button className="control-btn upload-btn" onClick={(e) => e.stopPropagation()}>
              <FaUpload />
            </button>
          </div>
        </div>

        {/* Sidebar Controls - Vertical Buttons */}
        <div className="video-sidebar-controls">
          <div className="sidebar-buttons-vertical">
            <button 
              className={`sidebar-btn like-btn ${isLiked ? 'liked' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
            >
              <FaHeart />
              <span className="btn-count">{likeCount}</span>
            </button>
            
            <button className="sidebar-btn share-btn" onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}>
              <FaShare />
              <span className="btn-count">{shareCount}</span>
            </button>
            
            <button className="sidebar-btn download-btn" onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}>
              <FaDownload />
            </button>
            
            <button 
              className={`sidebar-btn notes-btn ${showNotes ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowNotes(!showNotes);
              }}
            >
              <FaStickyNote />
            </button>

            <button className="sidebar-btn upload-btn" onClick={(e) => e.stopPropagation()}>
              <FaUpload />
            </button>
          </div>

          <div className="user-section">
            <div className="user-avatar">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="User" />
            </div>
            <button 
              className={`follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleFollow();
              }}
            >
              {isFollowing ? <FaCheck /> : <FaUserPlus />}
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* Notes Panel */}
        {showNotes && (
          <div className="notes-panel" onClick={(e) => e.stopPropagation()}>
            <div className="notes-header">
              <h3>Video Notes</h3>
              <button onClick={(e) => {
                e.stopPropagation();
                setShowNotes(false);
              }}>×</button>
            </div>
            <div className="notes-content">
              <p>Add your notes about this video here...</p>
              <textarea placeholder="Type your notes..."></textarea>
              <button className="save-notes-btn">Save Notes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
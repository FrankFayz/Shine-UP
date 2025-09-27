import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header.jsx';
import AINotesGenerator from '../components/AINotesGenerator.jsx';
import SearchBar from '../components/SearchBar.jsx';
import VideoPlayer from '../components/VideoPlayer.jsx';
import '../styles/mainPage.css';
import VideoInfo from '../components/VideoInfo.jsx';

// Throttle utility function
const useThrottle = (callback, delay) => {
  const lastCall = useRef(0);
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall.current < delay) return;
    lastCall.current = now;
    return callback(...args);
  };
};

const MainPage = () => {
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "Introduction to Machine Learning",
      description: "Learn the basics of machine learning algorithms and their applications in real-world scenarios. This video covers fundamental concepts that every computer science student should know.",
      uploadDate: "2023-10-15",
      user: {
        name: "Dr. Sarah Johnson",
        profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        university: "Stanford University",
        department: "Computer Science",
        followers: "12.5K",
        videos: 47
      },
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      likes: "2.4K",
      shares: "356",
      topics: [
        {
          title: "Question Answering (QA)",
          content: "Kasiita Explanation about LPPs."
        }
      ]
    },
    
    {
      id: 2,
      title: "Deep Learning Fundamentals",
      description: "Understanding neural networks and deep learning architectures for modern AI applications.",
      uploadDate: "2023-10-20",
      user: {
        name: "Prof. Michael Chen",
        profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
        university: "MIT",
        department: "AI Research",
        followers: "8.7K",
        videos: 32
      },
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      likes: "1.8K",
      shares: "289",
      topics: [
        {
          title: "Neural Networks",
          content: "Understanding the basics of artificial neural networks."
        }
      ]
    }
  ]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Individual video states
  const [videoStates, setVideoStates] = useState({});
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize video states
  useEffect(() => {
    const initialVideoStates = videos.reduce((acc, video) => ({
      ...acc,
      [video.id]: { 
        isPlaying: false
      }
    }), {});
    setVideoStates(initialVideoStates);
    setFilteredVideos(videos);
  }, [videos]);

  const currentVideo = filteredVideos[currentVideoIndex] || videos[0];

  // Video upload functionality
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 500MB');
      return;
    }

    setShowUploadModal(true);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      await simulateVideoUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      event.target.value = '';
    }
  };

  const simulateVideoUpload = (file) => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          const videoUrl = URL.createObjectURL(file);
          
          const newVideo = {
            id: Date.now(),
            title: file.name.replace(/\.[^/.]+$/, ""),
            description: `Uploaded video: ${file.name}`,
            uploadDate: new Date().toISOString().split('T')[0],
            user: {
              name: "You",
              profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
              university: "Local Upload",
              department: "Personal Files",
              followers: "0",
              videos: 1
            },
            videoUrl: videoUrl,
            likes: "0",
            shares: "0",
            topics: [
              {
                title: "Uploaded Content",
                content: "This video was uploaded from your personal files."
              }
            ],
            isUploaded: true
          };

          setVideos(prev => [newVideo, ...prev]);
          setCurrentVideoIndex(0);
          
          setTimeout(() => {
            setShowUploadModal(false);
            resolve(newVideo);
          }, 1000);
        }
        setUploadProgress(progress);
      }, 200);
    });
  };

  const cancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setShowUploadModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Screen orientation handling
  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Search filtering
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.topics.some(topic => 
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredVideos(filtered);
      setCurrentVideoIndex(0);
    } else {
      setFilteredVideos(videos);
    }
  }, [searchQuery, videos]);

  // Throttled scroll handling
  const throttledScroll = useThrottle((e) => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    const delta = Math.sign(e.deltaY);
    
    if (delta > 0 && currentVideoIndex < filteredVideos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
      // Pause current video when switching
      setVideoStates(prev => ({
        ...prev,
        [currentVideo.id]: { ...prev[currentVideo.id], isPlaying: false }
      }));
    } else if (delta < 0 && currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
      setVideoStates(prev => ({
        ...prev,
        [currentVideo.id]: { ...prev[currentVideo.id], isPlaying: false }
      }));
    }
    
    setTimeout(() => setIsScrolling(false), 500);
  }, 500);

  // Touch handling with velocity detection
  const handleTouchStart = (e) => {
    const touchStartY = e.touches[0].clientY;
    const touchStartTime = Date.now();
    
    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const deltaTime = Date.now() - touchStartTime;
      const velocity = Math.abs(deltaY) / deltaTime;

      if (Math.abs(deltaY) > 50 || velocity > 0.3) {
        if (deltaY > 0 && currentVideoIndex < filteredVideos.length - 1) {
          setCurrentVideoIndex(prev => prev + 1);
          setVideoStates(prev => ({
            ...prev,
            [currentVideo.id]: { ...prev[currentVideo.id], isPlaying: false }
          }));
        } else if (deltaY < 0 && currentVideoIndex > 0) {
          setCurrentVideoIndex(prev => prev - 1);
          setVideoStates(prev => ({
            ...prev,
            [currentVideo.id]: { ...prev[currentVideo.id], isPlaying: false }
          }));
        }
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Scroll and touch event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', throttledScroll, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', throttledScroll);
        container.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [currentVideoIndex, filteredVideos.length, throttledScroll]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay(currentVideo.id);
      } else if (e.code === 'ArrowDown' && currentVideoIndex < filteredVideos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
      } else if (e.code === 'ArrowUp' && currentVideoIndex > 0) {
        setCurrentVideoIndex(prev => prev - 1);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentVideo, currentVideoIndex, filteredVideos.length]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  const togglePlay = (videoId) => {
    setVideoStates(prev => ({
      ...prev,
      [videoId]: { ...prev[videoId], isPlaying: !prev[videoId]?.isPlaying }
    }));
  };

  const handleVideoClick = (videoId) => {
    togglePlay(videoId);
  };

  return (
    <div className={`main-page tiktok-style ${orientation}`} ref={containerRef}>
      <Header onUploadClick={handleUploadClick} />
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="video/*"
        style={{ display: 'none' }}
      />
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="upload-modal-overlay">
          <div className="upload-modal">
            <h3>Uploading Video</h3>
            {isUploading ? (
              <>
                <div className="upload-progress-bar">
                  <div 
                    className="upload-progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p>{Math.round(uploadProgress)}%</p>
                <button onClick={cancelUpload} className="cancel-upload-btn">
                  Cancel Upload
                </button>
              </>
            ) : (
              <>
                <div className="upload-success">
                  <span>✓</span>
                  <p>Video uploaded successfully!</p>
                </div>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="close-upload-btn"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="content-container">
        <SearchBar onSearch={handleSearch} />
        
        {/* Video Feed Container */}
        <div className="video-feed-container">
          {filteredVideos.map((video, index) => (
            <div 
              key={video.id}
              className={`video-section ${index === currentVideoIndex ? 'active' : 'inactive'}`}
            >
              <VideoPlayer
                videoUrl={video.videoUrl}
                isPlaying={videoStates[video.id]?.isPlaying || false}
                onTogglePlay={() => togglePlay(video.id)}
                onVideoClick={() => handleVideoClick(video.id)}
                showOverlay={index === currentVideoIndex}
              />
              
              {/* Video Info Overlay */}
              <div className="video-overlay-content">
                <div className="video-info-overlay">
                  <div className="creator-info-overlay">
                    <h3 className="video-title-overlay">{video.title}</h3>
                    {video.isUploaded && (
                      <span className="uploaded-badge">Your Upload</span>
                    )}
                    <div className="creator-details-overlay">
                      <span className="creator-name-overlay">{video.user.name}</span>
                      <span className="university-overlay">{video.user.university}</span>
                      <div className="creator-stats-overlay">
                        <span>{video.user.followers} followers</span>
                        <span>•</span>
                        <span>{video.user.videos} videos</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="video-description-overlay">
                    <p>{video.description}</p>
                  </div>

                  {/* Topics Section */}
                  <div className="topics-section-overlay">
                    <h4>Topics Covered</h4>
                    {video.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="topic-item-overlay">
                        <strong>{topic.title}</strong>
                        <p>{topic.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scroll Indicator */}
              {index === currentVideoIndex && filteredVideos.length > 1 && (
                <div className="scroll-indicator">
                  <span>↓ Scroll for next video ↑</span>
                </div>
              )}
            </div>
          ))}
          
          {/* No Results Message */}
          {filteredVideos.length === 0 && (
            <div className="no-results">
              <h3>No videos found</h3>
              <p>Try different search terms or upload your own video!</p>
              <button onClick={handleUploadClick} className="upload-cta-btn">
                Upload Your First Video
              </button>
            </div>
          )}
        </div>
        
        {showNotes && (
          <AINotesGenerator 
            videoTitle={currentVideo.title}
            onClose={() => setShowNotes(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MainPage;
import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header.jsx';
import VideoPlayer from '../components/VideoPlayer.jsx';
import Sidebar from '../components/Sidebar.jsx';
import VideoInfo from '../components/VideoInfo.jsx';
import AINotesGenerator from '../components/AINotesGenerator.jsx';
import SearchBar from '../components/SearchBar.jsx';
import '../styles/mainPage.css';

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
          content: "Kasilta's A05 - Select to choose what happens with this device."
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
    // Add more videos as needed
  ]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  const currentVideo = videos[currentVideoIndex];

  // TikTok-like scroll handling
  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      
      if (delta > 0 && currentVideoIndex < videos.length - 1) {
        // Scroll down - next video
        setCurrentVideoIndex(prev => prev + 1);
        setIsPlaying(true);
      } else if (delta < 0 && currentVideoIndex > 0) {
        // Scroll up - previous video
        setCurrentVideoIndex(prev => prev - 1);
        setIsPlaying(true);
      }
    };

    const handleTouchStart = (e) => {
      const touchStartY = e.touches[0].clientY;
      
      const handleTouchEnd = (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        
        if (Math.abs(deltaY) > 50) { // Minimum swipe distance
          if (deltaY > 0 && currentVideoIndex < videos.length - 1) {
            // Swipe down - next video
            setCurrentVideoIndex(prev => prev + 1);
            setIsPlaying(true);
          } else if (deltaY < 0 && currentVideoIndex > 0) {
            // Swipe up - previous video
            setCurrentVideoIndex(prev => prev - 1);
            setIsPlaying(true);
          }
        }
        
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchend', handleTouchEnd);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
        container.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [currentVideoIndex, videos.length]);

  // Auto-play current video
  useEffect(() => {
    const currentVideoRef = videoRefs.current[currentVideoIndex];
    if (currentVideoRef) {
      if (isPlaying) {
        currentVideoRef.play().catch(console.error);
      } else {
        currentVideoRef.pause();
      }
    }
  }, [currentVideoIndex, isPlaying]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  return (
    <div className="main-page tiktok-style" ref={containerRef}>
      <Header />
      
      <div className="content-container">
        <SearchBar onSearch={handleSearch} />
        
        {/* Video Feed Container */}
        <div className="video-feed-container">
          {videos.map((video, index) => (
            <div 
              key={video.id}
              className={`video-section ${index === currentVideoIndex ? 'active' : 'inactive'}`}
            >
              <VideoPlayer 
                videoRef={el => videoRefs.current[index] = el}
                videoUrl={video.videoUrl}
                isPlaying={index === currentVideoIndex && isPlaying}
                onTogglePlay={togglePlay}
                onClick={handleVideoClick}
              />
              
              {/* Overlay Content */}
              <div className="video-overlay-content">
                {/* Left Side - Video Info */}
                <div className="video-info-overlay">
                  <div className="creator-info-overlay">
                    <h3 className="video-title-overlay">{video.title}</h3>
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

                {/* Right Side - Action Buttons */}
                <Sidebar 
                  onDownload={() => console.log("Download video")}
                  onLike={() => console.log("Like video")}
                  onShare={() => console.log("Share video")}
                  onNotes={toggleNotes}
                  likes={video.likes}
                  shares={video.shares}
                  isPlaying={isPlaying && index === currentVideoIndex}
                  onTogglePlay={togglePlay}
                  userAvatar={video.user.profilePic}
                />
              </div>

              {/* Scroll Indicator */}
              {index === currentVideoIndex && (
                <div className="scroll-indicator">
                  <span>↓ Scroll for next video</span>
                </div>
              )}
            </div>
          ))}
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
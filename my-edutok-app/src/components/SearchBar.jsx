import React, { useState } from 'react';
import { FaSearch, FaMicrophone } from 'react-icons/fa';
import '../styles/searchbar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const popularSearches = ["Machine Learning", "Calculus", "Physics", "Programming", "Chemistry", "Biology"];

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <FaSearch className="search-icon" />
          <input 
            type="text"
            placeholder="Search for academic videos, courses, and topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="button" className="voice-search">
            <FaMicrophone />
          </button>
        </div>
        <button type="submit" className="search-btn">Search</button>
      </form>
      
      <div className="popular-searches">
        <span>Popular: </span>
        {popularSearches.map((search, index) => (
          <button 
            key={index} 
            className="popular-tag"
            onClick={() => {
              setQuery(search);
              onSearch(search);
            }}
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
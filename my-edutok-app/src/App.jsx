import React from 'react';
import MainPage from './pages/mainPage.jsx';
import './styles/MainPage.css';


function App() {
  

  return (
      <div className="App">
      <div className="background-shift">
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>
      </div>
      <MainPage />
    </div>
  );
}

export default App

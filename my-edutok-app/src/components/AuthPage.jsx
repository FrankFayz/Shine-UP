import React, { useState, useEffect } from 'react';
import './AuthPage.css';

const initialState = {
  fullName: '',
  email: '',
  password: '',
  profilePic: '',
  university: '',
  course: '',
  year: '',
  studentId: '',
  careerInterests: '',
  linkedin: '',
  skills: '',
  phone: ''
};

const AuthPage = ({ onLogin }) => {
  const [form, setForm] = useState(initialState);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in when component loads
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setIsAuthenticated(true);
      // Notify parent component that user is logged in
      if (onLogin) {
        onLogin(JSON.parse(userData));
      }
    }
  }, [onLogin]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value
    });
  };

  const handleLoginSubmit = e => {
    e.preventDefault();
    
    // Simulate authentication - replace with actual API call
    const mockUserData = {
      email: email,
      fullName: {fullName }, // In real app, this would come from backend
      university: "Example University"
    };
    
    // Store authentication token and user data
    const authToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(mockUserData));
    
    setIsAuthenticated(true);
    alert('Login successful!');
    
    // Notify parent component
    if (onLogin) {
      onLogin(mockUserData);
    }
  };

  const handleRegisterSubmit = e => {
    e.preventDefault();
    
    // Store user data and auto-login after registration
    const authToken = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(form));
    
    setIsAuthenticated(true);
    alert('Registration successful! You are now logged in.');
    
    // Notify parent component
    if (onLogin) {
      onLogin(form);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setForm(initialState);
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setForm(initialState);
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setEmail('');
    setPassword('');
  };

  // If user is already authenticated, show a welcome message or redirect
  if (isAuthenticated) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    return (
      <div className="auth-main-container">
        <div className="auth-content-wrapper">
          <div className="auth-left">
            <div className="logo-circle">
              <span className="logo-text">🌟</span>
            </div>
            <h1 className="app-title">SHINE <span className="up-text">UP</span></h1>
          </div>
          <div className="auth-right">
            <div className="welcome-message">
              <h2>Welcome back, {userData.fullName || 'User'}!</h2>
              <p>You are already logged in.</p>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-main-container">
      <div className="auth-content-wrapper">
        <div className="auth-left">
          <div className="logo-circle">
            <span className="logo-text">🌟</span>
          </div>
          <h1 className="app-title">SHINE <span className="up-text">UP</span></h1>
          <p className="app-tagline">
            <span className="welcome-text">Welcome to the Academic TikTok!</span><br />
            <span className="desc-text">
              Where brilliance meets opportunity.<br />
              Upload, share, and shine before you graduate!
            </span>
          </p>
          <div className="dev-pics">
            <img src="https://t2informatik.de/en/wp-content/uploads/sites/2/2019/07/development-team.jpg" alt="Developers" className="dev-img" />
            <p className="dev-caption">Meet the Developers</p>
          </div>
        </div>
        <div className="auth-right">
          {isLogin ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <h2>Login to Your Account</h2>
              <label>
                Email
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </label>
              <label>
                Password
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </label>
              <div className="remember-me">
                <label>
                  <input type="checkbox" defaultChecked /> Remember me
                </label>
              </div>
              <button type="submit">Login</button>
              <p className="auth-switch">
                Don't have an account?{' '}
                <span className="auth-link" onClick={switchToRegister}>
                  Sign up here
                </span>
              </p>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <h2>Create Your Account</h2>
              <label>
                Full Name
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Password
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
              </label>
              <label>
                Profile Picture
                <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
              </label>
              <label>
                University
                <input type="text" name="university" value={form.university} onChange={handleChange} required />
              </label>
              <label>
                Course/Program
                <input type="text" name="course" value={form.course} onChange={handleChange} required />
              </label>
              <label>
                Year of Study
                <input type="number" name="year" value={form.year} onChange={handleChange} min="1" max="8" required />
              </label>
              <label>
                Student ID
                <input type="text" name="studentId" value={form.studentId} onChange={handleChange} required />
              </label>
              <label>
                Career Interests
                <input type="text" name="careerInterests" value={form.careerInterests} onChange={handleChange} />
              </label>
              <label>
                LinkedIn Profile
                <input type="url" name="linkedin" value={form.linkedin} onChange={handleChange} />
              </label>
              <label>
                Skills
                <input type="text" name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. Python, Teaching" />
              </label>
              <label>
                Phone Number (optional)
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
              </label>
              <button type="submit">Register</button>
              <p className="auth-switch">
                Already have an account?{' '}
                <span className="auth-link" onClick={switchToLogin}>
                  Login here
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
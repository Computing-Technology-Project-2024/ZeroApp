import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { pageRoutes } from '../../../constants/pageRoutes';
import '../signup.css';
import api from '../../../apis/BackendApi';
import eyeShow_icon from '../../../img/eye_show_icon.png';
import eyeClose_icon from '../../../img/eye_close_icon.png';
import logo from '../../../img/logo.png';
import google_icon from '../../../img/google_icon.png';
import facebook_icon from '../../../img/facebook_icon.png';
import apple_icon from '../../../img/apple_icon.png';

const signupIcons = [
  { name: 'eyeShow', icon: eyeShow_icon, alt: 'Show password' },
  { name: 'eyeClose', icon: eyeClose_icon, alt: 'Hide password' },
];

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await api.post('/auth/sign-up', {
        email: email,
        password: password,
        username: email.split('@')[0], // Using email as username for simplicity
      });

      if (response.status === 200) {
        // Signup successful, redirect to login page
        navigate(pageRoutes.LOGIN, { state: { message: 'Signup successful. Please log in.' } });
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'An error occurred during signup');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">

        <p className='pop-up'>Already had an account? <Link to={pageRoutes.LOGIN} className='link' >Log In</Link></p>

        <div className="logo">
          <img
            src={logo}
            alt="Logo"
          />
        </div>

        {/* ------------- NEED VALIDATION ------------- */}
        <form className="signup-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              className="signup-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group-show">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="signup-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={showPassword ? signupIcons.find(item => item.name === 'eyeShow').icon : signupIcons.find(item => item.name === 'eyeClose').icon}
              alt={showPassword ? signupIcons.find(item => item.name === 'eyeShow').alt : signupIcons.find(item => item.name === 'eyeClose').alt}
              className="eye-icon"
              onClick={togglePasswordVisibility}
            />
          </div>
          <div className="input-group-show">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="signup-input"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <img
              src={showPassword ? signupIcons.find(item => item.name === 'eyeShow').icon : signupIcons.find(item => item.name === 'eyeClose').icon}
              alt={showPassword ? signupIcons.find(item => item.name === 'eyeShow').alt : signupIcons.find(item => item.name === 'eyeClose').alt}
              className="eye-icon"
              onClick={togglePasswordVisibility}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="signup-button" onClick={handleSubmit}>Sign Up</button>
        </form>

        <div className="divider">
          <span className="divider-text">or sign up with</span>
        </div>

        <div className="signup-row">
          <img src={google_icon} alt="Google icon" className="signup-icon" />
          <img src={apple_icon} alt="Apple icon" className="signup-icon" />
          <img src={facebook_icon} alt="Facebook icon" className="signup-icon" />
        </div>

      </div>
    </div>
  );
};

export default Signup;

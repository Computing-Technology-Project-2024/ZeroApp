import React, { useState, useEffect } from 'react';
import '../login.css';
import { pageRoutes } from '../../../constants/pageRoutes';
import api from '../../../apis/BackendApi';
import eyeShow_icon from '../../../img/eye_show_icon.png';
import eyeClose_icon from '../../../img/eye_close_icon.png';
import logo from '../../../img/logo.png';
import google_icon from '../../../img/google_icon.png';
import facebook_icon from '../../../img/facebook_icon.png';
import apple_icon from '../../../img/apple_icon.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const loginIcons = [
  { name: 'eyeShow', icon: eyeShow_icon, alt: 'Show password' },
  { name: 'eyeClose', icon: eyeClose_icon, alt: 'Hide password' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    const token = Cookies.get('jwt');
    if (token) {
      navigate(pageRoutes.DASHBOARD);
    }

    // Check for success message from signup
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [navigate, location]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/token', {
        username: email,
        password: password,
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (response.data.access_token) {
        Cookies.set('jwt', response.data.access_token, { expires: 1 }); // Expires in 1 day
        navigate(pageRoutes.DASHBOARD);
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <p className='pop-up'>Haven’t had an account? <Link to={pageRoutes.SIGNUP} className='link'>Sign up</Link></p>

        <div className="logo">
          <img
            src={logo}
            alt="Logo"
          />
        </div>

        {/* ------------- NEED VALIDATION ------------- */}
        <form className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group-show">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={showPassword
                ? loginIcons.find(item => item.name === 'eyeShow').icon
                : loginIcons.find(item => item.name === 'eyeClose').icon}
              alt={showPassword
                ? loginIcons.find(item => item.name === 'eyeShow').alt
                : loginIcons.find(item => item.name === 'eyeClose').alt}
              className="eye-icon"
              onClick={togglePasswordVisibility}
            />
          </div>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button" onClick={handleSubmit}>Login</button>
        </form>

        <div className="divider">
          <span className="divider-text">or login with</span>
        </div>

        <div className="login-row">
          <img src={google_icon} alt="Google icon" className="login-icon" />
          <img src={apple_icon} alt="Apple icon" className="login-icon" />
          <img src={facebook_icon} alt="Facebook icon" className="login-icon" />
        </div>

      </div>
    </div>
  );
};

export default Login;

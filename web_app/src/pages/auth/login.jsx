import React, { useState } from 'react';
import './login.css';
import { Link } from 'react-router-dom';
import { pageRoutes } from '../../constants/pageRoutes';

import eyeShow_icon from '../../img/eye_show_icon.png';
import eyeClose_icon from '../../img/eye_close_icon.png';
import logo from '../../img/logo.png';
import google_icon from '../../img/google_icon.png';
import facebook_icon from '../../img/facebook_icon.png';
import apple_icon from '../../img/apple_icon.png';

const loginIcons = [
  { name: 'eyeShow', icon: eyeShow_icon, alt: 'Show password' },
  { name: 'eyeClose', icon: eyeClose_icon, alt: 'Hide password' },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            />
          </div>
          <div className="input-group-show">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-input"
              required
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
          <Link to={pageRoutes.DASHBOARD}><button type="submit" className="login-button">Login</button></Link>
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

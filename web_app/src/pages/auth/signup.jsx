import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { pageRoutes } from '../../constants/pageRoutes';
import './signup.css';

import eyeShow_icon from '../../img/eye_show_icon.png';
import eyeClose_icon from '../../img/eye_close_icon.png';
import logo from '../../img/logo.png';
import google_icon from '../../img/google_icon.png';
import facebook_icon from '../../img/facebook_icon.png';
import apple_icon from '../../img/apple_icon.png';

const signupIcons = [
  { name: 'eyeShow', icon: eyeShow_icon, alt: 'Show password' },
  { name: 'eyeClose', icon: eyeClose_icon, alt: 'Hide password' },
];

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            />
          </div>
          <div className="input-group-show">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="signup-input"
              required
            />
            <img
              src={showPassword
                ? signupIcons.find(item => item.name === 'eyeShow').icon
                : signupIcons.find(item => item.name === 'eyeClose').icon}
              alt={showPassword
                ? signupIcons.find(item => item.name === 'eyeShow').alt
                : signupIcons.find(item => item.name === 'eyeClose').alt}
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
            />
            <img
              src={showPassword
                ? signupIcons.find(item => item.name === 'eyeShow').icon
                : signupIcons.find(item => item.name === 'eyeClose').icon}
              alt={showPassword
                ? signupIcons.find(item => item.name === 'eyeShow').alt
                : signupIcons.find(item => item.name === 'eyeClose').alt}
              className="eye-icon"
              onClick={togglePasswordVisibility}
            />
          </div>
          <Link to={pageRoutes.LOGIN}><button type="submit" className="signup-button">Sign Up</button></Link>
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

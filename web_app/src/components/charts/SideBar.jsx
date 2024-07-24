import React, { useState } from 'react';
import './Sidebar.css';
import dash_icon from '../../img/dash_icon.png';
import analytics_ico from '../../img/analytics_icon.png';
import recon_icon from '../../img/recommend_icon.png';
import expen_icon from '../../img/expenses_icon.png';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="sidebar">
      <div className="logo">
      <span className="logo-zero">Zero</span>
        <span className="logo-app">App</span>
      </div>
      <nav className="menu">
        <ul>
          <li className={`menu-item ${activeItem === 'dashboard' ? 'active' : ''}`}>
            <a href="#dashboard" onClick={() => handleItemClick('dashboard')}>
              <img className="img" src={dash_icon} alt="icon" /> Dashboard
            </a>
          </li>
          <li className={`menu-item ${activeItem === 'analytics' ? 'active' : ''}`}>
            <a href="#analytics" onClick={() => handleItemClick('analytics')}>
              <img className="img" src={analytics_ico} alt="icon" /> Analytics
            </a>
          </li>
          <li className={`menu-item ${activeItem === 'recommendation' ? 'active' : ''}`}>
            <a href="#recommendation" onClick={() => handleItemClick('recommendation')}>
              <img className="img" src={recon_icon} alt="icon" /> Recommendation
            </a>
          </li>
          <li className={`menu-item ${activeItem === 'expense' ? 'active' : ''}`}>
            <a href="#expense" onClick={() => handleItemClick('expense')}>
              <img className="img" src={expen_icon} alt="icon" /> Expense
            </a>
          </li>
        </ul>
      </nav>

      <div className="hr"><hr /></div>

      <div className="pages">Pages
        <ul>
          <li className={`menu-item ${activeItem === 'pricing' ? 'active' : ''}`}>
            <a href="#pricing" onClick={() => handleItemClick('pricing')}>Pricing</a>
          </li>
          <li className={`menu-item ${activeItem === 'calendar' ? 'active' : ''}`}>
            <a href="#calendar" onClick={() => handleItemClick('calendar')}>Calendar</a>
          </li>
          <li className={`menu-item ${activeItem === 'to-do' ? 'active' : ''}`}>
            <a href="#to-do" onClick={() => handleItemClick('to-do')}>To-Do</a>
          </li>
          <li className={`menu-item ${activeItem === 'contact' ? 'active' : ''}`}>
            <a href="#contact" onClick={() => handleItemClick('contact')}>Contact</a>
          </li>
          <li className={`menu-item ${activeItem === 'invoice' ? 'active' : ''}`}>
            <a href="#invoice" onClick={() => handleItemClick('invoice')}>Invoice</a>
          </li>
        </ul>
      </div>

      <div className="hr"><hr /></div>

      <div className="settings">
        <ul>
          <li className={`menu-item ${activeItem === 'settings' ? 'active' : ''}`}>
            <a href="#settings" onClick={() => handleItemClick('settings')}>Settings</a>
          </li>
          <li className={`menu-item ${activeItem === 'logout' ? 'active' : ''}`}>
            <a href="#logout" onClick={() => handleItemClick('logout')}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
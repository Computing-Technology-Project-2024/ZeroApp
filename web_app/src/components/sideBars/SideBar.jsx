import React, { useState } from 'react';
import './Sidebar.css';
import dash_icon from '../../img/dash_icon.png';
import analytics_ico from '../../img/analytics_icon.png';
import recon_icon from '../../img/recommend_icon.png';
import expen_icon from '../../img/expenses_icon.png';
import {Link} from "react-router-dom";
import {pageRoutes} from "../../constants/pageRoutes";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const pageItems = [
    { name: 'pricing', text: 'temp', route: pageRoutes.HOME },
    { name: 'calendar', text: 'temp', route: pageRoutes.HOME },
    { name: 'to-do', text: 'temp', route: pageRoutes.HOME },
    { name: 'contact', text: 'temp', route: pageRoutes.HOME },
    { name: 'invoice', text: 'temp', route: pageRoutes.HOME },
  ];

  const settingsItems = [
    { name: 'settings', text: 'Settings', route: pageRoutes.SETTINGS },
    { name: 'logout', text: 'temp', route: pageRoutes.LOGIN },
  ];

  const menuItems = [
    { name: 'dashboard', icon: dash_icon, text: 'Dashboard', route: pageRoutes.DASHBOARD },
    { name: 'analytics', icon: analytics_ico, text: 'Analytics', route: pageRoutes.ANALYTICS },
    { name: 'recommendation', icon: recon_icon, text: 'Recommendation', route: pageRoutes.RECOMMENDATIONS },
    { name: 'expense', icon: expen_icon, text: 'temp', route: pageRoutes.HOME }
  ];

  return (
      <div className="sidebar">
        <div className="logo">
          <span className="logo-zero">Zero</span>
          <span className="logo-app">App</span>
        </div>
        <nav className="menu">
          <ul>
            {menuItems.map((item) => (
                <li
                    key={item.name}
                    className={`menu-item ${activeItem === item.name ? 'active' : ''}`}
                >
                  <Link to={item.route} onClick={() => handleItemClick(item.name)}>
                    <img className="img" src={item.icon} alt="icon"/> {item.text}
                  </Link>
                </li>
            ))}
          </ul>
        </nav>

        <div className="hr">
          <hr/>
        </div>

        <div className="pages">
          Pages
          <ul>
            {pageItems.map((item) => (
              <li
                key={item.name}
                className={`menu-item ${activeItem === item.name ? 'active' : ''}`}
              >
                <Link to={item.route} onClick={() => handleItemClick(item.name)}>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hr">
          <hr/>
        </div>

        <div className="settings">
          <ul>
            {settingsItems.map((item) => (
              <li
                key={item.name}
                className={`menu-item ${activeItem === item.name ? 'active' : ''}`}
              >
                <Link to={item.route} onClick={() => handleItemClick(item.name)}>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import './Sidebar.css';
import dash_icon from '../../img/dash_icon.png';
import analytics_ico from '../../img/analytics_icon.png';
import recon_icon from '../../img/recommend_icon.png';
import logout_icon from '../../img/logout_icon.png';
import settings_icon from '../../img/settings_icon.png';
import {Link} from "react-router-dom";
import {pageRoutes} from "../../constants/pageRoutes";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const menuItems = [
    { name: 'dashboard', icon: dash_icon, text: 'Dashboard', route: pageRoutes.DASHBOARD },
    { name: 'analytics', icon: analytics_ico, text: 'Analytics', route: pageRoutes.ANALYTICS },
    { name: 'recommendation', icon: recon_icon, text: 'Recommendation', route: pageRoutes.RECOMMENDATIONS },
    { name: 'settings', icon: settings_icon, text: 'Settings', route: pageRoutes.SETTINGS },
    { name: 'logout', icon: logout_icon, text: 'Logout', route: pageRoutes.LOGIN },
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

      </div>
  );
};

export default Sidebar;
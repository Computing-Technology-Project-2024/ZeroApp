import React, { useState } from 'react';
import './Sidebar.css';

import logo from '../../img/logo.png';
import dash_icon from '../../img/dash_icon.png';
import analytics_ico from '../../img/analytics_icon.png';
import recon_icon from '../../img/recommend_icon.png';
import logout_icon from '../../img/logout_icon.png';
import settings_icon from '../../img/settings_icon.png';
import {Link, useLocation, useParams} from "react-router-dom";
import {pageRoutes} from "../../constants/pageRoutes";

const Sidebar = ({ className }) => {
  const { pathname: path } = useLocation();
  const [activeItem, setActiveItem] = useState(path.slice(1));

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const settingsItems = [
    { name: 'settings', icon: settings_icon, text: 'Settings', route: pageRoutes.SETTINGS },
    { name: 'logout', icon: logout_icon, text: 'Logout', route: pageRoutes.LOGIN },
  ];

  const menuItems = [
    { name: 'dashboard', icon: dash_icon, text: 'Dashboard', route: pageRoutes.DASHBOARD },
    { name: 'analytics', icon: analytics_ico, text: 'Analytics', route: pageRoutes.ANALYTICS },
    { name: 'recommendations', icon: recon_icon, text: 'Recommendation', route: pageRoutes.RECOMMENDATIONS }
  ];

  return (
      <div className={`sidebar w-60 ${className}`}>
        <div className="logo">
          {/* <span className="logo-zero">Zero</span>
          <span className="logo-app">App</span> */}
          <img src={logo} alt="Logo"/>
        </div>

        <nav className="menu">
          <ul>
            {menuItems.map((item) => (
                <li
                    key={item.name}
                    className={`menu-item ${activeItem === item.name ? 'active' : ''}`}
                >
                  <Link to={item.route} onClick={() => handleItemClick(item.name)}>
                    <img className="img" src={item.icon} alt="icon"/>
                    <p className={``} >{item.text}</p>
                  </Link>
                </li>
            ))}
          </ul>
        </nav>

        <hr></hr>

        <div className="settings">
          <ul>
            {settingsItems.map((item) => (
              <li
                key={item.name}
                className={`menu-item ${activeItem === item.name ? 'active' : ''}`}
              >
                <Link to={item.route} onClick={() => handleItemClick(item.name)}>
                  <img className="img" src={item.icon} alt="icon"/>
                  <p className={``}>{item.text}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default Sidebar;
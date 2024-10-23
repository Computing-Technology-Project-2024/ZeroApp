import React, { useState } from 'react';

import './searchBar.css';
import { Link } from 'react-router-dom';
import { pageRoutes } from '../../constants/pageRoutes';

import Search from '../searchFunc/search';
import userImg from '../../img/userImg.png';
import dropdown_icon from '../../img/dropdown_icon.png';
import active_dropdown_icon from '../../img/active_dropdown_icon.png';


const searchBarItems = [
    // { name: 'search', icon: search_icon, alt: 'Search', action: () => console.log('Search clicked') },
    { name: 'user', icon: userImg, alt: 'User' },
    { name: 'dropdown', icon: dropdown_icon, alt: 'Dropdown' },
    { name: 'active_dropdown', icon: active_dropdown_icon, alt: 'Active Dropdown' }
];

const SearchBar = ({ className }) => {
    const [isDropdownActive, setIsDropdownActive] = useState(false);

    const handleToggleClick = () => {
        // Toggle between dropdown and active dropdown icons
        setIsDropdownActive(!isDropdownActive);
    };

    return (
        <div className={`searchbar-container ${className}`}>
            <Search />

            <div></div>

            <div className='right-container'>
                {/* ------------------------User Information------------------------ */}
                <div className="user-container">
                    {/* User img will be retrieved from the database in the future */}
                    <div className="user-info-wrapper">
                        <Link to={pageRoutes.SETTINGS}>
                            <img
                                src={searchBarItems.find(item => item.name === 'user').icon}
                                alt={searchBarItems.find(item => item.name === 'user').alt}
                                className="user-icon"
                            />
                        </Link>
                        <div className="user-info">
                            <p className="user-name">Moni Roy</p>
                            <p className="user-mode">User</p>
                        </div>
                    </div>

                    {/* ------------------------Dropdown Menu------------------------ */}
                    <div className="dropdown-wrapper">
                        <img
                            src={isDropdownActive
                                ? searchBarItems.find(item => item.name === 'active_dropdown').icon
                                : searchBarItems.find(item => item.name === 'dropdown').icon}
                            alt={isDropdownActive
                                ? searchBarItems.find(item => item.name === 'active_dropdown').alt
                                : searchBarItems.find(item => item.name === 'dropdown').alt}
                            className="toggle-icon"
                            onClick={handleToggleClick}
                        />

                        {/* Conditionally render the dropdown menu */}
                        {isDropdownActive && (
                            <div className="dropdown-menu">
                                <ul>
                                    <li>Settings</li>
                                    <li>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
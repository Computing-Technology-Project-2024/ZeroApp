import React from 'react';
import './searchBar.css';
import Search from '../searchFunc/search';

import noti_icon from '../../img/noti_icon.png';
import userImg from '../../img/userImg.png';
import dropdown_icon from '../../img/dropdown_icon.png';


const searchBarItems = [
    // { name: 'search', icon: search_icon, alt: 'Search', action: () => console.log('Search clicked') },
    { name: 'notification', icon: noti_icon, alt: 'Notifications', action: () => console.log('Notification clicked') },
    { name: 'user', icon: userImg, alt: 'User', action: () => console.log('User clicked') },
    { name: 'dropdown', icon: dropdown_icon, alt: 'Dropdown', action: () => console.log('Dropdown clicked') }
];

const SearchBar = () => {
    return (
        <div className="searchbar-container">

            <Search />

            <div></div>

            {/* Notification Icon */}
            <div className='right-container'>
                <div className="notification-container">
                    <img
                        src={searchBarItems.find(item => item.name === 'notification').icon}
                        alt={searchBarItems.find(item => item.name === 'notification').alt}
                        className="notification-icon"
                    />

                    {/* number of notifications */}
                    <p className="notification-badge">6</p>
                </div>

                {/* User Information */}
                <div className="user-container">
                    {/* User img will be retrieved from the database in the future */}
                    <div className="user-info-wrapper">
                        <img
                            src={searchBarItems.find(item => item.name === 'user').icon}
                            alt={searchBarItems.find(item => item.name === 'user').alt}
                            className="user-icon"
                        />
                        <div className="user-info">
                            <p className="user-name">Moni Roy</p>
                            <p className="user-mode">User</p>
                        </div>
                    </div>
                    <img
                        src={searchBarItems.find(item => item.name === 'dropdown').icon}
                        alt={searchBarItems.find(item => item.name === 'dropdown').alt}
                        className="toggle-icon"
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
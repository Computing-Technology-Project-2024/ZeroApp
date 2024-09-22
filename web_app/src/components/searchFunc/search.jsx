import React from 'react';
import search_icon from '../../img/search_icon.png';

const Search = () => {
  return (
    <div className="search-container">
      <img src={search_icon} alt="search" className="icon" />
      <input type="text" placeholder="Search" className="search-input" />
    </div>
  );
};

export default Search;
import React from 'react';
import search_icon from '../../img/search_icon.png';

const Search = () => {
  const styles = {
    searchInput: {
      width: '100%',
      border: 'none',
      outline: 'none',
      fontSize: '1rem',
    }
  };

  return (
    <div className="search-container">
      <img src={search_icon} alt="search" className="icon" />
      <input type="text" placeholder="Search" style={styles.searchInput} />
    </div>
  );
};

export default Search;
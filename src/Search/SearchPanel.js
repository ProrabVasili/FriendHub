import React, { useState } from 'react';
import axios from 'axios';
import SearchResult from './SearchResult';
import './SearchPanel.css';

const SearchPanel = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;

    try {
      const response = await axios.get(`http://localhost:5000/api/users/search?name=${name}`);
      if (response.data.length > 0) {
        setSearchResults(response.data);
        setSearchError('');
      } else {
        setSearchResults([]);
        setSearchError('User not found');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchError('An error occurred while searching. Please try again.');
    }
  };

  return (
    <div className="search-container">
      <h1>Пошук</h1>
      <form id="searchForm" onSubmit={handleSubmit}>
        <input type="text" id="searchInput" name="name" placeholder="Введіть ім'я" required />
        <button type="submit">Пошук</button>
      </form>
      <div id="searchResults" className="search-results">
        {searchError && <p>{searchError}</p>}
        {searchResults.map(user => (
          <SearchResult key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default SearchPanel;

import profileImg from '../avatar.png';

import React from 'react';
import axios from 'axios';
import './SearchResult.css'; 

const SearchResult = ({user }) => {
  const offerFriendship = async (userId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/notifications', {
        userId,
        message: 'wants to connect with you.',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Friendship request sent successfully!');
    } catch (error) {
      console.error('Error sending friendship offer:', error);
      alert('Failed to send friendship request.');
    }
  };

  return (
    <div className="search-result">
      <img src={user.avatar || profileImg} alt={user.username} />
      <h2>{user.username}</h2>
      <button onClick={() => offerFriendship(user._id)}>Friendship</button>
    </div>
  );
};

export default SearchResult;

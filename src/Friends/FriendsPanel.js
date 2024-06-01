import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FriendsList from './FriendsList';
import './FriendsPanel.css';
import profileImg from '../avatar.png';

const FriendsPanel = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/friends', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data.friends.map(friend => ({
          name: friend.friendId.username,
          avatar: friend.friendId.avatar || profileImg,
        })));
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="friends-page">
      <h1>My Friends</h1>
      <FriendsList friends={friends} />
    </div>
  );
};

export default FriendsPanel;

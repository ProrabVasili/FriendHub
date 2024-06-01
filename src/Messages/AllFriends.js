import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllFriends.css';
import profileImg from '../avatar.png';

const AllFriends = ({ onSelectFriend }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/friends', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFriends(response.data.friends || []);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setFriends([]);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="all-friends">
      {friends.length > 0 ? (
        friends.map(friend => (
          <div key={friend._id} className="friend-item" onClick={() => onSelectFriend(friend.friendId)}>
            <img src={friend.friendId.avatar || profileImg} alt="Avatar" className="avatar" />
            <div className="friend-name">{friend.friendId.username}</div>
          </div>
        ))
      ) : (
        <p>No friends found.</p>
      )}
    </div>
  );
};

export default AllFriends;

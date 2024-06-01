import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import './PersonNav.css';
import profileImg from '../avatar.png';

const PersonNav = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          setError('No token found');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUsers(response.data);
        } else {
          setError('Failed to load user data');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, [token]);

  const handleLike = async (userId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:5000/api/notifications',
        {
          userId,
          message: 'wants to connect with you.',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error sending friendship offer:', error);
    }
  };

  const handleDislike = (userId) => {
    setUsers(users.filter(user => user._id !== userId));
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="personnav">
      <div className="scroll-container">
        {users.map(user => (
          <Post
            key={user._id}
            imgSrc={user.avatar || profileImg}
            content={user.username}
            onLike={() => handleLike(user._id)}
            onDislike={() => handleDislike(user._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PersonNav;

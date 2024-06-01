import React, { useState, useEffect } from 'react';
import axios from 'axios';
import User from './User'; 
import './IntPeoplePanel.css'; 
import profileImg from '../avatar.png';

const IntPeoplePanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/interest_users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div id="InterestingPeopleContainer" className="interesting-people-container">
      <h1>Цікаві люде</h1>
      <div id="trendingUsers" className="trending-users">
        {users.map(user => (
          <User key={user._id} name={user.username} image={user.avatar || profileImg} />
        ))}
      </div>
    </div>
  );
};

export default IntPeoplePanel;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserProfile from './UserProfile';
import { useAuth } from '../AuthContext'; 
import './ProfilePanel.css';
import profileImg from '../avatar.png';


const ProfilePanel = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const { logout } = useAuth(); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          setError('No token found');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          setError('Failed to load user data');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // logout();
        setError('Error fetching profile');
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    logout(); 
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <UserProfile
        username={user.username}
        avatar={user.avatar || profileImg}
      />
      <button onClick={handleLogout}>Logout</button> 
    </div>
  );
};

export default ProfilePanel;



import React from 'react';
import './UserProfile.css'; 

const UserProfile = ({ username, avatar }) => {
  return (
    <div className="profile">
      <div className="profile-header">
        <img src={avatar} alt="Profile" className="profile-picture" />
        <h2>{username}</h2>
      </div>
    </div>
  );
};

export default UserProfile;

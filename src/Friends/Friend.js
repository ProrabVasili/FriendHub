import React from 'react';
import './Friend.css'; 

const Friend = ({ name, avatar }) => {
  return (
    <div className="friend">
      <img src={avatar} alt={name} className="avatar" />
      <p>{name}</p>
    </div>
  );
};

export default Friend;

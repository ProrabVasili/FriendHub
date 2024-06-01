import React from 'react';
import './User.css';

const User = ({ name, image }) => (
  <div className="user">
    <img src={image} alt={name} />
    <p>{name}</p>
  </div>
);

export default User;

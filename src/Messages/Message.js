import React from 'react';
import './Message.css';

const Message = ({ avatar, name, message, time }) => (
  <div className="message-container">
    <img src={avatar} alt="User Avatar" className="avatar" />
    <div className="message-details">
      <div className="name">{name}</div>
      <div className="message">{message}</div>
      <div className="time">{time}</div>
    </div>
  </div>
);

export default Message;

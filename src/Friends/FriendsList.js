import React from 'react';
import Friend from './Friend';
import './FriendsList.css'; 

const FriendsList = ({ friends }) => {
  return (
    <div className="friends-list">
      {friends.map((friend, index) => (
        <Friend key={index} name={friend.name} avatar={friend.avatar} />
      ))}
    </div>
  );
};

export default FriendsList;

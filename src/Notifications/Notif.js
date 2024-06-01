import React from 'react';

const Notif = ({ id, name, notification, onConnect, onCancel, actionTaken }) => {
  const isFriendRequest = notification.includes('wants to connect with you');

  return (
    <div className="notification">
      <div className="notification-content">
        <p><strong>{name}</strong>: {notification}</p>
      </div>
      {isFriendRequest && !actionTaken && (
        <div className="notification-actions">
          <button onClick={() => onConnect(id)}>Accept</button>
          <button onClick={() => onCancel(id)}>Reject</button>
        </div>
      )}
      {actionTaken && <p>{actionTaken}</p>}
    </div>
  );
};

export default Notif;

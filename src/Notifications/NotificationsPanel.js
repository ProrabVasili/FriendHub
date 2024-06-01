import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notif from './Notif.js';
import './NotificationsPanel.css';

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [actionTaken, setActionTaken] = useState({});

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleConnect = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/friends/connect', { notificationId: id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActionTaken(prev => ({ ...prev, [id]: 'You and the user are now friends.' }));
      setNotifications(notifications.filter(notification => notification._id !== id));
    } catch (error) {
      console.error('Error connecting friend:', error);
    }
  };

  const handleCancel = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/friends/cancel', { notificationId: id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActionTaken(prev => ({ ...prev, [id]: 'You rejected the friend request.' }));
      setNotifications(notifications.filter(notification => notification._id !== id));
    } catch (error) {
      console.error('Error canceling friend:', error);
    }
  };

  return (
    <div id="NotificationsContainer" className="notifications-container">
      <h1>Сповіщення</h1>
      {notifications.map(notification => (
        <Notif
          key={notification._id}
          id={notification._id}
          name={notification.senderUsername}
          notification={notification.message}
          onConnect={handleConnect}
          onCancel={handleCancel}
          actionTaken={actionTaken[notification._id]}
        />
      ))}
    </div>
  );
};

export default NotificationsPanel;

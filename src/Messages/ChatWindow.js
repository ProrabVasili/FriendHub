import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Message from './Message';
import './ChatWindow.css';
import profileImg from '../avatar.png';

const ChatWindow = ({ friend }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [me, setMe] = useState({ _id: null, username: 'Me', avatar: profileImg }); 

  useEffect(() => {
    const fetchMessages = async () => {
      if (!friend || !friend._id) {
        console.error('Invalid friend object:', friend);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/messages/${friend._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [friend]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMe(response.data.user);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchMe();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await axios.post('http://localhost:5000/api/messages', 
      { recipientId: friend._id, content: newMessage }, 
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      
      setMessages([...messages, { senderId: me._id, recipientId: friend._id, content: newMessage, createdAt: new Date() }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!friend || !friend.username) {
    return <div className="no-friend-selected">Select a friend to start chatting</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img src={profileImg} alt="Avatar" className="avatar" />
        <div className="friend-name">{friend.username}</div>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <Message
            key={index}
            avatar={profileImg}
            name={message.senderId === me._id ? me.username : friend.username}
            message={message.content}
            time={new Date(message.createdAt).toLocaleString()}
            className={message.senderId === me._id ? 'me' : ''}
          />
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;

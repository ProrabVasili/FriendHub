import React, { useState } from 'react';
import AllFriends from './AllFriends';
import ChatWindow from './ChatWindow';
import './MessagePanel.css';

const MessagePanel = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
  };

  return (
    <div id="MessagePanel" className="message-panel">
      <div className="friends-list-panel">
        <AllFriends onSelectFriend={handleSelectFriend} />
      </div>
      <div className="chat-window-panel">
        {selectedFriend ? (
          <ChatWindow friend={selectedFriend} />
        ) : (
          <div className="no-friend-selected">Select a friend to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default MessagePanel;

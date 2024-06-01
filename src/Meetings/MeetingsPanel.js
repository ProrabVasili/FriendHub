import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MeetingsPanel.css'; 

const MeetingsPanel = () => {
  const [friends, setFriends] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/friends', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriends(response.data.friends);
    };

    const fetchMeetings = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/meetings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMeetings(response.data.meetings);
    };

    fetchFriends();
    fetchMeetings();
  }, []);

  const handleCreateMeeting = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/zoom/meetings',
        { meetingDate, meetingTime, friends: selectedFriends },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMeetings([...meetings, response.data]);
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const handleFriendChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedFriends([...selectedFriends, value]);
    } else {
      setSelectedFriends(selectedFriends.filter(friendId => friendId !== value));
    }
  };

  return (
    <div id="MeetingsContainer" className="meetings-container">
      <h1>Зустрічі</h1>
      <div id="calendar" className="calendar">
        {meetings.map(meeting => (
          <div key={meeting.meetingId}>
            <p>{meeting.meetingDate} {meeting.meetingTime}</p>
            <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">Join Meeting</a>
          </div>
        ))}
      </div>
      <div id="createMeetingPanel" className="create-meeting-panel">
        <h2>Створити Зустріч</h2>
        <form id="createMeetingForm" onSubmit={handleCreateMeeting}>
          <label htmlFor="meetingDate">Дата:</label>
          <input 
            type="date" 
            id="meetingDate" 
            name="meetingDate" 
            required 
            value={meetingDate} 
            onChange={(e) => setMeetingDate(e.target.value)} 
          />
          <label htmlFor="meetingTime">Час:</label>
          <input 
            type="time" 
            id="meetingTime" 
            name="meetingTime" 
            required 
            value={meetingTime} 
            onChange={(e) => setMeetingTime(e.target.value)} 
          />
          <label>Друзі:</label>
          {friends.map(friend => (
            <div key={friend._id}>
              <input 
                type="checkbox" 
                value={friend._id} 
                onChange={handleFriendChange} 
              />
              {friend.name}
            </div>
          ))}
          <button type="submit">Створити</button>
        </form>
      </div>
    </div>
  );
};

export default MeetingsPanel;

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDistance } = require('geolib');

const User = require('../models/User');
const Notification = require('../models/Notification');
const Friend = require('../models/Friend');
const Meeting = require('../models/Meeting');
const Message = require('../models/Message');

const authenticateToken = require('../middleware/authenticateToken');

const app = express();
const port = 5000;
const SECRET_KEY = '73E3AD6B9427AF25FFECA363F20A51E23C5F76D5F6DA377D11724D2B3808B5DA';
const clientId = 'zAXF5OLrSJK1hQx_ut4xbA'; 
const clientSecret = 'WQpe8HKI2IqM336JJlHp7YYrvYnvpTs6'; 

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://oleg:oleg@localhost:27017/admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.post('/api/signup', async (req, res) => {
  const { username, email, password, location } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'User with this username already exists.' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }
    }
    const newUser = new User({ username, email, password, avatar: null, location});
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ success: true, token, user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const friends = await Friend.find({ userId });
    const friendIds = friends.map(friend => friend.friendId);

    const excludedUserIds = [userId, ...friendIds];

    const users = await User.find({ _id: { $nin: excludedUserIds } }).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/interest_users', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const currentUser = await User.findById(userId);
    const currentUserLocation = {
      latitude: currentUser.location[0],
      longitude: currentUser.location[1],
    };


    const friends = await Friend.find({ userId });
    const friendIds = friends.map(friend => friend.friendId);

    const excludedUserIds = [userId, ...friendIds];

    const users = await User.find({ _id: { $nin: excludedUserIds } }).select('-password');

    const usersWithDistance = users.map(user => {
      const userLocation = {
        latitude: user.location[0],
        longitude: user.location[1],
      };
      const distance = getDistance(currentUserLocation, userLocation);
      return {
        ...user.toObject(),
        distance,
      };
    });

    usersWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(usersWithDistance);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/notifications', authenticateToken, async (req, res) => {
  const { userId, message } = req.body;
  const senderId = req.user.userId;
  const senderUsername = req.user.username;

  try {
    const recipient = await User.findById(userId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const notification = new Notification({
      recipientId: userId,
      senderId,
      senderUsername,
      message: `${senderUsername} ${message}`,
    });

    await notification.save();
    res.status(201).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/friends/connect', authenticateToken, async (req, res) => {
  const { notificationId } = req.body;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const existingFriend = await Friend.findOne({
      userId: req.user.userId,
      friendId: notification.senderId,
    });

    if (existingFriend) {
      return res.status(400).json({ message: 'You are already friends with this user' });
    }

    const friend1 = new Friend({
      userId: req.user.userId,
      friendId: notification.senderId,
    });
    const friend2 = new Friend({
      userId: notification.senderId,
      friendId: req.user.userId,
    });

    await friend1.save();
    await friend2.save();

    await Notification.create({
      recipientId: notification.senderId,
      senderId: req.user.userId,
      senderUsername: req.user.username,
      message: `${req.user.username} accepted your friend request.`,
    });

    await Notification.create({
      recipientId: req.user.userId,
      senderId: notification.senderId,
      senderUsername: notification.senderUsername,
      message: `You and ${notification.senderUsername} are now friends.`,
    });

    await Notification.deleteOne({ _id: notificationId });

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/friends/cancel', authenticateToken, async (req, res) => {
  const { notificationId } = req.body;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.create({
      recipientId: notification.senderId,
      senderId: req.user.userId,
      senderUsername: req.user.username,
      message: `${req.user.username} declined your friend request.`,
    });

    await Notification.deleteOne({ _id: notificationId });

    res.status(200).json({ message: 'Friend request declined' });
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/friends', authenticateToken, async (req, res) => {
  try {
    const friends = await Friend.find({
      $or: [
        { userId: req.user.userId },
        { friendId: req.user.userId }
      ]
    }).populate('friendId', 'username avatar');

    const uniqueFriends = [];
    const friendIds = new Set();

    friends.forEach(friend => {
      if (friend.userId.toString() === req.user.userId.toString() && !friendIds.has(friend.friendId.toString())) {
        uniqueFriends.push(friend);
        friendIds.add(friend.friendId.toString());
      } else if (friend.friendId.toString() === req.user.userId.toString() && !friendIds.has(friend.userId.toString())) {
        uniqueFriends.push(friend);
        friendIds.add(friend.userId.toString());
      }
    });

    res.status(200).json({ friends: uniqueFriends });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/users/search', async (req, res) => {
  const { name } = req.query;

  try {
    const users = await User.find({ username: new RegExp(name, 'i') }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.statu(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/meetings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const meetings = await Meeting.find({ userId }).populate('friends', 'username');

    res.json({ meetings });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/zoom/meetings', authenticateToken, async (req, res) => {
  const { meetingDate, meetingTime, friends } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user || !user.zoomToken) {
      return res.status(401).json({ message: 'Zoom token not found' });
    }

    const zoomToken = user.zoomToken;

    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: 'Meeting with friends',
        type: 1,
        start_time: `${meetingDate}T${meetingTime}`,
        duration: 60, 
      },
      {
        headers: {
          Authorization: `Bearer ${zoomToken}`,
        },
      }
    );

    const meeting = response.data;

    const newMeeting = new Meeting({
      userId,
      meetingId: meeting.id,
      meetingLink: meeting.join_url,
      meetingDate,
      meetingTime,
      friends,
    });

    await newMeeting.save();

    res.json(newMeeting);
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error creating Zoom meeting' });
  }
});


app.get('/api/zoom/authorize', (req, res) => {
  const redirectUri = 'http://localhost:5000/api/zoom/callback'; // Replace with your callback URL
  const authorizationUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  res.redirect(authorizationUrl);
});

app.get('/api/zoom/callback', async (req, res) => {

  const redirectUri = 'http://localhost:5000/api/zoom/callback';
  const code = req.query.code;

  try {
    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      },
      auth: {
        username: clientId,
        password: clientSecret,
      },
    });

    const { access_token } = response.data.access_token;

    const signupDetails = JSON.parse(req.cookies.signupDetails);
    const { username, email, password, location } = signupDetails;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      location,
      zoomToken: access_token,
    });

    await newUser.save();

    res.clearCookie('signupDetails');

    res.redirect('/main');
  } catch (error) {
    console.error('Error fetching Zoom token:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error fetching Zoom token' });
  }
});

app.get('/api/messages/:friendId', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { friendId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId: friendId },
        { senderId: friendId, recipientId: userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { recipientId, content } = req.body;

  try {
    const newMessage = new Message({
      senderId: userId,
      recipientId,
      content,
      createdAt: new Date()
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching current user information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

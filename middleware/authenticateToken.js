const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET_KEY = '73E3AD6B9427AF25FFECA363F20A51E23C5F76D5F6DA377D11724D2B3808B5DA';

const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.userId).select('username');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = { userId: decoded.userId, username: user.username };
    next();
  } catch (error) {
    console.error('Error authenticating token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;

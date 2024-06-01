import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Signup from './SignUp/SignUp';
import Main from './Main/Main';
import Interesting from './Interesting/Interesting';
import Messages from './Messages/Messages';
import Meetings from './Meetings/Meetings';
import Notifications from './Notifications/Notifications';
import Friends from './Friends/Friends';
import Profile from './Profile/Profile';
import Search from './Search/Search';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
        <Route path="/interesting" element={<PrivateRoute><Interesting /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/meetings" element={<PrivateRoute><Meetings /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/friends" element={<PrivateRoute><Friends /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </Router>
  </AuthProvider>
);

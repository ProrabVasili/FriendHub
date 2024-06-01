import React from 'react';
import { Link } from 'react-router-dom';
import './SidePanel.css'; 

const SidePanel = () => (
  <div className="sidenav">
    <p>FriendHub</p>
    <Link to="/main">Головна</Link>
    <Link to="/search">Пошук</Link>
    <Link to="/interesting">Цікаві люде</Link>
    <Link to="/messages">Повідомлення</Link>
    <Link to="/meetings">Зустрічі</Link>
    <Link to="/notifications">Сповіщення</Link>
    <Link to="/friends">Друзі</Link>
    <Link to="/profile">Профіль</Link>
  </div>
);

export default SidePanel;

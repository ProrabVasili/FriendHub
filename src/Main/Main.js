import React from 'react';
import SidePanel from '../SidePanel';
// import CentralPanel from './CentralPanel';
import PersonNav from './PersonNav';
import './Main.css'; 

const MainPage = () => (
  <div className="main-container">
    <SidePanel />
    <div className="central-container">
      {/* <CentralPanel /> */}
      <PersonNav />
    </div>
  </div>
);

export default MainPage;

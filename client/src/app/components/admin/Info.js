import React from 'react';
import './Info.css';

const Info = ({ title, content, icon }) => {
  return (
    <div className="info-card">
      <div className="info-icon-container">
        <img src={icon} alt="icon" className="info-icon" />
      </div>
      <div className="info-details">
        <label className="title">{title}</label>
        <span className="info-content">{content}</span>
      </div>
    </div>
  );
}

export default Info;

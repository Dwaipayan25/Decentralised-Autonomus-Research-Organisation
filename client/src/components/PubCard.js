import React from 'react';
import './PubCard.css';

const Card = ({ address, description, fileLink, time }) => {
  return (
    <div className="card1">
      <div className="address">Owner: {address}</div>
      <div className="description">Description: {description}</div>
      <a href={fileLink} className="file-link" target="_blank" rel="noopener noreferrer">View File</a>
      <div className="time">{time}</div>
    </div>
  );
};

export default Card;

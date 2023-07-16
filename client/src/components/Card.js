import React from 'react';
import './Card.css';
import { Link } from "react-router-dom";

const Card = ({ key, title, description, ownerAddress,setid }) => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="card-info">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <p className="card-owner">{ownerAddress}</p>
        </div>
        <div className="card-actions">
          <button className="card-button" >View More</button>
          <button className="card-button">Contribute</button>
        </div>
      </div>
    </div>
  );
};

export default Card;

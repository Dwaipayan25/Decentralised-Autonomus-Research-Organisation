import React from 'react';
import './MessageCard.css'; // CSS file for styling

const MessageCard = ({ accountNumber, projectId, description, timestamp }) => {
  return (
    <div className="message-card">
      <div className="field">
        <span className="label">Account Number:</span>
        <span className="value">{accountNumber}</span>
      </div>
      <div className="field">
        <span className="label">Project ID:</span>
        <span className="value">{projectId}</span>
      </div>
      <div className="field">
        <span className="label">Description:</span>
        <span className="value">{description}</span>
      </div>
      <div className="field">
        <span className="label">Timestamp:</span>
        <span className="value">{timestamp}</span>
      </div>
    </div>
  );
};

export default MessageCard;

import React from 'react';

const LearningCard = ({ title, type, description, action, size }) => {
  if (!title) return null; // Fallback to prevent white screen if props are missing

  if (size === 'small') {
    return (
      <div className="learning-card-small">
        <p style={{color: '#3b82f6', fontSize: '10px', margin: 0}}>🎧 PODCAST</p>
        <h5 style={{color: 'white', margin: '10px 0', fontSize: '13px'}}>{title}</h5>
        <button className="small-play-btn">{action || 'Play'}</button>
      </div>
    );
  }

  return (
    <div className="learning-card">
      <div className="learning-header"><span className="learning-type-tag">{type}</span></div>
      <div className="learning-body">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <button className="learning-action-btn">{action}</button>
    </div>
  );
};

export default LearningCard;
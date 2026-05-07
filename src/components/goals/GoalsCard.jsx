import React from 'react';
import Progress from './Progress';

const GoalsCard = ({ goal }) => {
  const percentage = Math.round((goal.current / goal.target) * 100);

  return (
    <div className="goal-card" style={{
      background: 'rgba(19, 31, 36, 0.5)',
      border: '1px solid #37464f',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '15px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <h4 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>{goal.title}</h4>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
            ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
          </span>
        </div>
        <span style={{ color: '#1cb0f6', fontWeight: 'bold' }}>{percentage}%</span>
      </div>
      
      {/* Pass individual goal to Progress for the mini bar */}
      <Progress goals={[goal]} isMini={true} />
    </div>
  );
};

export default GoalsCard;
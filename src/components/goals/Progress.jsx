import React from 'react';

const Progress = ({ goals, isMini = false }) => {
  const totalCurrent = goals.reduce((sum, g) => sum + parseFloat(g.current_amount), 0);
  const totalTarget = goals.reduce((sum, g) => sum + parseFloat(g.target_amount), 0);
  const percentage = Math.min(Math.round((totalCurrent / totalTarget) * 100), 100);
  console.log(goals)

  return (
    <div style={{ width: '100%' }}>
      {!isMini && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
           <p style={{ color: '#94a3b8', fontSize: '0.7rem', letterSpacing: '2px' }}>TOTAL MISSION PROGRESS</p>
           <h1 style={{ fontSize: '3rem', color: 'white', margin: '10px 0' }}>{percentage}%</h1>
        </div>
      )}
      
      <div style={{
        width: '100%',
        height: isMini ? '6px' : '12px',
        background: '#131f24',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #37464f'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #1cb0f6, #60a5fa)',
          boxShadow: isMini ? 'none' : '0 0 15px rgba(28, 176, 246, 0.5)',
          transition: 'width 1s ease-in-out'
        }} />
      </div>
    </div>
  );
};

export default Progress;
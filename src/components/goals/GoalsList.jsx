import React from 'react';
import GoalsCard from './GoalsCard';

const GoalsList = ({ goals }) => {
  return (
    <div className="goals-list" style={{ width: '100%', marginTop: '20px' }}>
      <p style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '15px' }}>
        ACTIVE OBJECTIVES
      </p>
      {goals.map(goal => (
        <GoalsCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

export default GoalsList;
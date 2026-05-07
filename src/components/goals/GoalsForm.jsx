import React, { useState } from 'react';

const GoalsForm = ({ onAddGoal }) => {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !target) return;
    onAddGoal({ title, target: parseInt(target) });
    setTitle('');
    setTarget('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>+ INITIALIZE NEW OBJECTIVE</p>
      <input 
        placeholder="Objective Name" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        className="zenith-input" 
      />
      <input 
        type="number" 
        placeholder="Target Amount ($)" 
        value={target} 
        onChange={(e) => setTarget(e.target.value)}
        className="zenith-input" 
      />
      <button type="submit" className="zenith-button">DEPLOY OBJECTIVE</button>
    </form>
  );
};

export default GoalsForm;
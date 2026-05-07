import React, { useState } from 'react';

const SavingCard = ({ goal, onStash, onWithdraw, onUpdateGoal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(goal.title);
  const [tempTarget, setTempTarget] = useState(goal.target_amount);
  const [tempDate, setTempDate] = useState(goal.target_date || '2026-12-31');
  const [amount, setAmount] = useState('');

  const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);

  const handleSave = () => {
    onUpdateGoal(goal.id, { 
      title: tempTitle, 
      target: parseInt(goal.target_amount),
      lock_end_date: tempDate 
    });
    setIsEditing(false);
  };

  const inputStyle = {
    background: '#0a1014',
    border: '1px solid #37464f',
    borderRadius: '10px',
    padding: '10px',
    color: 'white',
    outline: 'none',
    fontSize: '0.85rem'
  };

  return (
    <div className="saving-card" style={{ 
      background: 'linear-gradient(145deg, #131f24 0%, #0a1014 100%)', 
      borderRadius: '24px', 
      padding: '28px', // Reduced padding for better proportions
      border: `1px solid ${isEditing ? '#1cb0f6' : 'rgba(28, 176, 246, 0.15)'}`,
      position: 'relative',
      width: '95%',
      maxWidth: '600px', // The "Sweet Spot" width
      boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
      transition: 'all 0.3s ease',
      margin: '0 auto'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          {isEditing ? (
            <input 
              value={tempTitle} 
              onChange={(e) => setTempTitle(e.target.value)}
              style={{ ...inputStyle, width: '85%', fontSize: '1.2rem', fontWeight: 'bold' }}
            />
          ) : (
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>{goal.title}</h2>
          )}
        </div>
        
        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          style={{ 
            background: isEditing ? '#1cb0f6' : 'rgba(255,255,255,0.05)', 
            color: 'white', border: 'none', borderRadius: '10px', padding: '8px 14px', 
            fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' 
          }}
        >
          {isEditing ? 'SAVE' : 'EDIT VAULT ✏️'}
        </button>
      </div>

      {/* Target & Year Stats */}
      <div style={{ display: 'flex', gap: '25px', marginBottom: '25px' }}>
        <div>
          <span style={{ textTransform: 'uppercase', fontSize: '0.65rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Target Goal</span>
          {isEditing ? (
            <input type="number" value={tempTarget} onChange={(e) => setTempTarget(e.target.value)} style={{ ...inputStyle, width: '90px', padding: '6px' }} />
          ) : <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600' }}>${goal.target_amount}</span>}
        </div>

        <div>
          <span style={{ textTransform: 'uppercase', fontSize: '0.65rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Release Year</span>
          {isEditing ? (
            <input type="date" value={tempDate} onChange={(e) => setTempDate(e.target.value)} style={{ ...inputStyle, padding: '6px' }} />
          ) : <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600' }}>{new Date(tempDate).getFullYear()}</span>}
        </div>
      </div>

      {/* Progress Section */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'flex-end' }}>
          <span style={{ fontWeight: '900', color: 'white', fontSize: '1.3rem' }}>${goal.current_amount}</span>
          <span style={{ color: goal.color || '#1cb0f6', fontWeight: 'bold', fontSize: '0.9rem' }}>{progress.toFixed(0)}%</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            background: goal.color || '#3b82f6', 
            transition: 'width 0.6s ease-out'
          }} />
        </div>
      </div>

      {/* Stash Input Area */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        background: 'rgba(0,0,0,0.2)', 
        padding: '8px', 
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.03)' 
      }}>
        <input 
          type="number" 
          placeholder="Enter amount..." 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ ...inputStyle, flex: 1, background: 'transparent', border: 'none' }}
        />
        <button 
          onClick={() => { onStash(goal.id, amount); setAmount(''); }}
          style={{ 
            background: goal.color || '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            padding: '0 25px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          STASH
        </button>
      </div>

      {goal.mode === 'locked' && !isEditing && (
        <div style={{ 
          marginTop: '18px', 
          fontSize: '0.65rem', 
          color: '#f59e0b', 
          fontWeight: 'bold', 
          letterSpacing: '1px',
          textTransform: 'uppercase',
          opacity: 0.8
        }}>
          🔒 Vault Sealed until {tempDate}
        </div>
      )}
    </div>
  );
};

export default SavingCard;
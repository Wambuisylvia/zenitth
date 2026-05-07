import React from 'react';

const LearningCard = ({ type, title, description, action }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }}>
    <span style={{ 
      color: '#3b82f6', 
      fontSize: '11px', 
      fontWeight: '700', 
      letterSpacing: '1px' 
    }}>
      {type}
    </span>
    <h3 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>{title}</h3>
    <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
      {description}
    </p>
    <button style={{
      alignSelf: 'flex-start',
      padding: '8px 16px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer'
    }}>
      {action}
    </button>
  </div>
);
const PodcastCard = ({ title, expert, duration, description }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '24px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column'
  }}>
    {/* Top Row: Type and Duration */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
      <span style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>PODCAST</span>
      <span style={{ color: '#64748b', fontSize: '11px' }}>⏱ {duration}</span>
    </div>

    <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 4px 0' }}>{title}</h3>
    <p style={{ color: '#3b82f6', fontSize: '13px', margin: '0 0 12px 0', fontWeight: '500' }}>w/ {expert}</p>
    
    <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
      {description}
    </p>

    {/* Play Button Row */}
    <button style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: '#3b82f6', // Brighter blue for the "Action"
      color: '#fff',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    }}>
      <span>▶</span> Listen Now
    </button>
  </div>
);

const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
  },
  typeTag: {
    color: '#3b82f6', // Bright blue to match your glow
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '10px',
    display: 'block'
  },
  title: {
    color: '#ffffff',
    fontSize: '20px',
    margin: '0 0 10px 0',
    fontWeight: '600'
  },
  description: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 20px 0'
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s'
  }
};

export default LearningCard;
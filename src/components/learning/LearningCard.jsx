import React from 'react';

const LearningCard = ({ type, title, description, action }) => (
  <div style={styles.card}>
    <span style={styles.typeTag}>
      {type}
    </span>
    <h3 style={styles.title}>{title}</h3>
    <p style={styles.description}>
      {description}
    </p>
    <button style={styles.button}>
      {action}
    </button>
  </div>
);

const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'transform 0.2s ease',
  },
  typeTag: {
    color: '#3b82f6',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: '18px',
    margin: 0,
    fontWeight: '600'
  },
  description: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: 0
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: '0.3s'
  }
};

export default LearningCard;
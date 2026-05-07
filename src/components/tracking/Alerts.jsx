import React from 'react';

const Alerts = () => {
  // Data based on your "Final Alerts Layout" screenshot
  const alerts = [
    { id: 1, icon: '⚠️', text: "You haven't saved today", type: 'reminder' },
    { id: 2, icon: '🎯', text: "Laptop Goal is 80% complete", type: 'progress' },
    { id: 3, icon: '📝', text: "Added KES 500", type: 'activity' },
    { id: 4, icon: '⚠️', text: "Goal deadline approaching", type: 'urgent' },
  ];

  return (
    <div style={styles.container}>
      {/* Header matching your screenshot */}
      <div style={styles.header}>
        <span style={styles.bell}>🔔</span>
        <h2 style={styles.title}>Activity & Alerts</h2>
      </div>

      <div style={styles.list}>
        {alerts.map((item) => (
          <div key={item.id} style={styles.alertItem}>
            <span style={styles.icon}>{item.icon}</span>
            <span style={styles.text}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Subtle motivational footer based on the "Why this works" section */}
      <div style={styles.footer}>
        Keep going! You're staying consistent.🌺
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '90%',
    maxWidth: '500px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // High-end glass look
    borderRadius: '24px',
    padding: '24px',
    margin: '20px auto',
    fontFamily: 'sans-serif',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '12px',
  },
  bell: { fontSize: '20px', marginRight: '10px' },
  title: { 
    color: '#fff', 
    fontSize: '18px', 
    margin: 0, 
    fontWeight: '600' 
  },
  list: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '16px' 
  },
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 0',
  },
  icon: {
    fontSize: '18px',
    marginRight: '12px',
    width: '24px',
    textAlign: 'center',
  },
  text: {
    color: '#ccc',
    fontSize: '15px',
    letterSpacing: '0.3px',
  },
  footer: {
    marginTop: '24px',
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic'
  }
};

export default Alerts;
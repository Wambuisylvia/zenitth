import React from 'react';


const TrackingPulse = () => {
  // Data pulled from your "Recent Activity Updates" and "Final Alerts Layout"
  const trackingData = [
    { id: 1, icon: '📝', text: "Added KES 500", type: 'activity' },
    { id: 2, icon: '📝', text: "Created Emergency Fund Goal", type: 'activity' },
    { id: 3, icon: '🎯', text: "Laptop Goal is 80% complete", type: 'progress' },
    { id: 4, icon: '⚠️', text: "Goal deadline approaching", type: 'alert' }
  ];

  return (
    <div style={styles.container}>
      {/* Header based on your "Activity & Alerts" layout */}
      <div style={styles.header}>
        <span style={styles.pulseIcon}>📉</span>
        <h2 style={styles.title}>Live Tracking</h2>
      </div>

      <div style={styles.list}>
        {trackingData.map((item) => (
          <div key={item.id} style={styles.trackItem}>
            <span style={styles.icon}>{item.icon}</span>
            <div style={styles.content}>
              <span style={styles.text}>{item.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Purpose: Makes the app feel active/live */}
      <div style={styles.footer}>
        <p style={styles.footerText}>Latest Actions🌏</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '90%',
    maxWidth: '500px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
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
  pulseIcon: { fontSize: '20px', marginRight: '10px' },
  title: { color: '#fff', fontSize: '18px', margin: 0, fontWeight: '600' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  trackItem: {
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
    textAlign: 'center',
  },
  footerText: {
    color: '#555',
    fontSize: '12px',
  }
};

export default TrackingPulse;
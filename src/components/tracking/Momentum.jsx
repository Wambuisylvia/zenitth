import React from 'react';

const Momentum = () => {
  const stats = {
    timesSaved: 4,
    activity: "High",
    lastSaved: "Today",
    status: "Consistent Saver"
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <span style={styles.fireEmoji}>🔥</span>
        <h2 style={styles.title}>Momentum</h2>
      </div>

      {/* Stats List */}
      <div style={styles.list}>
        <div style={styles.item}>
          <span style={styles.label}>Weekly Savings</span>
          <span style={styles.value}>{stats.timesSaved} times</span>
        </div>
        
        <div style={styles.item}>
          <span style={styles.label}>Activity Level</span>
          <span style={styles.value}>{stats.activity}</span>
        </div>

        <div style={styles.item}>
          <span style={styles.label}>Last Active</span>
          <span style={styles.value}>{stats.lastSaved}</span>
        </div>
      </div>

      {/* Achievement Badge */}
      <div style={styles.footer}>
        <div style={styles.badge}>
          🏆 {stats.status}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '90%',           // Makes it wide like the screenshot
    maxWidth: '500px',      // Keeps it from getting too huge on desktop
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle glass look
    borderRadius: '24px',
    padding: '24px',
    margin: '20px auto',    // Centers it in the middle
    fontFamily: 'sans-serif',
    border: '1px solid rgba(255, 255, 255, 0.1)', // Soft edge
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  fireEmoji: {
    fontSize: '24px',
    marginRight: '10px'
  },
  title: {
    color: '#fff',
    fontSize: '22px',
    margin: 0,
    fontWeight: '600',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between', // Pushes label left and value right
    alignItems: 'center',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  label: {
    color: '#888',
    fontSize: '14px',
  },
  value: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
  },
  footer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)', // Faint gold glow
    color: '#FFD700',
    padding: '8px 16px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 'bold',
  }
};

export default Momentum;
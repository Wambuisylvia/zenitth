import React from 'react';

const Milestones = () => {
  // Data pulled directly from your "Example Milestones UI"
  const milestoneList = [
    { id: 1, text: "Reached 25% of Laptop Goal", completed: true },
    { id: 2, text: "First Savings Added", completed: true },
    { id: 3, text: "Completed Emergency Fund Goal", completed: true },
    { id: 4, text: "Saved 5 Times This Week", completed: true },
  ];

  return (
    <div style={styles.container}>
      {/* Header with Trophy Icon */}
      <div style={styles.header}>
        <span style={styles.trophy}>🏆</span>
        <h2 style={styles.title}>Milestones</h2>
      </div>

      <div style={styles.list}>
        {milestoneList.map((item) => (
          <div key={item.id} style={styles.milestoneItem}>
            <span style={styles.check}>✔</span>
            <span style={styles.text}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Motivational Footer */}
      <div style={styles.footer}>
        <p>Milestones make saving exciting! 💴🎉</p>
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
    marginBottom: '24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '12px',
  },
  trophy: { fontSize: '22px', marginRight: '12px' },
  title: { 
    color: '#fff', 
    fontSize: '20px', 
    margin: 0, 
    fontWeight: '600' 
  },
  list: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '18px' 
  },
  milestoneItem: {
    display: 'flex',
    alignItems: 'center',
  },
  check: {
    color: '#4dff88', // Success green
    fontSize: '18px',
    marginRight: '15px',
    fontWeight: 'bold',
  },
  text: {
    color: '#eee',
    fontSize: '15px',
    fontWeight: '400',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center',
    color: '#888',
    fontSize: '13px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '15px',
  }
};

export default Milestones;
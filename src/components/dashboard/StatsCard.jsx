// components/dashboard/StatsCard.jsx

export default function StatsCard({ title, value, icon }) {
  return (
    <div style={styles.card}>
      <div style={styles.icon}>{icon}</div>
      <div>
        <h4 style={styles.title}>{title}</h4>
        <p style={styles.value}>{value}</p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "#1e293b",
    borderRadius: "12px",
    color: "white",
    width: "200px",
  },
  icon: {
    fontSize: "24px",
  },
  title: {
    margin: 0,
    fontSize: "14px",
    color: "#94a3b8",
  },
  value: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "bold",
  },
};
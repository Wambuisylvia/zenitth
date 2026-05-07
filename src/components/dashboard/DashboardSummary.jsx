import React from 'react';

export default function DashboardSummary({ name, progress, lessons }) {
  return (
    <div className="summary-container shadow-sm">
      <h2 className="summary-title">Welcome back, {name} 👋</h2>

      <div className="summary-stats">
        <p className="summary-text">
          You're <span className="highlight-green">{progress}%</span> towards your goal
        </p>

        <p className="summary-text">
          You’ve completed <span className="highlight-blue">{lessons}</span> lessons this week
        </p>
      </div>
    </div>
  );
}
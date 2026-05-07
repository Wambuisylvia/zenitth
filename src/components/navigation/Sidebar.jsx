import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">Zenith</div>
      <nav className="sidebar-nav">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={activeTab === 'dashboard' ? 'active' : ''}
        >
          📊 Dashboard
        </button>
        
        <button 
          onClick={() => setActiveTab('goals')} 
          className={activeTab === 'goals' ? 'active' : ''}
        >
          🎯 Goals Hub
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
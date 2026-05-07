import React from 'react';

const QuickStashModal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  goals, 
  stashAmount, 
  setStashAmount, 
  selectedGoalId, 
  setSelectedGoalId, 
  handleQuickStash 
}) => {
  
  // If the modal isn't supposed to be open, we return null (renders nothing)
  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
      {/* stopPropagation prevents the modal from closing when clicking inside the form */}
      <div className="zu-glass-form modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="brand-name">QUICK STASH</h2>
        <p className="user-label">Fuel your future self.</p>
        
        <form onSubmit={handleQuickStash}>
          <div className="form-group">
            <label>Amount ($)</label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={stashAmount} 
              onChange={(e) => setStashAmount(e.target.value)} 
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label>Select Objective</label>
            <select 
              value={selectedGoalId} 
              onChange={(e) => setSelectedGoalId(e.target.value)}
            >
              {goals.map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit" className="enter-btn">DEPOSIT</button>
            <button 
              type="button" 
              className="cancel-link" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickStashModal;
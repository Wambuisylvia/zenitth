import React, { useState, useEffect, useRef } from 'react';

const ZeniBot = ({ totalSaved = 0, goals = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hi Sylvia! Zeni here. Ready to reach your next summit?` }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- CELEBRATION TRIGGER ---
  useEffect(() => {
    const completedGoal = goals.find(g => g.current >= g.target);
    if (completedGoal) {
      const msg = `🎉 ZENITH MOMENT! Sylvia, you've reached 100% of your "${completedGoal.title}" goal! Elite momentum! 🚀`;
      if (messages[messages.length - 1].text !== msg) {
        setIsOpen(true); // Pop open the bubble on win
        setMessages(prev => [...prev, { role: 'ai', text: msg }]);
      }
    }
  }, [totalSaved, goals]);

  return (
    <div style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 1000 }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#1cb0f6', border: 'none', cursor: 'pointer', fontSize: '1.5rem', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}
        >
          🤖
        </button>
      ) : (
        <div style={{ width: '320px', height: '450px', background: '#131f24', border: '1px solid #37464f', borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
          <div style={{ padding: '15px', background: '#1c2b33', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>ZENI AI</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end',
                background: m.role === 'ai' ? '#37464f' : '#1cb0f6',
                padding: '10px 14px', borderRadius: '12px', color: 'white', fontSize: '0.85rem' 
              }}>{m.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ZeniBot
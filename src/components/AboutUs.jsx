import React from 'react';

const AboutUs = () => {
    const sectionStyle = {
        padding: '40px',
        maxWidth: '1100px',
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
        color: '#ffffff'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '30px'
    };

    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '25px',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)'
    };

    const highlightText = {
        color: '#4db8ff',
        marginBottom: '10px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    return (
        <div style={sectionStyle}>
            <header style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Finance for the <span style={{ color: '#4db8ff' }}>modern era.</span></h1>
                <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: '1.6' }}>
                    We believe sophisticated financial tools shouldn't be reserved for the elite. We're bridging the gap 
                    between complex market data and everyday decision-making.
                </p>
            </header>

            <div style={gridStyle}>
                {/* Security Card */}
                <div style={cardStyle}>
                    <div style={highlightText}>🛡️ Security First</div>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', opacity: 0.9 }}>
                        Your trust is our most valuable asset. We employ AES-256 encryption to ensure your data and assets stay exactly where they belong.
                    </p>
                </div>

                {/* Clarity Card */}
                <div style={cardStyle}>
                    <div style={highlightText}>💎 Total Clarity</div>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', opacity: 0.9 }}>
                        No hidden fees or "black box" algorithms. We believe you should always know exactly how your money is moving.
                    </p>
                </div>

                {/* Growth Card */}
                <div style={cardStyle}>
                    <div style={highlightText}>🚀 Inclusive Growth</div>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', opacity: 0.9 }}>
                        From automated budgeting to micro-investing, we bring the latest fintech to everyone, regardless of balance.
                    </p>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
    <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#4db8ff' }}>Frequently Asked Questions</h3>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* FAQ Item 1 */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '15px', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Is my data safe?</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', opacity: 0.7 }}>
                Absolutely. We use bank-grade AES-256 encryption and multi-factor authentication to ensure your financial information is never compromised.
            </p>
        </div>

        {/* FAQ Item 2 */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '15px', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>How do you make money?</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', opacity: 0.7 }}>
                We believe in transparency. Zenith earns a small margin from our partner institutions and premium subscription tiers—never by selling your data.
            </p>
        </div>

        {/* FAQ Item 3 */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '15px', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Are there any hidden fees?</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', opacity: 0.7 }}>
                No hidden costs. Any fees associated with specific transactions are clearly displayed before you confirm any action.
            </p>
        </div>

        {/* FAQ Item 4 */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '15px', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Can I withdraw at any time?</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', opacity: 0.7 }}>
                Yes. Your liquidity is a priority. Most withdrawals are processed within 1-3 business days depending on your linked bank account.
            </p>
        </div>

    </div>
</div>

 

            <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', opacity: 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <strong>Regulated & Compliant</strong>
                        <p>Strict adherence to national financial regulations and accountability standards.</p>
                    </div>
                    <div>
                        <strong>Safe & Sound</strong>
                        <p>Funds protected via FDIC-insured partner institutions.</p>
                    </div>
                </div>
                <p style={{ marginTop: '20px' }}>
                    Zenith is a financial app, not a bank. it destined to help you save learn and build tommorow.
                </p>
            </footer>
        </div>
    );
};

export default AboutUs;
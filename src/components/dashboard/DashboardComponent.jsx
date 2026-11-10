
// import ZeniBot from './../chat/ZeniBot';
import LearningCard from './../learning/LearningCard';
import TrackingPulse from './../tracking/TrackingPulse';
import SavingCard from './../savings/SavingCard';
import { useEffect, useState } from 'react';
import Progress from './../goals/Progress';
// import GoalsCard from './../goals/GoalsCard';
// import GoalsForm from './../goals/GoalsForm';
// import GoalsList from './../goals/GoalsList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Momentum from './../tracking/Momentum';
import Alerts from './../tracking/Alerts';
import Milestones from './../tracking/Milestones';
import ZeniBot from '../chat/ZenithBot';
import PodcastCard from '../learning/PodcastCard';
import UserProfile from '../auth/UserProfile';
import MpesaModal from '../learning/MpesaModal';
import AboutUs from '../AboutUs';


const DashboardComponent = () => {
    const [goalsView, setGoalsView] = useState('progress'); // Default view
    const updateGoal = (id, field, value) => {
        setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g));
    };
    const [splash, setSplash] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [devTab, setDevTab] = useState('podcasts');
    const [trackTab, setTrackTab] = useState('momentum');
    const [savingsFilter, setSavingsFilter] = useState('free');
    // const [history, setHistory] = useState([]);

    const [goal_title, setGoalTitle] = useState("")
    const [target_amount, setTargetAmount] = useState(0)
    const [initial_stash, setInitialStash] = useState(0)
    const [mode, setMode] = useState("")

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({})
    const [goals, setGoals] = useState([]);
    const [selectedGoalId, setSelectedGoalId] = useState(null);

    const [open, setOpen] = useState(false);


    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        // console.log(user)

        if (user && user !== null) {
            setIsLoggedIn(true)
            setUser(user)
        }
    }, [])

    // function to fetch goals
    const getGoals = async () => {
        // console.log(user.id)
        try {
            if (user) {
                const response = await axios.get(`https://sylviawambuu.alwaysdata.net/api/goals/${user.id}`)
                // console.log(response)
                if (response.status === 200) {
                    setGoals(response.data)
                }
            }
        } catch (error) {

        }
    }
    // console.log(goals)

    // useEffect to fetch goas from db
    useEffect(() => {
        getGoals()
    }, [user])


    // Add this effect alongside your existing useEffect
    useEffect(() => {
        // Simulate a 2-second loading period
        const timer = setTimeout(() => {
            setSplash(false);
        }, 2000);

        return () => clearTimeout(timer); // Cleanup timer on unmount
    });
    const navigate = useNavigate()

    const handleAddGoal = async (e) => {
        e.preventDefault();

        // setLoading(true)
        // setError("")
        // setSuccess("")

        const loadingToast = toast.loading("Please wait...");

        try {
            const goal_data = new FormData()

            goal_data.append("title", goal_title)
            goal_data.append("target_amount", target_amount)
            goal_data.append("user_id", user.id)
            goal_data.append("target_date", "")
            goal_data.append("initial_stash", initial_stash)
            goal_data.append("mode", mode)
            const response = await axios.post("https://sylviawambuu.alwaysdata.net/api/add_goal", goal_data)
            // console.log(response)
            if (response.status === 200) {

                toast.update(loadingToast, {
                    render: response.data.success,
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                    closeButton: false
                });
                getGoals()
            }
        } catch (error) {
            console.error("Connection failed:", error);
        }
    };

    const handleStash = async (goalId, amount) => {
        // setLoading(true)
        // console.log(goalId, amount)
        const loadingToast = toast.loading("Please wait...");
        try {
            const stash_data = new FormData()
            stash_data.append("amount", amount)
            stash_data.append("goal_id", goalId)

            const response = await axios.post('https://sylviawambuu.alwaysdata.net/api/stash', stash_data);
            if (response.status === 200) {
                toast.update(loadingToast, {
                    render: response.data.success,
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                    closeButton: false
                });
                getGoals()
            }

        } catch (error) {
            console.error("Stash failed:", error);
        }
    };



    const handleLogout = () => {
        localStorage.removeItem("user")
        navigate("/login")
    }

    const handleWithdraw = (goalId, amount) => {
        const goal = goals.find(g => g.id === goalId);
        const today = new Date().toISOString().split('T')[0];
        const isActuallyLocked = goal.mode === 'locked' && goal.lock_end_date > today;
        if (isActuallyLocked && !goal.withdrawal_allowed) {
            alert(`🚫 Mode: LOCKED. This vault is sealed until ${goal.lock_end_date}.`);
            return;
        }
        // setGoals(goals.map(g => g.id === goalId ? { ...g, current: Math.max(0, g.current - parseInt(amount)) } : g));
    };

    const filteredGoals = goals.filter(goal => {
        // const today = new Date().toISOString().split('T')[0];
        const isLocked = goal.mode === 'locked';// && goal.lock_end_date > today;
        if (savingsFilter === 'locked') return isLocked;
        if (savingsFilter === 'free') return !isLocked;
        return true;
    });

    const activeStyle = { background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderLeft: '4px solid #3b82f6', paddingLeft: '20px', fontWeight: 'bold' };
    const handleUpdateGoal = (goalId, newData) => {
        console.log("Updating goal:", goalId, newData);
        // Add your logic here to update the state or call an API
    };


    if (splash) {
        return (
            <div style={{ height: '100vh', background: '#040b16', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <img src="/splash.jpg" alt="Zenith Splash" style={{ width: 'auto', height: '85vh', maxWidth: '100vw', objectFit: 'contain', animation: 'pulseFade 3s ease-in-out infinite' }} />
                <p style={{ color: '#1cb0f6', marginTop: '-40px', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: 'bold', opacity: 0.6 }}>INITIALIZING VAULT...</p>
            </div>
        );
    }

    if (!isLoggedIn) return navigate("/login");
    return (
        <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: '#0a1014' }}>
            <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', padding: '30px 20px', justifyContent: 'space-between', height: '100vh', background: '#131f24', position: 'sticky', top: 0 }}
            >
                <div>
                    <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                        <div className="profile-icon" style={{ width: '32px', height: '32px', fontSize: '0.9rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#3b82f6', color: 'white' }}>{user ? user.first_name?.[0].toUpperCase() : "Z"}</div>
                        <div className="profile-info">
                            <p className="profile-name" style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: 'white' }}>{user.first_name} {user.last_name}</p>
                            <span className="profile-status" style={{ fontSize: '0.75rem', opacity: 0.7, color: '#94a3b8' }}>Zenith Pro</span>
                        </div>
                    </div>
                    <div className="brand" style={{ margin: '20px 0 40px 0', fontSize: '1.8rem', fontWeight: '900', letterSpacing: '4px', color: 'white' }}>ZENITH </div>
                    <nav className="nav-links" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button style={activeTab === 'dashboard' ? activeStyle : {}} onClick={() => setActiveTab('dashboard')}>Dashboard📊</button>
                        <button style={activeTab === 'savings' ? activeStyle : {}} onClick={() => setActiveTab('savings')}>Savings🐷</button>
                        <button style={activeTab === 'goals' ? activeStyle : {}} onClick={() => setActiveTab('goals')}>Goals & Progress🎯 </button>
                        <button style={activeTab === 'tracking' ? activeStyle : {}} onClick={() => setActiveTab('tracking')}>Tracking Pulse📈</button>
                        <button style={activeTab === 'personal' ? activeStyle : {}} onClick={() => setActiveTab('personal')}>Financial Learning🏦</button>
                         <button style={activeTab === 'about us' ? activeStyle : {}} onClick={() => setActiveTab('about')}>AboutUs📜</button>

                        <button style={activeTab === 'zeni' ? activeStyle : { color: '#1cb0f6', fontWeight: 'bold', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: '10px 0' }} onClick={() => setActiveTab('zeni')}>💬 Zeni AI Coach</button>
                        
                    </nav>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={footerItemStyle} onClick={() => setActiveTab('profile')}><span style={iconStyle}>👤</span> Profile</div>
                    {/* <div style={footerItemStyle}><span style={iconStyle}>⚙️</span> Settings</div> */}
                    <div style={footerItemStyle} onClick={() => setActiveTab('zeni')}><span style={iconStyle}>❓</span> Help</div>
                    <button onClick={handleLogout} style={{ marginTop: '10px', marginBottom: '20px', color: '#ef4444', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', paddingLeft: '0', fontSize: '0.9rem', fontWeight: 'bold' }}>Logout 🔒</button>
                </div>
            </aside>

            <main className="main-content" style={{ flex: 1, padding: '40px' }}>

                <ToastContainer
                    position="top-center"
                    theme="dark"
                    toastStyle={{
                        background: "#1b2730",
                        color: "white",
                        borderRadius: "14px",
                        fontSize: "0.9rem",
                        backdropFilter: "blur(10px)"
                    }}
                />

                {activeTab === 'dashboard' && (
                    <div className="dashboard-view">

                        {/* TOP STATS */}

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                                gap: '20px'
                            }}
                        >

                            {/* SAVINGS CARD */}
                            <div style={styles.gradientCardBlue}>

                                <div style={styles.cardTop}>

                                    <div>
                                        <p style={styles.cardLabel}>
                                            Total Savings
                                        </p>

                                        <h1 style={styles.cardValue}>
                                            $
                                            {goals
                                                .reduce(
                                                    (a, b) =>
                                                        a +
                                                        parseFloat(
                                                            b.current_amount
                                                        ),
                                                    0
                                                )
                                                .toLocaleString()}
                                        </h1>
                                    </div>

                                    <div style={styles.iconWrapper}>
                                        💰
                                    </div>

                                </div>

                                <div style={styles.progressSection}>
                                    <div style={styles.progressBar}>
                                        <div
                                            style={{
                                                ...styles.progressFill,
                                                width: '72%'
                                            }}
                                        />
                                    </div>

                                    <span style={styles.progressText}>
                                        72% monthly target achieved
                                    </span>
                                </div>

                            </div>

                            {/* GOALS CARD */}
                            <div style={styles.gradientCardPurple}>

                                <div style={styles.cardTop}>

                                    <div>
                                        <p style={styles.cardLabel}>
                                            Active Goals
                                        </p>

                                        <h1 style={styles.cardValue}>
                                            {goals.length}
                                        </h1>
                                    </div>

                                    <div style={styles.iconWrapper}>
                                        🎯
                                    </div>

                                </div>

                                <p style={styles.cardDescription}>
                                    Stay focused on your savings targets and
                                    track milestones.
                                </p>

                            </div>

                            {/* TRACKING CARD */}
                            <div style={styles.gradientCardGreen}>

                                <div style={styles.cardTop}>

                                    <div>
                                        <p style={styles.cardLabel}>
                                            Spending Tracking
                                        </p>

                                        <h1 style={styles.cardValue}>
                                            Healthy
                                        </h1>
                                    </div>

                                    <div style={styles.iconWrapper}>
                                        📊
                                    </div>

                                </div>

                                <p style={styles.cardDescription}>
                                    Weekly spending remains within your
                                    recommended budget.
                                </p>

                            </div>

                            {/* PERSONAL DEVELOPMENT */}
                            <div style={styles.gradientCardOrange}>

                                <div style={styles.cardTop}>

                                    <div>
                                        <p style={styles.cardLabel}>
                                            Financial Growth
                                        </p>

                                        <h1 style={styles.cardValue}>
                                            Level 4
                                        </h1>
                                    </div>

                                    <div style={styles.iconWrapper}>
                                        🚀
                                    </div>

                                </div>

                                <p style={styles.cardDescription}>
                                    You're building stronger financial habits
                                    consistently.
                                </p>

                            </div>

                        </div>

                        {/* QUICK ACTIONS */}
                        <div
                            style={{
                                marginTop: '32px'
                            }}
                        >

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '20px'
                                }}
                            >

                                <h2
                                    style={{
                                        color: '#fff',
                                        margin: 0,
                                        fontSize: '24px',
                                        fontWeight: '700'
                                    }}
                                >
                                    Quick Actions
                                </h2>

                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        'repeat(auto-fit, minmax(260px, 1fr))',
                                    gap: '20px'
                                }}
                            >

                                {/* QUICK DEPOSIT */}
                                <div style={styles.gradientCardBlue}>

                                    <div style={styles.cardTop}>

                                        <div>

                                            <p style={styles.cardLabel}>
                                                Savings Deposit
                                            </p>

                                            <h1 style={styles.cardValue}>
                                                Add Goal
                                            </h1>

                                        </div>

                                        <div style={styles.iconWrapper}>
                                            💳
                                        </div>

                                    </div>

                                    <p style={styles.cardDescription}>
                                        Instantly add funds to your active savings
                                        goals and grow your balance faster.
                                    </p>

                                    <button style={styles.actionButton}
                                    onClick={()=>{
                                        setActiveTab('goals')
                                        setGoalsView('form')
                                    }}
                                    >
                                        Deposit Funds
                                    </button>

                                </div>

                                {/* LEARNING */}
                                <div style={styles.gradientCardGreen}>

                                    <div style={styles.cardTop}>

                                        <div>

                                            <p style={styles.cardLabel}>
                                                Financial Learning
                                            </p>

                                            <h1 style={styles.cardValue}>
                                                Smart Tips
                                            </h1>

                                        </div>

                                        <div style={styles.iconWrapper}>
                                            📚
                                        </div>

                                    </div>

                                    <p style={styles.cardDescription}>
                                        Improve budgeting skills and develop
                                        healthier financial habits daily.
                                    </p>

                                    <button style={styles.actionButton}
                                    onClick={()=>{
                                        setActiveTab('personal')
                                    }}>
                                        Start Learning
                                    </button>

                                </div>

                                {/* GOAL BOOST */}
                                <div style={styles.gradientCardOrange}>

                                    <div style={styles.cardTop}>

                                        <div>

                                            <p style={styles.cardLabel}>
                                                Goal Booster
                                            </p>

                                            <h1 style={styles.cardValue}>
                                                Progress
                                            </h1>

                                        </div>

                                        <div style={styles.iconWrapper}>
                                            🚀
                                        </div>

                                    </div>

                                    <p style={styles.cardDescription}>
                                        Boost your savings goals with automatic
                                        contributions and reminders.
                                    </p>

                                    <button style={styles.actionButton}
                                    onClick={()=>{
                                        setActiveTab('goals')
                                        setGoalsView('progress')
                                    }}>
                                        Boost Goals
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                )}

                {activeTab === 'savings' && (
                    <div className="savings-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '40px' }}>
                            <p style={{ margin: 0, color: '#1cb0f6', fontSize: '0.65rem', letterSpacing: '6px', fontWeight: '300', textTransform: 'uppercase', opacity: 0.6 }}>Authorized Access • Sylvia</p>
                            <div style={{ width: '40px', height: '2px', background: '#1cb0f6', margin: '15px auto', borderRadius: '2px', boxShadow: '0 0 10px #1cb0f6' }} />
                            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '1px', margin: 0, color: 'white' }}>OBJECTIVE CENTRE</h1>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: '#4b5563', letterSpacing: '1px' }}>SYSTEM STATUS: <span style={{ color: '#10b981' }}>OPTIMIZED</span></p>
                        </div>
                        <div className="mini-nav-bar" style={{ display: 'flex', gap: '12px', background: 'rgba(19, 31, 36, 0.8)', padding: '10px 20px', borderRadius: '24px', marginBottom: '50px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                            <button className={savingsFilter === 'free' ? 'mini-link active' : 'mini-link'} onClick={() => setSavingsFilter('free')}>🔓 Free</button>
                            <button className={savingsFilter === 'locked' ? 'mini-link active' : 'mini-link'} onClick={() => setSavingsFilter('locked')}>🔒 Locked</button>
                            {/* <button className="mini-link" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid #3b82f6' }} onClick={() => handleStash(goals[0]?.id, 100)}>⚡ Quick Stash (+$100)</button> */}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '30px', padding: '0 20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 700px))', gap: '40px', width: '100%', justifyContent: 'center' }}>
                                {filteredGoals.map(goal => <SavingCard key={goal.id} goal={goal} onStash={handleStash} onWithdraw={handleWithdraw} onUpdateGoal={handleUpdateGoal} />)}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'goals' && (
                    <div className="goals-view-wrapper" style={{ width: '100%' }}>
                        {/* CENTERED NAVBAR (Laser Style) */}
                        <nav className="goals-nav-laser" style={{ display: 'flex', justifyContent: 'center', gap: '40px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
                            {['progress', 'form', 'list'].map((id) => (
                                <button
                                    key={id}
                                    className={`laser-item ${goalsView === id ? 'active' : ''}`}
                                    onClick={() => setGoalsView(id)}
                                    style={{ background: 'none', border: 'none', color: goalsView === id ? 'white' : '#64748b', padding: '15px 0', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}
                                >
                                    {id === 'progress' ? 'Progress' : id === 'form' ? 'Goals Form' : 'Goals List'}
                                </button>
                            ))}
                        </nav>

                        {/* CONTENT AREA (Narrowed to 480px for better focus) */}
                        <div className="goals-content-centered" style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>

                            {/* 1. PROGRESS BAR */}
                            {goalsView === 'progress' && (
                                <div style={{ textAlign: 'center' }}>
                                    <Progress goals={goals} totalSaved={goals.reduce((a, b) => a + b.current_amount, 0)} totalTarget={goals.reduce((a, b) => a + b.target_amount, 0)} />
                                </div>
                            )}

                            {goalsView === 'form' && (
                                <div className="view-fade-in" style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1.2fr 1fr',
                                    gap: '40px',
                                    alignItems: 'center',
                                    maxWidth: '950px', // Scaled down from 1100px
                                    margin: '30px auto', // Reduced top margin
                                    padding: '0 20px'
                                }}>

                                    {/* LEFT SIDE: Mission Briefing (Resized) */}
                                    <div style={{ textAlign: 'left' }}>
                                        <p style={{ color: '#1cb0f6', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '3px', marginBottom: '10px' }}>
                                            NEW OBJECTIVE
                                        </p>

                                        <h2 style={{
                                            fontSize: '2.6rem', // Scaled down from 3.8rem
                                            fontWeight: '900',
                                            color: 'white',
                                            lineHeight: '1.1',
                                            marginBottom: '15px'
                                        }}>
                                            Let's Build Your <br />
                                            <span style={{ color: '#1cb0f6' }}>Financial Literacy.</span>
                                        </h2>

                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '30px', maxWidth: '400px' }}>
                                            Initialize your strategic objective below. Every stashed dollar is a step
                                            toward total financial command.
                                        </p>

                                        {/* MOTTO SECTION (Compact) */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                                🛡️ SAVE TODAY
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                                📚 LEARN TODAY
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                                🚀 BUILD TOMORROW
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT SIDE: Compact Command Box */}
                                    <div className="command-box-right" style={{
                                        background: '#1cb0f6',
                                        padding: '30px 35px', // Reduced padding
                                        borderRadius: '28px',
                                        boxShadow: '0 15px 30px rgba(28, 176, 246, 0.15)',
                                        width: '100%'
                                    }}>
                                        <p style={{ color: 'white', fontSize: '0.55rem', letterSpacing: '2px', marginBottom: '20px', fontWeight: 'bold', opacity: 0.9 }}>
                                            SYSTEM://INIT_OBJECTIVE
                                        </p>

                                        {/* Inputs with smaller vertical margins */}
                                        <form onSubmit={handleAddGoal}>                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ color: 'white', fontSize: '0.65rem', fontWeight: '900', display: 'block', marginBottom: '6px' }}>
                                                OBJECTIVE NAME
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Emergency Fund"
                                                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '0.9rem' }}
                                                onChange={(e) => setGoalTitle(e.target.value)}
                                            />
                                        </div>

                                            <div style={{ marginBottom: '15px' }}>
                                                <label style={{ color: 'white', fontSize: '0.65rem', fontWeight: '900', display: 'block', marginBottom: '6px' }}>
                                                    TARGET AMOUNT ($)
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="2000"
                                                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '0.9rem' }}
                                                    onChange={(e) => setTargetAmount(e.target.value)}
                                                />
                                            </div>

                                            <div style={{ marginBottom: '25px' }}>
                                                <label style={{ color: 'white', fontSize: '0.65rem', fontWeight: '900', display: 'block', marginBottom: '6px' }}>
                                                    INITIAL STASH ($)
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: 'white', fontSize: '0.9rem' }}

                                                    onChange={(e) => setInitialStash(e.target.value)}
                                                />
                                                <div style={{ marginBottom: '15px' }}>
                                                    <label style={{ color: 'white', fontSize: '0.65rem', fontWeight: '900', display: 'block', marginBottom: '6px' }}>
                                                        OBJECTIVE TYPE
                                                    </label>
                                                    <select
                                                        className="dark-select"
                                                        onChange={(e) => setMode(e.target.value)}
                                                    >
                                                        <option value="free">Free</option>
                                                        <option value="locked">Locked</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <button style={{
                                                width: '100%',
                                                padding: '14px',
                                                background: 'white',
                                                color: '#1cb0f6',
                                                border: 'none',
                                                borderRadius: '50px',
                                                fontWeight: '900',
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}>
                                                Deploy Objective
                                            </button>
                                        </form>
                                    </div>

                                </div>
                            )}

                            {/* GOALS LIST - OPTIMIZED 3-COLUMN GRID */}
                            {goalsView === 'list' && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '15px',
                                    padding: '10px',
                                    maxWidth: '1100px',
                                    margin: '0 auto',
                                    height: 'auto'
                                }}>



                                    {/* 2. DYNAMIC GOAL CARDS */}
                                    {goals.map((goal) => (
                                        <div key={goal.id} style={{
                                            background: '#0a0a0a',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(106, 17, 203, 0.4)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minHeight: '280px', // Reduced height
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                                        }}
                                            onClick={
                                                () => {
                                                    setGoalsView('card')
                                                    setSelectedGoalId(goal.id)
                                                }
                                            }
                                        >
                                            {/* Compact Purple Header */}
                                            <div style={{
                                                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                                                padding: '15px 20px',
                                                height: '100px', // Shorter header
                                                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center'
                                            }}>
                                                <h1 style={{ color: 'white', fontSize: '1.6rem', margin: 0 }}>${goal.target_amount.toLocaleString()}</h1>
                                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '1px' }}>OBJECTIVE</p>
                                            </div>

                                            {/* Content Section */}
                                            <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <input
                                                    type="text"
                                                    value={goal.title}
                                                    onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        background: 'rgba(255,255,255,0.05)',
                                                        border: '1px solid rgba(106, 17, 203, 0.2)',
                                                        borderRadius: '8px',
                                                        padding: '6px 12px',
                                                        color: 'white',
                                                        fontSize: '0.8rem',
                                                        outline: 'none'
                                                    }}
                                                />

                                                <div style={{ background: 'rgba(106, 17, 203, 0.05)', borderRadius: '8px', padding: '8px' }}>
                                                    <p style={{ color: '#6a11cb', fontSize: '0.55rem', fontWeight: 'bold', marginBottom: '2px' }}>CURRENT STASH</p>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <span style={{ color: 'white', fontSize: '0.8rem', marginRight: '4px' }}>$</span>
                                                        <input
                                                            type="number"
                                                            value={goal.current_amount}
                                                            onChange={(e) => updateGoal(goal.id, 'current_amount', parseInt(e.target.value) || 0)}
                                                            style={{ background: 'none', border: 'none', color: 'white', fontWeight: 'bold', width: '100%', outline: 'none', fontSize: '0.9rem' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div style={{ marginTop: 'auto' }}>
                                                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '10px', overflow: 'hidden', marginBottom: '5px' }}>
                                                        <div style={{
                                                            width: `${Math.min(100, (goal.current_amount / goal.target_amount) * 100)}%`,
                                                            height: '100%',
                                                            background: '#6a11cb',
                                                            boxShadow: '0 0 8px #6a11cb'
                                                        }} />
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <p style={{ color: '#64748b', fontSize: '0.6rem', margin: 0 }}>PROGRESS</p>
                                                        <p style={{ color: 'white', fontSize: '0.7rem', fontWeight: 'bold', margin: 0 }}>
                                                            {Math.round((goal.current_amount / goal.target_amount) * 100)}%
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* 4. GOALS CARD (Focus Mode) - FULLY DYNAMIC */}
                            {goalsView === 'card' && (
                                <div className="view-fade-in" style={{ maxWidth: '450px', margin: '20px auto' }}>
                                    {(() => {
                                        // LOGIC: This finds the goal you clicked in the list. 
                                        // If you haven't clicked one yet, it defaults to the first goal in your array.
                                        const activeGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

                                        if (!activeGoal) return <p style={{ color: 'white', textAlign: 'center' }}>No Objectives Found.</p>;

                                        const percent = Math.round((activeGoal.current_amount / activeGoal.target_amount) * 100);

                                        return (
                                            <div style={{
                                                background: 'linear-gradient(145deg, #131f24, #0a1014)',
                                                padding: '40px',
                                                borderRadius: '32px',
                                                border: '1px solid rgba(28, 176, 246, 0.4)',
                                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                                textAlign: 'center'
                                            }}>
                                                {/* Status Badge */}
                                                <div style={{
                                                    display: 'inline-block',
                                                    padding: '6px 12px',
                                                    borderRadius: '20px',
                                                    background: percent >= 100 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(28, 176, 246, 0.1)',
                                                    color: percent >= 100 ? '#10b981' : '#1cb0f6',
                                                    fontSize: '0.6rem',
                                                    fontWeight: 'bold',
                                                    letterSpacing: '2px',
                                                    marginBottom: '20px'
                                                }}>
                                                    SYSTEM STATUS: {percent >= 100 ? 'MISSION ACCOMPLISHED' : 'IN PROGRESS'}
                                                </div>

                                                {/* EDITABLE TITLE: Allows you to rename the goal to "Car" or anything else */}
                                                <input
                                                    type="text"
                                                    value={activeGoal.title}
                                                    onChange={(e) => updateGoal(activeGoal.id, 'title', e.target.value)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'white',
                                                        fontSize: '2.2rem',
                                                        fontWeight: '900',
                                                        textAlign: 'center',
                                                        width: '100%',
                                                        outline: 'none',
                                                        marginBottom: '10px'
                                                    }}
                                                />
                                                <p style={{ color: '#4b5563', fontSize: '0.7rem', marginBottom: '30px' }}>TAP TEXT TO RENAME</p>

                                                {/* LARGE PERCENTAGE DISPLAY */}
                                                <div style={{ position: 'relative', margin: '30px 0' }}>
                                                    <h1 style={{ fontSize: '6rem', margin: 0, color: 'white', fontWeight: '900', letterSpacing: '-4px' }}>
                                                        {percent}<span style={{ fontSize: '1.5rem', color: '#1cb0f6' }}>%</span>
                                                    </h1>
                                                    <div style={{ width: '60px', height: '4px', background: '#1cb0f6', margin: '0 auto', borderRadius: '2px' }} />
                                                </div>

                                                {/* STATS BOX */}
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    padding: '25px',
                                                    borderRadius: '24px',
                                                    marginBottom: '30px',
                                                    border: '1px solid rgba(255,255,255,0.05)'
                                                }}>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <span style={{ color: '#64748b', fontSize: '0.65rem', display: 'block', marginBottom: '5px' }}>CURRENT STASH</span>
                                                        <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>${activeGoal.current_amount.toLocaleString()}</span>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <span style={{ color: '#64748b', fontSize: '0.65rem', display: 'block', marginBottom: '5px' }}>TOTAL TARGET</span>
                                                        <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>${activeGoal.target_amount.toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                {/* QUICK ACTION BUTTON */}
                                                <button
                                                    onClick={() => handleStash(activeGoal.id, 50)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '22px',
                                                        borderRadius: '18px',
                                                        background: '#1cb0f6',
                                                        color: 'white',
                                                        border: 'none',
                                                        fontWeight: '900',
                                                        fontSize: '1.1rem',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 10px 25px rgba(28, 176, 246, 0.4)',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                                                >
                                                    QUICK STASH +$50
                                                </button>

                                                <button
                                                    onClick={() => setGoalsView('list')}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#64748b',
                                                        marginTop: '25px',
                                                        fontSize: '0.85rem',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    ← RETURN TO OBJECTIVES LIST
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                        </div>
                    </div>

                )}

                {activeTab === 'tracking' && (
                    <div className="tab-section-container">
                        <nav className="unified-glow-nav">
                            {['momentum', 'alerts', 'milestones', 'tracking'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`glow-nav-item ${trackTab === tab ? 'active' : ''}`}
                                    onClick={() => setTrackTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    <span className="glow-indicator"></span>
                                </button>
                            ))}
                        </nav>

                        {/* 👇 ADD THIS PART HERE 👇 */}
                        <div className="tab-content">
                            {trackTab === 'alerts' && <Alerts />}
                            {trackTab === 'milestones' && <Milestones />}
                            {trackTab === 'tracking' && <TrackingPulse />}
                            {trackTab === 'momentum' && <Momentum />}
                        </div>

                    </div>
                )}

                {activeTab === 'personal' && (
                    <div style={{ marginTop: '20px', width: '100%' }}>

                        {/* FLAT UNDERLINED NAVBAR */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '40px',
                            marginBottom: '30px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            paddingBottom: '10px'
                        }}>
                            {['podcasts', 'lessons', 'advice'].map((tab) => (
                                <div key={tab} style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setDevTab(tab)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '15px',
                                            padding: '8px 5px',
                                            transition: 'all 0.3s ease',
                                            color: devTab === tab ? '#ffffff' : '#64748b',
                                            fontWeight: devTab === tab ? '600' : '400',
                                            outline: 'none',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {/* Displaying friendly names for the tabs */}
                                        {tab === 'advice' ? 'Quick Advice' : tab}
                                    </button>

                                    {/* Glowing Underline Indicator */}
                                    {devTab === tab && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-11px',
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            backgroundColor: '#3b82f6',
                                            boxShadow: '0px 0px 10px #3b82f6',
                                            borderRadius: '2px'
                                        }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CONTENT AREA */}
                        <div className="content-area">
                            {devTab === 'podcasts' && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '20px',
                                    padding: '20px'
                                }}>
                                    {/* 01: WEALTH MINDSET */}
                                    <PodcastCard
                                        index="01"
                                        type="PODCAST"
                                        image="unsplash2.jpg"
                                        title="Faith & Finance"
                                        onClick={setOpen}
                                        description="Money mananagement & values."
                                        action="Pay to listen"
                                    />

                                    {/* 02: MARKET DAILY */}
                                    <PodcastCard
                                        index="02"
                                        type="Break the Bank"
                                        image="unsplash1.jpg"
                                        title="Market Daily"
                                        onClick={setOpen}
                                        description="Modern banking and fintech innovation discussion."
                                        action="pay to listen"
                                    />

                                    {/* 03: DEBT FREE JOURNEY */}
                                    <PodcastCard
                                        index="03"
                                        type="DEBT"
                                        image="unsplash3.jpg"
                                        onClick={setOpen}
                                        title="The Debt-Free Path"
                                        description="Real stories from people who paid off thousands in record time."
                                        action="pay to listen"
                                    />
                                      <PodcastCard
                                        index="03"
                                        type="DEBT"
                                        image="unsplash4.jpg"
                                        onClick={setOpen}
                                        title="The Ten Minute Rule"
                                        description="Real stories from people who paid off thousands in record time."
                                        action="pay to listen"
                                    />
                                     <PodcastCard
                                        index="03"
                                        type="DEBT"
                                        image="unsplash5.jpg"
                                        onClick={setOpen}
                                        title="The Diary Of A CEO"
                                        description="Business leadership and financial management."
                                        action="pay to listen"
                                    />
                                     <PodcastCard
                                        index="03"
                                        type="DEBT"
                                        image="unsplash9.jpg"
                                        onClick={setOpen}
                                        title="Planet Money"
                                        description="Simple explanations about money and the economy."
                                        action="pay to listen"
                                    />
                                     <PodcastCard
                                        index="03"
                                        type="DEBT"
                                        image="unsplash6.jpg"
                                        onClick={setOpen}
                                        title="What The Finance"
                                        description="Financ topics explained simply for beginners."
                                        action="pay to listen"
                                    />
                                     <PodcastCard
                                        index="03"
                                        type="Money Talks"
                                        image="unsplash7.jpg"
                                        onClick={setOpen}
                                        title="Money Talks "
                                        description="Easy Personal finance and saving discussions."
                                        action="pay to listen"
                                    />
                                     <PodcastCard
                                        index="03"
                                        type="Investors Podcast"
                                        image="unsplash8.jpg"
                                        onClick={setOpen}
                                        title="Investors Podcast"
                                        description="Learn investing and wealth-building strategies."
                                        action="pay to listen"
                                    />
                                 
                                    
                                </div>
                            )}

                            {devTab === 'lessons' && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '20px',
                                    padding: '20px'
                                }}>
                                    {/* 01: BUDGETING */}
                                    <LearningCard
                                        index="01"
                                        type="BUDGETING"
                                        title="Budgeting Basics"
                                        description="Learn how to create a budget and manage your money effectively."
                                        action="Start Lesson"
                                    />

                                    {/* 02: SAVING */}
                                    <LearningCard
                                        index="02"
                                        type="SAVING"
                                        title="Saving Money"
                                        description="Discover simple strategies to save more and build good habits."
                                        action="Start Lesson"
                                    />

                                    {/* 03: INVESTING */}
                                    <LearningCard
                                        index="03"
                                        type="INVESTING"
                                        title="Beginner Investing"
                                        description="Understand the basics of investing and grow your wealth over time."
                                        action="Start Lesson"
                                    />

                                    {/* 04: SPENDING */}
                                    <LearningCard
                                        index="04"
                                        type="SPENDING"
                                        title="Smart Spending"
                                        description="Learn how to spend wisely and avoid unnecessary expenses."
                                        action="Start Lesson"
                                    />

                                    {/* 05: GOALS */}
                                    <LearningCard
                                        index="05"
                                        type="GOALS"
                                        title="Financial Goal Setting"
                                        description="Set clear financial goals and create a plan to achieve them."
                                        action="Start Lesson"
                                    />

                                    {/* 06: DEBT */}
                                    <LearningCard
                                        index="06"
                                        type="DEBT"
                                        title="Debt Management"
                                        description="Learn how to manage debt responsibly and become debt-free faster."
                                        action="Start Lesson"
                                    />

                                    {/* 07: MINDSET */}
                                    <LearningCard
                                        index="07"
                                        type="MINDSET"
                                        title="Financial Discipline"
                                        description="Build discipline and consistency for long-term financial success."
                                        action="Start Lesson"
                                    />

                                    {/* 08: EMERGENCY */}
                                    <LearningCard
                                        index="08"
                                        type="SAVING"
                                        title="Emergency Funds"
                                        description="Understand why an emergency fund is essential and how to build one."
                                        action="Start Lesson"
                                    />

                                    {/* 09: ANALYSIS */}
                                    <LearningCard
                                        index="09"
                                        type="BUDGETING"
                                        title="Understanding Expenses"
                                        description="Track, analyze, and control your expenses like a pro."
                                        action="Start Lesson"
                                    />

                                    {/* 10: FREEDOM */}
                                    <LearningCard
                                        index="10"
                                        type="FREEDOM"
                                        title="Financial Freedom"
                                        description="Learn the steps to achieve financial freedom and live life on your terms."
                                        action="Start Lesson"
                                    />
                                </div>
                            )}

                            {devTab === 'advice' && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: '20px',
                                    padding: '20px'
                                }}>
                                    {/* 01: EMERGENCY FUND */}
                                    <LearningCard
                                        index="01"
                                        type="QUICK ADVICE"
                                        title="Emergency Fund 101"
                                        description="Why you need 3-6 months of expenses saved and where to keep it."
                                        action="Get Tip"
                                    />

                                    {/* 02: THE 50/30/20 RULE */}
                                    <LearningCard
                                        index="02"
                                        type="BUDGETING"
                                        title="The 50/30/20 Rule"
                                        description="A simple framework: 50% Needs, 30% Wants, and 20% Savings."
                                        action="Get Tip"
                                    />

                                    {/* 03: HIGH-YIELD SAVINGS */}
                                    <LearningCard
                                        index="03"
                                        type="SAVING"
                                        title="High-Yield Accounts"
                                        description="Stop leaving money in low-interest accounts. Make your cash work."
                                        action="Get Tip"
                                    />

                                    {/* 04: AVOID LIFESTYLE CREEP */}
                                    <LearningCard
                                        index="04"
                                        type="MINDSET"
                                        title="Lifestyle Creep"
                                        description="How to keep your expenses steady even when your income increases."
                                        action="Get Tip"
                                    />

                                    {/* 05: CREDIT SCORE BOOST */}
                                    <LearningCard
                                        index="05"
                                        type="DEBT"
                                        title="Credit Score Basics"
                                        description="Quick ways to improve your score and lower your future interest rates."
                                        action="Get Tip"
                                    />

                                    {/* 06: AUTOMATE SAVINGS */}
                                    <LearningCard
                                        index="06"
                                        type="SAVING"
                                        title="Set It and Forget It"
                                        description="The power of automating transfers so you save before you spend."
                                        action="Get Tip"
                                    />

                                    {/* 07: COMPOUND INTEREST */}
                                    <LearningCard
                                        index="07"
                                        type="INVESTING"
                                        title="Compound Interest"
                                        description="See why starting today is more important than the amount you start with."
                                        action="Get Tip"
                                    />

                                    {/* 08: SUBSCRIPTION CLEANUP */}
                                    <LearningCard
                                        index="08"
                                        type="SPENDING"
                                        title="Subscription Audit"
                                        description="Find and cancel those recurring charges you no longer use."
                                        action="Get Tip"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}



                {activeTab === 'zeni' && (
                    <div style={{ height: '90vh', background: 'rgba(19, 31, 36, 0.8)', borderRadius: '24px', padding: '10px' }}>
                        <ZeniBot goals={goals} totalSaved={goals.reduce((a, b) => a + b.current_amount, 0)} />

                    </div>
                )}

                {activeTab === 'profile' && (
                    <UserProfile user={user} />
                )}
                {activeTab === 'about' && (
    <div className="about-page-container" style={{ padding: '20px', color: 'white' }}>
        <AboutUs />
    </div>
)}

                <MpesaModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                />
                {/* Independent About Us Tab - Only renders when activeTab is 'about' */}

            </main>

            <div style={{ position: 'fixed', bottom: '30px', right: '30px', cursor: 'pointer', zIndex: 1000 }} onClick={() => setActiveTab('zeni')}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#1cb0f6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}><span style={{ fontSize: '1.5rem' }}>💬</span></div>
            </div>
            
        </div>
        
    )
}
const footerItemStyle = { display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontSize: '0.95rem', cursor: 'pointer' };
const iconStyle = { fontSize: '1.2rem' };


const styles = {

    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },

    cardLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '14px',
        marginBottom: '10px'
    },

    cardValue: {
        color: '#fff',
        margin: 0,
        fontSize: '32px',
        fontWeight: '700'
    },

    cardDescription: {
        color: 'rgba(255,255,255,0.75)',
        lineHeight: 1.6,
        fontSize: '14px',
        marginTop: '20px'
    },

    iconWrapper: {
        width: '60px',
        height: '60px',

        borderRadius: '18px',

        background: 'rgba(255,255,255,0.12)',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        fontSize: '26px',

        backdropFilter: 'blur(10px)'
    },

    gradientCardBlue: {
        padding: '26px',
        borderRadius: '28px',

        background:
            'linear-gradient(135deg,#2563eb,#1e40af)',

        boxShadow:
            '0 15px 40px rgba(37,99,235,0.25)',

        border:
            '1px solid rgba(255,255,255,0.08)'
    },

    gradientCardPurple: {
        padding: '26px',
        borderRadius: '28px',

        background:
            'linear-gradient(135deg,#7c3aed,#4c1d95)',

        boxShadow:
            '0 15px 40px rgba(124,58,237,0.25)',

        border:
            '1px solid rgba(255,255,255,0.08)'
    },

    gradientCardGreen: {
        padding: '26px',
        borderRadius: '28px',

        background:
            'linear-gradient(135deg,#10b981,#065f46)',

        boxShadow:
            '0 15px 40px rgba(16,185,129,0.25)',

        border:
            '1px solid rgba(255,255,255,0.08)'
    },

    gradientCardOrange: {
        padding: '26px',
        borderRadius: '28px',

        background:
            'linear-gradient(135deg,#f59e0b,#b45309)',

        boxShadow:
            '0 15px 40px rgba(245,158,11,0.25)',

        border:
            '1px solid rgba(255,255,255,0.08)'
    },

    progressSection: {
        marginTop: '24px'
    },

    progressBar: {
        width: '100%',
        height: '10px',

        background:
            'rgba(255,255,255,0.15)',

        borderRadius: '999px',

        overflow: 'hidden'
    },

    progressFill: {
        height: '100%',

        borderRadius: '999px',

        background:
            'linear-gradient(90deg,#fff,#cbd5e1)'
    },

    progressText: {
        display: 'block',

        marginTop: '10px',

        color: 'rgba(255,255,255,0.8)',

        fontSize: '13px'
    },

    actionButton: {
        marginTop: '24px',

        width: '100%',

        padding: '14px',

        border: 'none',

        borderRadius: '16px',

        background: 'rgba(255,255,255,0.14)',

        color: '#fff',

        fontWeight: '600',

        fontSize: '14px',

        cursor: 'pointer',

        backdropFilter: 'blur(10px)',

        transition: '0.3s ease'
    },
};

export default DashboardComponent
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// --- COMPONENT: LOGIN VAULT GATE ---
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   // initiallize our hooks for loading,success
    const[loading,setLoading]=useState("")
    const[success,setSuccess]=useState("")
    const[error,setError]=useState("")

  let navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading("please wait.......")
    setError("")
    

    try {
      const user_data = new FormData()

      if (email == "" || password == "") {
        setError("Enter all values")
        setLoading(false)
        return
      }

      user_data.append("email", email)
      user_data.append("password", password)

      let response = await axios.post("https://sylviawambuu.alwaysdata.net/api/signin", user_data)
      console.log(response)
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user))
        navigate("/")

      } else {
        setLoading(false)
        setError(response.message)
      }
      
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  };
  const loginInputStyle = { width: '100%', padding: '15px', borderRadius: '12px', background: '#131f24', border: '2px solid #37464f', color: 'white', boxSizing: 'border-box' };
  const socialButtonStyle = (color) => ({ flex: 1, padding: '12px', borderRadius: '12px', background: 'transparent', border: '2px solid #37464f', color: color, fontWeight: 'bold', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' });

  return (
    <div className="login-vault-screen" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#131f24', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '420px', textAlign: 'center', padding: '20px' }}>
        <h1 style={{ letterSpacing: '8px', fontWeight: '900', marginBottom: '30px' }}>ZENITH</h1>
        <p className='text-warning'>{loading}</p>
           <p className='text-success'>{success}</p>
           <p className='text-warning'>{error}</p>

           <br />
           
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="Email or username" value={email} onChange={(e) => setEmail(e.target.value)} style={loginInputStyle} required />
          <div style={{ position: 'relative' }}>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={loginInputStyle} required />
            <span style={{ position: 'absolute', right: '15px', top: '15px', fontSize: '0.7rem', color: '#afafaf', cursor: 'pointer' }}>FORGOT?</span>
          </div>
          <button type="submit" style={{ background: '#1cb0f6', border: 'none', padding: '15px', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 0 #1899d6' }}>UNLOCK ACCESS</button>
        </form>
        <p style={{ marginTop: '20px', color: '#afafaf', fontSize: '0.9rem' }}>Don't have an account? <span style={{ color: '#1cb0f6', fontWeight: 'bold', cursor: 'pointer' }}><Link to="/signup">SIGN UP</Link></span></p>
        <div style={{ margin: '25px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><hr style={{ flex: 1, border: '0.5px solid #37464f' }} /><span style={{ color: '#777', fontWeight: 'bold', fontSize: '0.7rem' }}>OR CONNECT WITH</span><hr style={{ flex: 1, border: '0.5px solid #37464f' }} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button type="button" style={socialButtonStyle('#4285F4')}>GOOGLE</button>
          <button type="button" style={socialButtonStyle('#1877F2')}>FACEBOOK</button>
          <button type="button" style={socialButtonStyle('#E1306C')}>INSTAGRAM</button>
          <button type="button" style={socialButtonStyle('#ff0050')}>TIKTOK</button>
        </div>
      </div>
    </div>
  );
};

export default Login
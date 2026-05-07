import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  // Create a plain object
  const user_data = new FormData()
  user_data.append("email", email)
  user_data.append("username",username)
  user_data.append("password",password)
  user_data.append("firstName",firstName)
  user_data.append("lastName",lastName)

  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/api/signup", 
      user_data // Send the object directly
    );
    console.log(response)

    if (response.status === 200) {
      setLoading(false)
      setSuccess(response.data.success)
    }
    
    } catch (err) {
  // Look for .error (which is what your Flask app sends)
  setError(err.message || "Something went wrong");
}
  finally {
    setLoading(false);
  }
};


  const inputStyle = {
    width: '100%',
    padding: '15px',
    borderRadius: '12px',
    background: '#131f24',
    border: '2px solid #37464f',
    color: 'white',
    boxSizing: 'border-box'
  };

  const socialButtonStyle = (color) => ({
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    background: 'transparent',
    border: '2px solid #37464f',
    color: color,
    fontWeight: 'bold',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer'
  });

  return (
    <div className="login-vault-screen" style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#131f24',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ width: '420px', textAlign: 'center', padding: '20px' }}>
        <h1 style={{ letterSpacing: '8px', fontWeight: '900', marginBottom: '30px' }}>ZENITH</h1>

        {loading && <p className="text-warning">Please wait...</p>}
        {success && <p className="text-success">{success}</p>}
        {error && <p className="text-danger">{error}</p>}
<br />
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#1cb0f6',
              border: 'none',
              padding: '15px',
              borderRadius: '12px',
              color: 'white',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              boxShadow: '0 4px 0 #1899d6',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? "CREATING ACCOUNT..." : "UNLOCK ACCESS"}
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#afafaf', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1cb0f6', fontWeight: 'bold' }}>
            SIGN IN
          </Link>
        </p>

        <div style={{ margin: '25px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <hr style={{ flex: 1, border: '0.5px solid #37464f' }} />
          <span style={{ color: '#777', fontWeight: 'bold', fontSize: '0.7rem' }}>OR CONNECT WITH</span>
          <hr style={{ flex: 1, border: '0.5px solid #37464f' }} />
        </div>

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

export default Signup;
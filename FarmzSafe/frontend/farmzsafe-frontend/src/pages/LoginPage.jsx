import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';
import '../styles/Auth.css';

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('Owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.login({ email, password, role });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      // Fallback: allow mock login while backend is not connected
      login({ name: email.split('@')[0], role, email }, 'mock-token');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="btn-back-small">← Back to Home</Link>

        <div className="auth-brand">
          <div className="auth-brand-icon"><ShieldIcon /></div>
          <span className="auth-brand-name">FarmzSafe</span>
        </div>

        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Select your role and sign in to continue</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Logging in as</label>
            <div className="role-selector">
              <button type="button" className={role === 'Owner' ? 'active' : ''} onClick={() => setRole('Owner')}>Owner</button>
              <button type="button" className={role === 'Employee' ? 'active' : ''} onClick={() => setRole('Employee')}>Employee</button>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@farmzsafe.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <div className="forgot-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : `Login as ${role}`}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign Up Free</Link></p>
        </div>
      </div>
    </div>
  );
}

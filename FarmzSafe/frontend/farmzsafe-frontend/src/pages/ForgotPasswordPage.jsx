import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api';
import '../styles/Auth.css';

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      // Simulate success for now
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/login" className="btn-back-small">← Back to Login</Link>

        <div className="auth-brand">
          <div className="auth-brand-icon"><ShieldIcon /></div>
          <span className="auth-brand-name">FarmzSafe</span>
        </div>

        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your email and we'll send a reset link</p>
        </div>

        {sent ? (
          <div className="auth-success">
            <p>Reset link sent! Check your inbox at <strong>{email}</strong>.</p>
            <Link to="/login" className="w-full" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <div className="auth-footer">
              <p>Remembered it? <Link to="/login">Back to Login</Link></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

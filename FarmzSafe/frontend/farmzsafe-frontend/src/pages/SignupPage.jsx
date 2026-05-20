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

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Owner', farmName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.signup(form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Email might already exist.');
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
          <h2>Join FarmzSafe</h2>
          <p>Track. Vaccinate. Protect.</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>I am a</label>
            <div className="role-selector">
              <button type="button" className={form.role === 'Owner' ? 'active' : ''} onClick={() => setForm(p => ({ ...p, role: 'Owner' }))}>Owner</button>
              <button type="button" className={form.role === 'Employee' ? 'active' : ''} onClick={() => setForm(p => ({ ...p, role: 'Employee' }))}>Employee</button>
            </div>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Write your name" value={form.name} onChange={set('name')} required />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@farmzsafe.com" value={form.email} onChange={set('email')} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Minimum, 8 characters" value={form.password} onChange={set('password')} minLength={8} required />
          </div>

          {form.role === 'Owner' && (
            <div className="form-group">
              <label>Farm Name <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input type="text" placeholder="e.g. Green Valley Ranch" value={form.farmName} onChange={set('farmName')} />
            </div>
          )}

          <button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

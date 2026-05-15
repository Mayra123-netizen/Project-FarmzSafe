import React, { useState } from 'react';
import './Auth.css';

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Auth = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('Owner');
  const [showCreateFarm, setShowCreateFarm] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(role);
  };

  if (showForgot) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <button className="btn-back-small" onClick={() => setShowForgot(false)}>← Back</button>
          <div className="auth-brand">
            <div className="auth-brand-icon"><ShieldIcon /></div>
            <span className="auth-brand-name">FarmzSafe</span>
          </div>
          <div className="auth-header">
            <h2>Reset Password</h2>
            <p>Enter your email and we'll send a reset link</p>
          </div>
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); alert('Reset link sent! Check your inbox.'); setShowForgot(false); }}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" required />
            </div>
            <button type="submit" className="w-full">Send Reset Link</button>
          </form>
          <div className="auth-footer">
            <p>Remembered it? <button onClick={() => setShowForgot(false)}>Back to Login</button></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="btn-back-small" onClick={onBack}>← Back to Home</button>

        {/* Brand Logo — same as landing page nav */}
        <div className="auth-brand">
          <div className="auth-brand-icon"><ShieldIcon /></div>
          <span className="auth-brand-name">FarmzSafe</span>
        </div>

        <div className="auth-header">
          <h2>
            {isLogin
              ? (showCreateFarm ? 'Create Your Farm' : `Welcome Back`)
              : 'Join FarmzSafe'}
          </h2>
          <p>
            {isLogin
              ? (showCreateFarm ? 'Set up your agricultural dashboard' : 'Select your role and sign in to continue')
              : 'Start securing your harvest today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selector — pill style */}
          {isLogin && !showCreateFarm && (
            <div className="form-group">
              <label>Logging in as</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={role === 'Owner' ? 'active' : ''}
                  onClick={() => setRole('Owner')}
                >Owner</button>
                <button
                  type="button"
                  className={role === 'Employee' ? 'active' : ''}
                  onClick={() => setRole('Employee')}
                >Employee</button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="e.g. Fatima Ahmed" required />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@farmzsafe.com" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          {isLogin && !showCreateFarm && (
            <div className="forgot-link">
              <button type="button" onClick={() => setShowForgot(true)}>Forgot Password?</button>
            </div>
          )}

          {showCreateFarm && (
            <div className="form-group">
              <label>Farm Name</label>
              <input type="text" placeholder="e.g. Green Valley Ranch" required />
            </div>
          )}

          <button type="submit" className="w-full">
            {isLogin ? (showCreateFarm ? 'Create Farm & Login' : `Login as ${role}`) : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <>
              <p>Don't have an account? <button onClick={() => setIsLogin(false)}>Sign Up Free</button></p>
              {!showCreateFarm && (
                <p>New farm? <button onClick={() => setShowCreateFarm(true)}>Register a Farm</button></p>
              )}
              {showCreateFarm && (
                <button onClick={() => setShowCreateFarm(false)} className="link-btn">← Back to Login</button>
              )}
            </>
          ) : (
            <p>Already have an account? <button onClick={() => setIsLogin(true)}>Login</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

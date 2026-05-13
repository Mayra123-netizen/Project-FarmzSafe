import React, { useState } from 'react';
import './Auth.css';

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
        <div className="auth-card glass-morphism">
          <button className="btn-back-small" onClick={() => setShowForgot(false)}>← Back</button>
          <div className="auth-header">
            <h2>Forgot Password</h2>
            <p>Enter your email to reset your password</p>
          </div>
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); alert('Reset link sent!'); setShowForgot(false); }}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" required />
            </div>
            <button type="submit" className="btn-primary w-full">Send Reset Link</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card glass-morphism">
        <button className="btn-back-small" onClick={onBack}>← Back</button>
        <div className="auth-header">
          <h2>{isLogin ? (showCreateFarm ? 'Create Your Farm' : `Welcome Back, ${role}`) : 'Join FarmzSafe'}</h2>
          <p>{isLogin ? (showCreateFarm ? 'Set up your agricultural dashboard' : 'Please select your role and login') : 'Start securing your harvest today'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isLogin && !showCreateFarm && (
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
          )}

          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="john@farmzsafe.com" required />
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
              <input type="text" placeholder="Green Valley Farm" required />
            </div>
          )}

          <button type="submit" className="btn-primary w-full">
            {isLogin ? (showCreateFarm ? 'Create Farm' : `Login as ${role}`) : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <>
              <p>Don't have an account? <button onClick={() => setIsLogin(false)}>Sign Up</button></p>
              {!showCreateFarm && <p>New Farm? <button onClick={() => setShowCreateFarm(true)}>Create Farm</button></p>}
              {showCreateFarm && <button onClick={() => setShowCreateFarm(false)} className="link-btn">Back to Login</button>}
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


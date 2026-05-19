import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import heroCows from '../assets/hero-cows.jpg';
import '../styles/App.css';

const ShieldIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  return (
    <div className="landing-page">
      <nav className="glass-morphism navbar">
        <div className="container nav-content">
          <div className="logo">
            <ShieldIcon />
            <span className="logo-text">FarmzSafe</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#safety">Safety</a>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/signup" className="btn-primary">Join Now</Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero-section">
          <div className="container hero-content">
            <div className="hero-text">
              <h1>Precision Safety for the Modern Farm</h1>
              <p className="subtitle">
                The ultimate platform for agricultural risk management, real-time safety monitoring, and compliance tracking.
              </p>
              <div className="hero-btns">
                <Link to="/signup" className="btn-primary">Get Started Free</Link>
                <a href="#features" className="btn-secondary">Learn More</a>
              </div>
            </div>
            <div className="hero-image-container">
              <img src={heroCows} alt="Livestock on a farm" className="hero-img-main" />
              <div className="floating-card glass-morphism">
                <div className="card-status-dot"></div>
                <div className="card-info">
                  <span className="card-label">Safety Status</span>
                  <span className="card-value">100% Secure</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>Intelligent Farm Management</h2>
              <p>Everything you need to monitor, manage, and secure your agricultural operations.</p>
            </div>
            <div className="features-grid">
              <div className="feature-card glass-morphism">
                <div className="feature-icon"><ShieldIcon /></div>
                <h3>Safety Audits</h3>
                <p>Automated digital safety checks and compliance reporting at your fingertips.</p>
              </div>
              <div className="feature-card glass-morphism">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a7 7 0 0 1 0 8.4m2.8-11.2a11 11 0 0 1 0 14m-11.8-14a11 11 0 0 0 0 14m-2.8-11.2a7 7 0 0 0 0 8.4"/></svg>
                </div>
                <h3>IoT Monitoring</h3>
                <p>Real-time sensor data tracking soil health, equipment safety, and weather risks.</p>
              </div>
              <div className="feature-card glass-morphism">
                <div className="feature-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3>Team Safety</h3>
                <p>Manage worker training certifications and incident reports in one place.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section container">
          <div className="cta-card glass-morphism">
            <h2>Ready to secure your harvest?</h2>
            <p>Join over 1,500 farms using FarmzSafe to protect their teams and operations.</p>
            <Link to="/signup" className="btn-primary">Start Your Free Trial</Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <p>&copy; 2026 FarmzSafe Systems. All rights reserved.</p>
          <div className="social-links">
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

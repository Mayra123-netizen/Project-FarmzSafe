import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Activity, CheckCircle, ArrowRight, Sun, Moon } from 'lucide-react';
import '../styles/App.css';

export default function LandingPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('farmzsafe_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('farmzsafe_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Floating glass navbar */}
      <nav className="navbar glass-morphism">
        <div className="container nav-content">
          <div className="logo">
            <Shield size={26} style={{ stroke: 'var(--primary-light)' }} />
            <span>FarmzSafe</span>
          </div>
          <div className="nav-links">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/signup" className="btn-primary">Register Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Securing Your Livestock Operations</h1>
            <p className="subtitle">
              FarmzSafe provides digital record-keeping, vaccination monitoring, disease outbreak warnings, and role-based reports for modern farm operations.
            </p>
            <div className="hero-btns">
              <Link to="/signup" className="btn-primary">
                Get Started Now <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary">
                Employee Access
              </Link>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-img-main glass-morphism" style={{ padding: '3rem', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Sparkles size={48} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Centralized Farm Management</h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Track animals, check vaccination status, log events, and retrieve analytics in real-time.
              </p>
            </div>
            <div className="floating-card glass-morphism">
              <div className="card-icon">🐄</div>
              <div>
                <span className="card-label">Active Herd</span>
                <span className="card-value">1,480 Animals</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need, All In One Place</h2>
            <p>A comprehensive ecosystem crafted to secure your daily farm tasks and report operations</p>
          </div>
          <div className="features-grid">
            <div className="feature-card glass-morphism">
              <div className="feature-icon">🛡️</div>
              <h3>Role-Based Portals</h3>
              <p>Separate environments customized for Farm Owners (manage/add) and Farm Employees (monitor/view).</p>
            </div>
            <div className="feature-card glass-morphism">
              <div className="feature-icon">💉</div>
              <h3>Vaccination Schedules</h3>
              <p>Never miss a dose. Track stock inventories, due schedules, and animal-level details automatically.</p>
            </div>
            <div className="feature-card glass-morphism">
              <div className="feature-icon">📈</div>
              <h3>Glassmorphic Analytics</h3>
              <p>Real-time animal distribution charts, health logging rates, and outbreak alerts on beautiful cards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-morphism">
            <h2>Boost Your Farm's Safety Rating</h2>
            <p>Join thousands of farmers tracking live records, preventing outbreaks, and increasing productivity.</p>
            <Link to="/signup" className="btn-primary">
              Register Free Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>© {new Date().getFullYear()} FarmzSafe agricultural platform. All rights reserved.</p>
          <div className="social-links">
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

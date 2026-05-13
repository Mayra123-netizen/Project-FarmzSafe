import { useState, useEffect } from 'react'
import heroPremium from './assets/hero-premium.png'
import Dashboard from './Dashboard'
import Auth from './Auth'
import './App.css'

// Professional Icons as components
const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const RadioIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a7 7 0 0 1 0 8.4m2.8-11.2a11 11 0 0 1 0 14m-11.8-14a11 11 0 0 0 0 14m-2.8-11.2a7 7 0 0 0 0 8.4"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

function App() {
  const [view, setView] = useState('landing');
  const [theme, setTheme] = useState('light');
  const [userRole, setUserRole] = useState('Owner');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setView('dashboard');
  };

  if (view === 'dashboard') {
    return <Dashboard onBack={() => setView('landing')} role={userRole} />
  }

  if (view === 'auth') {
    return <Auth onLogin={handleLogin} onBack={() => setView('landing')} />
  }


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
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <button className="btn-login" onClick={() => setView('auth')}>Login</button>
            <button className="btn-primary" onClick={() => setView('auth')}>Join Now</button>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero-section">
          <div className="container hero-content">
            <div className="hero-text">
              <h1 className="reveal-text">Precision Safety for the Modern Farm</h1>
              <p className="subtitle">
                The ultimate platform for agricultural risk management, real-time safety monitoring, and compliance tracking. Keep your farm safe, productive, and future-ready.
              </p>
              <div className="hero-btns">
                <button className="btn-primary" onClick={() => setView('auth')}>Get Started Free</button>
                <button className="btn-secondary">Watch Demo</button>
              </div>
            </div>
            <div className="hero-image-container">
              <img src={heroPremium} alt="FarmzSafe Intelligence" className="hero-img-main" />
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
                <div className="feature-icon"><RadioIcon /></div>
                <h3>IoT Monitoring</h3>
                <p>Real-time sensor data tracking soil health, equipment safety, and weather risks.</p>
              </div>
              <div className="feature-card glass-morphism">
                <div className="feature-icon"><UsersIcon /></div>
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
            <button className="btn-primary" onClick={() => setView('auth')}>Start Your Free Trial</button>
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
  )
}

export default App





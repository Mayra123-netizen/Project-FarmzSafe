import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, MapPin, ShieldCheck, FileText, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const navItems = [
  { to: '/dashboard',          label: 'Home',    icon: <Home size={20} />       },
  { to: '/dashboard/farms',    label: 'Farms',   icon: <MapPin size={20} />     },
  { to: '/dashboard/vaccine',  label: 'Vaccine', icon: <ShieldCheck size={20} />},
  { to: '/dashboard/reports',  label: 'Reports', icon: <FileText size={20} />   },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="left-sidebar">
      <div className="sidebar-brand">
        <h1>FARMZ SAFE</h1>
        <p>Livestock Monitor</p>
      </div>

      <nav className="nav-menu">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {icon} <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-card">
          <div className="u-avatar">{user?.role?.[0] || 'U'}</div>
          <div className="u-info">
            <span className="u-name">{user?.name || user?.role || 'User'}</span>
            <span className="u-role">{user?.role || 'Active'}</span>
          </div>
        </div>
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

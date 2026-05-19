import { NavLink, useNavigate } from 'react-router-dom';
import { Home, MapPin, ShieldCheck, FileText, LogOut } from 'lucide-react';
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
            {icon} {label}
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
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}

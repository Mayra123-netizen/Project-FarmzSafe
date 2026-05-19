import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import '../../styles/Dashboard.css';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

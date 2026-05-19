import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Dashboard Pages
import DashboardLayout from './pages/dashboard/DashboardLayout';
import HomePage from './pages/dashboard/HomePage';
import FarmsPage from './pages/dashboard/FarmsPage';
import VaccinePage from './pages/dashboard/VaccinePage';
import ReportsPage from './pages/dashboard/ReportsPage';

import './styles/App.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<HomePage />} />
              <Route path="farms" element={<FarmsPage />} />
              <Route path="vaccine" element={<VaccinePage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

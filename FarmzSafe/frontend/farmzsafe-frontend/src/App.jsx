import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
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
          <Route path="/" element={<LandingPage />} />
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

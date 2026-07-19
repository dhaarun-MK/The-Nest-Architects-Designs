import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import CostEstimator from './pages/CostEstimator';
import About from './pages/About';
import Contact from './pages/Contact';
import AuthCallback from './pages/AuthCallback';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminLanding from './pages/admin/AdminLanding';
import AdminAbout from './pages/admin/AdminAbout';
import AdminCalculator from './pages/admin/AdminCalculator';
import AdminMessages from './pages/admin/AdminMessages';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
function ProtectedUser({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function ProtectedAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (!user || !isAdmin) return <Navigate to="/admin-login-page" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="projects" element={<ProtectedUser><Projects /></ProtectedUser>} />
        <Route path="projects/:id" element={<ProtectedUser><ProjectDetails /></ProtectedUser>} />
        <Route path="estimator" element={<ProtectedUser><CostEstimator /></ProtectedUser>} />
        <Route path="about" element={<ProtectedUser><About /></ProtectedUser>} />
        <Route path="contact" element={<ProtectedUser><Contact /></ProtectedUser>} />
        <Route path="auth/callback" element={<AuthCallback />} />
      </Route>
      <Route path="/admin-login-page" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="landing" element={<AdminLanding />} />
        <Route path="about" element={<AdminAbout />} />
        <Route path="calculator" element={<AdminCalculator />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

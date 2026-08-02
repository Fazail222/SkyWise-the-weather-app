import { Routes, Route } from 'react-router-dom';

import Landing from '../pages/Landing';

import Login from '../components/login/Login';
import Register from '../components/login/Register';
import AuthLayout from '../layouts/AuthLayout';
import Dashboard from '../pages/Dashboard';


// import Profile from "../pages/dashboard/Profile";

// import NotFound from "../pages/NotFound";

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import HistoryPage from '../pages/HistoryPage';
import FavoritesPage from '../pages/FavoritesPage';
import RadarPage from '../pages/RadarPage';
import SettingsPage from '../pages/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        
          <Route path="/history" element={<HistoryPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/radar" element={<RadarPage />} />
       
        <Route path="/settings" element={<SettingsPage />} />
     
      </Route>

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

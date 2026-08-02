import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);
  const location = useLocation();

  // Wait for the initial "am I logged in?" check to finish before deciding
  // anything. Without this, isAuthenticated reads as false on the very first
  // render (before your session-check thunk resolves), so a logged-in user
  // gets bounced to /login or the route renders nothing at all.
  if (!authChecked) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-skywise-bg">
        <Loader2 className="w-6 h-6 text-skywise-accent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Remember where they were headed so you can send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

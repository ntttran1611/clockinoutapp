import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { LoadingSpinner } from '../LoadingSpinner';

export function ProtectedRoute({ allowedRole }) {
  const { user, role, loading } = useAuth() || {};
  const navigate = useNavigate();

  // 1. 🛡️ HOLD THE GATE: If the database is still fetching the role, show the spinner!
  if (loading) {
    return (
      <LoadingSpinner isFullScreen={true}/>
    );
  }

  // 2. RUN THE GUARD: Only redirect if loading is completely finished and they aren't an admin
  if (!loading && (!user || !role || (allowedRole && role !== allowedRole))) {
    //console.log("Unauthorized access attempt. Redirecting to login...");
    return <Navigate to="/" replace />;
    
  }

  // 3. PASS: If they are verified, mount the dashboard
  return <Outlet />;
}
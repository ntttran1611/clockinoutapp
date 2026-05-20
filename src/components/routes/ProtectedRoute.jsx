import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';

export function ProtectedRoute({ allowedRole }) {
  const { user, role, loading } = useAuth() || {};
  const navigate = useNavigate();

  // Redirect immediately if loading completes and requirements fail
  useEffect(() => {
    console.log("Im here")
    if (!loading && (!user )) {
      navigate('/', { replace: true });
    }
  }, [user, role, loading, allowedRole, navigate]);

  // 1. If Supabase is checking tokens on cold start, hold the line here!
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-mocha-5">
        <span className="loading loading-spinner loading-xl text-mocha-80"></span>
      </div>
    );
  }

  // 2. If verified successfully, render the nested sub-routes cleanly
  if (user ) {
    return <Outlet />;
  }

  // Fallback fallback protection
  return null;
}
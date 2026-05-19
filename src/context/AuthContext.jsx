import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserRole, getSession, signOut, supabase } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Get the current authenticated session
      const session = await getSession();

      if (session) {
        const currentUser = session.user;

        setUser(currentUser);

        const userRole = await getUserRole(currentUser.id);

        // 2. Fetch the custom ENUM role from the public profiles table
        if (userRole) {
          setRole(userRole);
        }
      } else {
        clearAuthCookies();
      }
      setLoading(false);
    };

    initializeAuth();

    // 3. Listen for token refreshes or logouts (Handles the 5-minute silent refresh loop)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED' && session) {
        // Silently update the access token cookie for another 5 minutes
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${5 * 60}; SameSite=Lax; Secure`;
      } else if (event === 'SIGNED_OUT') {
        clearAuthCookies();
        setUser(null);
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearAuthCookies = () => {
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  };

  const logout = () => {
    signOut();
    setUser(null);
    setRole(null);
    clearAuthCookies();
  }


  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
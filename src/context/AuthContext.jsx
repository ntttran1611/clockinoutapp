import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserRole, getSession, signOut, supabase, clearAuthCookies, setCookie } from '../api';
import { LiaTruckLoadingSolid } from 'react-icons/lia';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

 // Helper function to sync all states when a user becomes authenticated
  const handleAuthSuccess = async (session) => {
    setUser(session.user);
    // Fetch and set role
    const userRole = await getUserRole(session.user.id);
    if (userRole) {
      setRole(userRole);
    }
    setLoading(false);
  };

  const checkInitialAuth = async () => {
      try {
        const session = await getSession();
        if (session) {
          await handleAuthSuccess(session);
        } else {
          setLoading(false);
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
        setLoading(false);
      }
    };

  //App Startup Check (Runs ONLY once) - The app starts (it can start from the frontpage or a dashboard)
  useEffect(() => {
    //checkInitialAuth();

    // 🌟 THE SINGLE CAPTAIN OF YOUR AUTH LIFECYCLE
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`📣 Auth Event: ${event}`);

      if (session) {
        setUser(session.user);
        
        // Fetch their database role
        const userRole = await getUserRole(session.user.id);
        if (userRole) {
          setRole(userRole);
        }
        
        if (event === 'SIGNED_IN') console.log("✓ User signed in:", session.user.email);
        if (event === 'TOKEN_REFRESHED') console.log("✓ Token refreshed smoothly.");
        
      } else {
        // Clear application states cleanly when a session dies or user logs out
        setUser(null);
        setRole(null);
        
        if (event === 'SIGNED_OUT') {
          console.log("🚨 Session ended or refresh token expired.");
        }
      }

      // 🚨 CRUCIAL: Turn off loading spinner ONLY after user & role states are set
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  //Login - set user, role and cookie by the helper
  const login = async (session) => {
    //console.log(session);
    if (!session) return;
    await handleAuthSuccess(session);
  };

  // Flow 3: Manual Logout Handler
  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      // Always clear local state even if the API call fails
      setUser(null);
      setRole(null);
    }
  };
  return (
    <AuthContext.Provider value={{ user, role, loading, logout, login }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // 🚨 If the context hasn't initialized or isn't wrapped correctly, catch it instantly
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
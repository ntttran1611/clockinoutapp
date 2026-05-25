import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserRole, getSession, signOut, supabase, clearAuthCookies, setCookie } from '../api';
import { LiaTruckLoadingSolid } from 'react-icons/lia';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  //App Startup Check (Runs ONLY once) - The app starts (it can start from the frontpage or a dashboard)
  useEffect(() => {
    // 🌟 THE SINGLE CAPTAIN OF YOUR AUTH LIFECYCLE
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`📣 Auth Event: ${event}`);

      if (session) {
        // 1. Immediately sync the user object so the listener doesn't freeze
        setUser(session.user);
        
        // 2. Define a clean inner async function to handle your role fetching separately
        const fetchAndSetRole = async (userId) => {
          try {
            const userRole = await getUserRole(userId);
            if (userRole) {
              setRole(userRole);
            } else {
              setRole(null); // No role found
            }
          } catch (err) {
            console.error("Failed to retrieve profile role metadata:", err);
            setRole(null);
          } finally {
            // Once the background database network request completes, turn off loading
            setLoading(false);
          }
        };

        // 3. 🔥 FIRE AND FORGET: Trigger the function into a background thread
        fetchAndSetRole(session.user.id);
        
        if (event === 'SIGNED_OUT') {
          console.log("🚨 Session ended or refresh token expired.");
        }

        if(event === 'TOKEN_REFRESHED') {
          console.log("Token has been refreshed.")
        }
      } else {
        // 🚨 CRUCIAL: Turn off loading spinner ONLY after user & role states are set
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
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
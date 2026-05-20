import { supabase } from "../SupabaseClient.js";

export async function auth(loginDetails) {
  try {
    // 1. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginDetails.email,
      password: loginDetails.password,
    });

    if (error) throw error;

    const { session } = data;

    return session;

  } catch (err) {
    console.error("Login failed:", error.message);
    return;
    
  }
}

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      // If the server rejected the refresh token, pass the error to the catch block
      throw error;
    }

    // Returns the session object if valid, or null if no one is logged in
    return session; 

  } catch (err) {
    console.error("Session verification failed:", err.message);

    // 🚨 Critical Step: If the token is invalid/expired, wipe localStorage clean
    // so the client doesn't keep trying to send broken tokens.
    await supabase.auth.signOut();

    // Explicitly return null so your React component knows the user is logged out
    return null;
  }
}
 
export async function getUserRole(id) {
  if (!id) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', id)
      .maybeSingle();
console.log('working')
    if (error) {
      console.error('Error fetching user role:', error.message ?? error);
      return null;
    }

    
    return data?.user_role ?? null;
  } catch (err) {
    console.error('Error fetching user role:', err);
    return null;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error: ", error);
    }
  } catch (err) {
    console.error("Unexpected error: ", err);
  }
}




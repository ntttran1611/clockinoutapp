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

    // 2. Extract tokens
    const accessToken = session.access_token;
    const refreshToken = session.refresh_token;

    // 3. Store tokens in document.cookie with security flags (5-min expiry for access token)
    document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${5 * 60}; SameSite=Lax; Secure`;
    document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;

    return data;

  } catch (err) {
    return;
    console.error("Login failed:", error.message);
  }
}

export async function getProfile(id){
  try {
    const { data, error } = await supabase
              .from('profiles')
              .select('user_role')
              .eq('id', id)
              .single();

    if(error) {
      throw error;
      return;
    } 

    return data;
  } catch (err) {
    return;
    console.error("Login failed:", error.message);
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

export async function renewAccessToken() {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      console.error("No refresh token available");
      return null;
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      console.error("Error refreshing token: ", error);
      return null;
    }

    // Update the access token in localStorage
    if (data.session) {
      localStorage.setItem("access_token", data.session.access_token);
      localStorage.setItem("refresh_token", data.session.refresh_token);
    }

    return data.session.access_token;
  } catch (err) {
    console.error("Unexpected error refreshing token: ", err);
    return null;
  }
}

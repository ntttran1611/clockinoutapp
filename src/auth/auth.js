import { supabase } from "../api";

export async function auth(loginDetails) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginDetails.email,
      password: loginDetails.password,
    });

    if (error) {
      return null;
    }
    return data;
  } catch (err) {
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

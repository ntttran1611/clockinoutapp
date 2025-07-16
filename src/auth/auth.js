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

export async function auth(loginDetails) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginDetails.email,
      password: loginDetails.password,
    });

    if (error) {
      console.error("Error fetching data: ", error);
      return null;
    }
    console.log(data);
    return data;
  } catch (err) {
    console.error("Unexpected error: ", err);
    return null;
  }
}

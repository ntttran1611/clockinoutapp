import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Setup CORS headers so your Vite app can call it
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Initialize Supabase Client with the hidden Service Role Key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Safe & hidden here!
      {
        auth: {
          persistSession: false,
        },
      }
    )

    // 2. Get the email and password sent from your React app
    const { email, password } = await req.json()

    // 3. Use the Admin API to create the user without logging them in locally
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Automatically confirms email so they can log in instantly
    })

    if (error) throw error

    // 4. Return the newly created user data back to your React app
    return new Response(JSON.stringify({ user: data.user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
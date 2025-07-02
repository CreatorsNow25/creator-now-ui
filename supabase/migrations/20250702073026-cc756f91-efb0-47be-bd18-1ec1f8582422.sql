-- Remove the custom email hook system
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS auth.send_email_hook();

-- Re-enable Supabase's native email system
-- This will use the RESEND_API_KEY that was working last night
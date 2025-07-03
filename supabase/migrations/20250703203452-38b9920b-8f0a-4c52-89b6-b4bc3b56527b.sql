
-- Enable the net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS http;

-- Remove the problematic database trigger that's causing the hook error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_auth_user_created();

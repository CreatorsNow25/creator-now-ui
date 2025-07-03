
-- Create the missing database trigger function that sends custom emails
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Send HTTP request to the send-email edge function for verification emails
  SELECT net.http_post(
    url := 'https://qwvleuornxbjkudvsifr.supabase.co/functions/v1/send-email',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
    body := json_build_object(
      'email_type', 'verification',
      'email', NEW.email,
      'user_name', NEW.raw_user_meta_data->>'full_name',
      'user_id', NEW.id::text,
      'redirect_to', 'https://creators-now.vercel.app/verify'
    )::jsonb
  ) INTO request_id;
  
  RETURN NEW;
END;
$$;

-- Create the trigger on auth.users table for INSERT events (new signups)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  WHEN (NEW.email_confirmed_at IS NULL)
  EXECUTE FUNCTION public.handle_auth_user_created();

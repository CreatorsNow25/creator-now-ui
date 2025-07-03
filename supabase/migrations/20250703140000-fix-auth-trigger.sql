
-- Fix the database trigger to send correct payload format
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id bigint;
  service_role_key text;
BEGIN
  -- Get the service role key from app settings
  SELECT current_setting('app.settings.service_role_key', true) INTO service_role_key;
  
  -- Only proceed if we have the service role key
  IF service_role_key IS NOT NULL AND service_role_key != '' THEN
    -- Send HTTP request to the send-email edge function for verification emails
    SELECT net.http_post(
      url := 'https://qwvleuornxbjkudvsifr.supabase.co/functions/v1/send-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'email_type', 'verification',
        'email', NEW.email,
        'user_name', COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'user_id', NEW.id::text,
        'redirect_to', 'https://creators-now.vercel.app/verify'
      )
    ) INTO request_id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE WARNING 'Failed to send verification email: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  WHEN (NEW.email_confirmed_at IS NULL)
  EXECUTE FUNCTION public.handle_auth_user_created();

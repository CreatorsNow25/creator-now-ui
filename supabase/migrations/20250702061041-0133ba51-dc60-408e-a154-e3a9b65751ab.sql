-- Create the email hook trigger for new user signups
CREATE OR REPLACE FUNCTION auth.send_email_hook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Send HTTP request to the send-email edge function
  SELECT net.http_post(
    url := 'https://qwvleuornxbjkudvsifr.supabase.co/functions/v1/send-email',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW),
      'schema', TG_TABLE_SCHEMA,
      'old_record', row_to_json(OLD)
    )::jsonb
  ) INTO request_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on auth.users table for INSERT events
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auth.send_email_hook();
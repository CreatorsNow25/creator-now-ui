-- Check if the email hook trigger exists
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE trigger_name LIKE '%email%' OR action_statement LIKE '%send-email%';
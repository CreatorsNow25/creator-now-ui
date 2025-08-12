-- Fix waitlist_submissions RLS to allow only admin access to sensitive data
-- Drop all existing policies first
DROP POLICY IF EXISTS "Allow public waitlist submissions" ON public.waitlist_submissions;
DROP POLICY IF EXISTS "Authenticated users can view waitlist submissions" ON public.waitlist_submissions;
DROP POLICY IF EXISTS "Authenticated users can update waitlist submissions" ON public.waitlist_submissions;
DROP POLICY IF EXISTS "Authenticated users can delete waitlist submissions" ON public.waitlist_submissions;
DROP POLICY IF EXISTS "Service role full access to waitlist submissions" ON public.waitlist_submissions;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- 1. Allow public users to insert waitlist submissions (for the form)
CREATE POLICY "Allow public waitlist submissions"
ON public.waitlist_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Only allow admin users to view waitlist submissions (protects email data)
CREATE POLICY "Only admins can view waitlist submissions"
ON public.waitlist_submissions
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- 3. Only allow admin users to update waitlist submissions
CREATE POLICY "Only admins can update waitlist submissions"
ON public.waitlist_submissions
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 4. Only allow admin users to delete waitlist submissions
CREATE POLICY "Only admins can delete waitlist submissions"
ON public.waitlist_submissions
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- 5. Keep service role access for backend operations
CREATE POLICY "Service role full access to waitlist submissions"
ON public.waitlist_submissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
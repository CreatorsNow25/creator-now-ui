-- Fix waitlist_submissions RLS policies to prevent public data exposure
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Service role can manage all waitlist submissions" ON public.waitlist_submissions;

-- Create secure policies that protect customer email data
-- 1. Allow public users to insert their waitlist submissions (for signup form)
CREATE POLICY "Allow public waitlist submissions"
ON public.waitlist_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Only allow authenticated users to view waitlist submissions
CREATE POLICY "Authenticated users can view waitlist submissions"
ON public.waitlist_submissions
FOR SELECT
TO authenticated
USING (true);

-- 3. Only allow authenticated users to update waitlist submissions (for admin management)
CREATE POLICY "Authenticated users can update waitlist submissions"
ON public.waitlist_submissions
FOR UPDATE
TO authenticated
USING (true);

-- 4. Only allow authenticated users to delete waitlist submissions (for admin management)
CREATE POLICY "Authenticated users can delete waitlist submissions"
ON public.waitlist_submissions
FOR DELETE
TO authenticated
USING (true);

-- 5. Keep service role access for backend operations
CREATE POLICY "Service role full access to waitlist submissions"
ON public.waitlist_submissions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
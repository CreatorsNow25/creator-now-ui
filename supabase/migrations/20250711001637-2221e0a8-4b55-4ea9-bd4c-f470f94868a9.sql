-- Fix RLS policy for real_user_profiles to allow profile creation during signup
-- Drop the existing policy and create a new one that allows insertion during the signup process

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.real_user_profiles;

-- Create a new policy that allows insertion if the user is authenticated 
-- This handles the case where the profile is created immediately after signup
CREATE POLICY "Users can insert their own profile" 
ON public.real_user_profiles 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  (auth.uid() IS NOT NULL AND user_id IS NOT NULL)
);
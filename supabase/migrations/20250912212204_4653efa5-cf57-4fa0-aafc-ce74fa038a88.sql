-- Add INSERT policy for profiles table to allow users to create their own profiles
-- This is the critical missing piece that prevents new user registration
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);
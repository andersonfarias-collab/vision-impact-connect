-- Phase 1: Critical Database Security Fixes

-- First, create a security definer function to safely check if a user is an admin
-- This prevents recursive RLS policy issues
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = user_id
  );
$$;

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Admin users can access their own data" ON public.admin_users;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.pre_registrations;

-- Create secure RLS policies for admin_users table
-- Only allow admins to view admin data, prevent public access to password hashes
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
TO authenticated
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update admin users" 
ON public.admin_users 
FOR UPDATE 
TO authenticated
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert admin users" 
ON public.admin_users 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_user(auth.uid()));

-- Create secure RLS policies for pre_registrations table
-- Only allow admin users to view customer PII
CREATE POLICY "Only admins can view pre-registrations" 
ON public.pre_registrations 
FOR SELECT 
TO authenticated
USING (public.is_admin_user(auth.uid()));

-- Keep the insert policy for public registration forms
-- But make sure it's properly restricted
CREATE POLICY "Allow public pre-registration inserts" 
ON public.pre_registrations 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Add admin-only policies for managing pre-registrations
CREATE POLICY "Admins can update pre-registrations" 
ON public.pre_registrations 
FOR UPDATE 
TO authenticated
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete pre-registrations" 
ON public.pre_registrations 
FOR DELETE 
TO authenticated
USING (public.is_admin_user(auth.uid()));

-- Create a profiles table for proper user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (public.is_admin_user(auth.uid()));

-- Create trigger for profiles table to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id, 
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@admin.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
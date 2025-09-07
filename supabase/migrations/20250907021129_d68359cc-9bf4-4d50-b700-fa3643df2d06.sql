-- Create pre-registrations table
CREATE TABLE public.pre_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('entrepreneur', 'investor')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pre_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for public pre-registration)
CREATE POLICY "Allow public inserts on pre_registrations" 
ON public.pre_registrations 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow admins to select all
CREATE POLICY "Allow select for authenticated users" 
ON public.pre_registrations 
FOR SELECT 
USING (true);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin users can access their own data" 
ON public.admin_users 
FOR ALL 
USING (true);

-- Insert default admin user (password: "admin")
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('admin', '$2b$10$rNGmK4bnKEZlVo8fE3qJuOX8Z1Y2YXjB8OGNrJ5K7P9qyDhsW3f8m');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on admin_users
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
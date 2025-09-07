-- Insert the new admin user into auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'contato@4visionesg.com.br',
  crypt('@CarlosLucas1', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the user ID for the admin user we just created
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the user ID for the new admin
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'contato@4visionesg.com.br';
    
    -- Insert into profiles table
    INSERT INTO public.profiles (id, email, role)
    VALUES (admin_user_id, 'contato@4visionesg.com.br', 'admin');
    
    -- Insert into admin_users table
    INSERT INTO public.admin_users (id, username, password_hash)
    VALUES (admin_user_id, 'contato@4visionesg.com.br', crypt('@CarlosLucas1', gen_salt('bf')));
END $$;

-- Update the handle_new_user function to recognize the new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id, 
    NEW.email,
    CASE 
      WHEN NEW.email IN ('admin@admin.com', 'contato@4visionesg.com.br') THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$function$;
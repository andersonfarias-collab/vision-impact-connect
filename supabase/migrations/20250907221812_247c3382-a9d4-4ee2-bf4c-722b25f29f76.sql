-- Get the user ID for the existing admin user
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the user ID for the admin
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'contato@4visionesg.com.br';
    
    -- Update or insert into profiles table
    INSERT INTO public.profiles (id, email, role)
    VALUES (admin_user_id, 'contato@4visionesg.com.br', 'admin')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = 'admin',
        updated_at = NOW();
    
    -- Update or insert into admin_users table
    INSERT INTO public.admin_users (id, username, password_hash)
    VALUES (admin_user_id, 'contato@4visionesg.com.br', crypt('@CarlosLucas1', gen_salt('bf')))
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        password_hash = crypt('@CarlosLucas1', gen_salt('bf')),
        updated_at = NOW();
        
    -- Update the user's password in auth.users
    UPDATE auth.users 
    SET encrypted_password = crypt('@CarlosLucas1', gen_salt('bf')),
        updated_at = NOW()
    WHERE email = 'contato@4visionesg.com.br';
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
-- Update existing user or insert new admin user
DO $$
DECLARE
    admin_user_id uuid;
    user_exists boolean := false;
BEGIN
    -- Check if user already exists
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'contato@4visionesg.com.br';
    
    IF admin_user_id IS NOT NULL THEN
        user_exists := true;
    END IF;
    
    -- If user doesn't exist, create it
    IF NOT user_exists THEN
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
        
        -- Get the newly created user ID
        SELECT id INTO admin_user_id 
        FROM auth.users 
        WHERE email = 'contato@4visionesg.com.br';
    END IF;
    
    -- Insert or update profiles table
    INSERT INTO public.profiles (id, email, role)
    VALUES (admin_user_id, 'contato@4visionesg.com.br', 'admin')
    ON CONFLICT (id) 
    DO UPDATE SET 
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        updated_at = NOW();
    
    -- Insert or update admin_users table
    INSERT INTO public.admin_users (id, username, password_hash)
    VALUES (admin_user_id, 'contato@4visionesg.com.br', crypt('@CarlosLucas1', gen_salt('bf')))
    ON CONFLICT (id) 
    DO UPDATE SET 
        username = EXCLUDED.username,
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW();
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
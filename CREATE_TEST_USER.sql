-- Create a test user with full admin access
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
  new_user_id UUID;
  test_email TEXT := 'google@test.com';
  test_password TEXT := 'Tester123!';
BEGIN
  -- 1. Check if user already exists in auth.users
  SELECT id INTO new_user_id FROM auth.users WHERE email = test_email;

  IF new_user_id IS NULL THEN
    -- Generate a new UUID
    new_user_id := gen_random_uuid();
    
    -- Insert into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
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
      new_user_id,
      'authenticated',
      'authenticated',
      test_email,
      crypt(test_password, gen_salt('bf')),
      now(), -- Auto-confirm email
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Google Reviewer"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
    
    -- Insert into auth.identities (Required for some auth flows)
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      new_user_id,
      json_build_object('sub', new_user_id, 'email', test_email),
      'email',
      test_email,
      now(),
      now(),
      now()
    );
    
    RAISE NOTICE 'Created new user: %', test_email;
  ELSE
    RAISE NOTICE 'User % already exists with ID: %', test_email, new_user_id;
  END IF;

  -- 2. Create or Update Public Profile (Full Access / Subscription)
  INSERT INTO public.user_profiles (id, email, full_name, subscription_status, subscription_plan, updated_at)
  VALUES (
    new_user_id, 
    test_email, 
    'Google Reviewer', 
    'active', 
    'premium', 
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    subscription_status = 'active', 
    subscription_plan = 'premium',
    updated_at = now();

  -- 3. Grant Admin Access
  INSERT INTO public.admin_users (id, email)
  VALUES (new_user_id, test_email)
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE 'Granted Admin access and Active Subscription to %', test_email;

END $$;

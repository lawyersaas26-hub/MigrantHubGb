-- Fix missing user profiles
-- This script creates profiles for users that exist in auth.users but not in user_profiles

-- First, create a function to safely create missing profiles
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void AS $$
DECLARE
    au RECORD;
BEGIN
    -- Insert profiles for users that don't have one
    -- Use a loop to check each user individually to avoid ON CONFLICT issues
    FOR au IN 
        SELECT 
            au.id,
            au.email,
            COALESCE(au.raw_user_meta_data->>'full_name', NULL) as full_name
        FROM auth.users au
        WHERE NOT EXISTS (
            SELECT 1 FROM public.user_profiles up WHERE up.id = au.id
        )
    LOOP
        BEGIN
            INSERT INTO public.user_profiles (id, email, full_name, subscription_plan, subscription_status)
            VALUES (
                au.id,
                au.email,
                au.full_name,
                NULL,
                'inactive'
            );
        EXCEPTION
            WHEN unique_violation THEN
                -- Profile already exists, skip
                CONTINUE;
            WHEN OTHERS THEN
                -- Log error but continue
                RAISE WARNING 'Error creating profile for user %: %', au.id, SQLERRM;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to create missing profiles
SELECT public.create_missing_profiles();

-- Create profile for specific user (mila.mueen16@gmail.com)
-- User UID: a955dadb-e2e3-49c5-ab97-945d242e46f2
-- First check if profile exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = 'a955dadb-e2e3-49c5-ab97-945d242e46f2') THEN
        INSERT INTO public.user_profiles (id, email, full_name, subscription_plan, subscription_status)
        VALUES (
            'a955dadb-e2e3-49c5-ab97-945d242e46f2',
            'mila.mueen16@gmail.com',
            NULL,
            NULL,
            'inactive'
        );
    ELSE
        -- Update existing profile
        UPDATE public.user_profiles
        SET 
            email = 'mila.mueen16@gmail.com',
            updated_at = NOW()
        WHERE id = 'a955dadb-e2e3-49c5-ab97-945d242e46f2';
    END IF;
END $$;

-- Verify the profile was created
SELECT id, email, full_name, subscription_plan, subscription_status, created_at
FROM public.user_profiles
WHERE id = 'a955dadb-e2e3-49c5-ab97-945d242e46f2';

-- Also check and fix the trigger
-- Drop and recreate the trigger to ensure it's working
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Check if profile already exists before inserting
    IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = NEW.id) THEN
        INSERT INTO public.user_profiles (id, email, full_name, subscription_plan, subscription_status)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
            NULL,
            'inactive'
        );
    END IF;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Error creating user profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Verify trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';


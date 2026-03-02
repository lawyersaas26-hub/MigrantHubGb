-- Ensure user profile trigger is properly set up
-- Run this in Supabase SQL Editor to fix the trigger

-- First, check if trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the trigger function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
AS $$
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
        -- Log error but don't fail user creation
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Verify it was created
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';


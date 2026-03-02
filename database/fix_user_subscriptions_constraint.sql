-- Fix user_subscriptions table to ensure unique constraint exists
-- This script ensures the unique constraint on user_id exists for proper upsert operations

-- First, check if the constraint exists and drop it if it does (to recreate with proper name)
DO $$
BEGIN
    -- Drop existing unique constraint if it exists (might have different name)
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'public.user_subscriptions'::regclass 
        AND contype = 'u'
        AND array_to_string(conkey, ',') = (
            SELECT array_to_string(ARRAY(
                SELECT attnum FROM pg_attribute 
                WHERE attrelid = 'public.user_subscriptions'::regclass 
                AND attname = 'user_id'
            ), ',')
        )
    ) THEN
        ALTER TABLE public.user_subscriptions 
        DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_key;
    END IF;
END $$;

-- Create unique constraint with explicit name
ALTER TABLE public.user_subscriptions 
ADD CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id);

-- Verify the constraint was created
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.user_subscriptions'::regclass
AND contype = 'u';






-- Fix UUID Generation for Jobs Table
-- This ensures the id column auto-generates UUIDs

-- First, enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if the id column exists and has the correct default
-- If the column doesn't have a default, add it
DO $$
BEGIN
    -- Check if default exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'id'
        AND column_default IS NOT NULL
    ) THEN
        -- Add default UUID generation
        ALTER TABLE jobs 
        ALTER COLUMN id SET DEFAULT uuid_generate_v4();
        
        RAISE NOTICE 'UUID default added to id column';
    ELSE
        RAISE NOTICE 'UUID default already exists';
    END IF;
END $$;

-- Verify the column has the default
SELECT 
    column_name,
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'jobs' 
AND column_name = 'id';












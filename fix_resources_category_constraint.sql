-- Fix Resources Category Constraint
-- This removes the hardcoded category check constraint and adds a foreign key
-- Run this in your Supabase SQL Editor AFTER running supabase_categories_setup.sql

-- Step 1: Drop the old hardcoded check constraint
ALTER TABLE resources 
DROP CONSTRAINT IF EXISTS resources_category_check;

-- Step 2: Add a foreign key constraint to ensure category_id references categories table
-- This ensures data integrity by only allowing category_ids that exist in the categories table
-- First, drop the constraint if it already exists
ALTER TABLE resources
DROP CONSTRAINT IF EXISTS resources_category_fkey;

-- Then add it
ALTER TABLE resources
ADD CONSTRAINT resources_category_fkey 
FOREIGN KEY (category_id) 
REFERENCES categories(id) 
ON DELETE RESTRICT;

-- Note: ON DELETE RESTRICT means you cannot delete a category that has resources
-- This prevents accidental deletion and orphaned resources.
-- 
-- If you want to allow deletion, you would need to:
-- 1. Delete or move all resources first, OR
-- 2. Change ON DELETE RESTRICT to ON DELETE CASCADE (deletes all resources when category is deleted)
--    WARNING: ON DELETE CASCADE is dangerous as it will delete all resources in a category


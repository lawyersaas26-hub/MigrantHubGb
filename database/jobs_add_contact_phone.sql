-- Migration: Add contact_phone column to existing jobs table
-- Run this if you already created the jobs table without the contact_phone field

-- Simple version - just add the column
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Verify the column was added (optional check)
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'jobs' 
-- AND column_name = 'contact_phone';


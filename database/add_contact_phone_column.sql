-- Add contact_phone column to existing jobs table
-- Run this if you already created the jobs table without the contact_phone field

ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'jobs' 
AND column_name = 'contact_phone';












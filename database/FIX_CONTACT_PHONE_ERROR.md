# Fix Contact Phone Column Error

## Error: `Could not find the 'contact_phone' column of 'jobs' in the schema cache`

This error occurs because the `contact_phone` column doesn't exist in your jobs table yet.

## Quick Fix

Run this SQL in your Supabase SQL Editor:

```sql
-- Add contact_phone column to existing jobs table
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS contact_phone TEXT;
```

## Alternative: Run the Migration File

Run `database/add_contact_phone_column.sql` or `database/jobs_add_contact_phone.sql`

## Verify Column Was Added

After running the SQL, verify the column exists:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'jobs' 
AND column_name = 'contact_phone';
```

You should see:
```
column_name    | data_type
---------------|----------
contact_phone  | text
```

## After Adding the Column

1. Refresh your Supabase dashboard
2. Try submitting a job again
3. The form should now work correctly

## Complete Table Structure

Your jobs table should now have these columns:
- id (UUID)
- title (TEXT)
- company (TEXT)
- location (TEXT)
- description (TEXT)
- salary (TEXT)
- type (TEXT)
- requirements (TEXT)
- apply_url (TEXT)
- apply_email (TEXT)
- category (TEXT)
- **contact_phone (TEXT)** ← This is what was missing
- is_active (BOOLEAN)
- posted_date (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- created_by (UUID)
- updated_by (UUID)












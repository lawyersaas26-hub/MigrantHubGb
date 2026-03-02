# Jobs Table Setup Guide

This guide explains how to set up the jobs table in your Supabase database.

## 📋 Table Options

There are two SQL files available:

1. **`jobs_table.sql`** - Full-featured version with advanced features
2. **`jobs_table_simple.sql`** - Minimal version with basic functionality

## 🚀 Quick Setup (Recommended: Simple Version)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `jobs_table_simple.sql`
4. Click **Run**

## 📊 Table Structure

### Required Fields
- `id` - UUID primary key
- `title` - Job title
- `company` - Company name
- `location` - Job location
- `description` - Job description

### Optional Fields
- `salary` - Salary information (e.g., "£10-12/hour")
- `type` - Job type (full-time, part-time, contract, temporary)
- `requirements` - Job requirements
- `apply_url` - Application URL
- `apply_email` - Application email
- `category` - Job category (retail, warehouse, hospitality, cleaning, security, office, other)

### Status Fields
- `is_active` - Whether job is active and visible (default: false, requires admin approval)
- `posted_date` - Date job was posted
- `created_at` - Timestamp when record was created
- `updated_at` - Timestamp when record was last updated

## 🔐 Row Level Security (RLS)

The table includes RLS policies:
- ✅ **Public can view active jobs** - Anyone can see approved jobs
- ✅ **Public can submit jobs** - Anyone can submit a job (pending approval)
- ✅ **Admins can manage all jobs** - Admins can view, edit, and delete all jobs

## 📝 Usage

### Insert a Job (Public Submission)
```sql
INSERT INTO jobs (title, company, location, description, type, category)
VALUES (
    'Customer Service Assistant',
    'Retail Store',
    'London',
    'We are looking for a friendly customer service assistant.',
    'part-time',
    'retail'
);
```

### Approve a Job (Admin Only)
```sql
UPDATE jobs
SET is_active = TRUE, updated_by = auth.uid()
WHERE id = 'job-uuid-here';
```

### Get Active Jobs
```sql
SELECT * FROM jobs
WHERE is_active = TRUE
ORDER BY posted_date DESC;
```

## 🔧 Advanced Features (Full Version)

The full version (`jobs_table.sql`) includes:
- ✅ Verified employer flag
- ✅ Featured jobs flag
- ✅ Views and applications tracking
- ✅ Work location type (on-site, remote, hybrid)
- ✅ Experience level (entry, mid, senior, executive)
- ✅ Full-text search index
- ✅ Email and URL validation
- ✅ Expiry date for job postings

## ⚠️ Important Notes

1. **Admin Approval Required**: All jobs start with `is_active = FALSE` and require admin approval
2. **User Profiles Table**: The admin policies require a `user_profiles` table with `is_admin` column
3. **UUID Extension**: Make sure `uuid-ossp` extension is enabled in Supabase

## 🛠️ Troubleshooting

### If you get an error about user_profiles:
Make sure you have a `user_profiles` table. You can create it with:

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    is_admin BOOLEAN DEFAULT FALSE,
    -- Add other profile fields as needed
);
```

### If UUID generation fails:
Enable the UUID extension:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## 📱 Integration with App

The app's `submitJob()` function in `lib/supabase.ts` will automatically:
- Set `is_active = FALSE` (pending approval)
- Set `posted_date` to current date
- Insert the job into the database

Admins can then approve jobs through the admin dashboard.












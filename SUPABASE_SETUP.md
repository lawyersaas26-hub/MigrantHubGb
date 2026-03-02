# Supabase Setup Guide

This guide explains how to connect your app to Supabase and display resources from the database.

## 📋 Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project with the `resources` table created
3. Your Supabase project URL and anon key

## 🔑 Required Supabase Credentials

You need two values from your Supabase project:

### 1. Supabase Project URL
- Go to your Supabase dashboard: https://supabase.com/dashboard
- Select your project
- Go to **Settings** > **API**
- Copy the **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)

### 2. Supabase Anon Key
- In the same **Settings** > **API** page
- Copy the **anon public** key (this is safe to expose in client-side code)

## ⚙️ Environment Variables Setup

1. Create a `.env` file in the root of your project (if it doesn't exist)

2. Add the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
```

3. **Important:** Make sure `.env` is in your `.gitignore` file to keep your keys secure!

4. Restart your development server after adding environment variables:
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

Your `resources` table should have the following structure (which you've already created):

```sql
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id varchar(50) NOT NULL,
  language varchar(10) NOT NULL DEFAULT 'ku',
  title varchar(500) NOT NULL,
  slug varchar(500),
  html_content text NOT NULL,
  description text,
  external_link varchar(1000),
  phone varchar(50),
  email varchar(255),
  source varchar(255),
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);
```

## 🔒 Row Level Security (RLS) Setup

Make sure RLS policies are set up correctly in Supabase:

1. Go to **Authentication** > **Policies** in your Supabase dashboard
2. Select the `resources` table
3. Ensure there's a policy that allows public read access to active resources:

```sql
-- Allow public to read active resources
CREATE POLICY "Public can read active resources"
ON resources
FOR SELECT
USING (is_active = true);
```

## 📝 Adding Content to Supabase

### Option 1: Using Supabase Dashboard

1. Go to **Table Editor** in your Supabase dashboard
2. Select the `resources` table
3. Click **Insert** > **Insert row**
4. Fill in the fields:
   - `category_id`: e.g., 'healthcare', 'housing', etc.
   - `language`: 'ku' (Kurdish) or 'ar' (Arabic)
   - `title`: The resource title
   - `slug`: URL-friendly identifier (e.g., 'how-to-register-with-gp')
   - `html_content`: Your HTML content
   - `description`: Short description (optional)
   - `display_order`: Number for sorting (0, 1, 2, etc.)
   - `is_active`: true

### Option 2: Using SQL

```sql
INSERT INTO resources (
  category_id,
  language,
  title,
  slug,
  html_content,
  description,
  display_order
) VALUES (
  'healthcare',
  'ku',
  'چۆنیەتی ناساندن بە GP',
  'how-to-register-with-gp',
  '<div><h2>چۆنیەتی ناساندن بە GP</h2><p>ناساندن بە دکتۆری خێزانی...</p></div>',
  'زانیاری دەربارەی چۆنیەتی ناساندن بە دکتۆری خێزانی',
  1
);
```

## 🚀 How It Works

1. **CategoryDetail Page**: 
   - Fetches resources from Supabase for the selected category and language
   - Falls back to static content if no Supabase data is found
   - Shows a "Read More" button for resources with HTML content

2. **ResourceDetail Page**:
   - Displays the full HTML content from the database
   - Shows contact information (phone, email) if available
   - Provides link to external resources if available

## 🔍 Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to a category (e.g., Healthcare)
3. If you have resources in Supabase, they should appear
4. Click "Read More" on a resource with HTML content to see the full page

## 🐛 Troubleshooting

### Resources not showing up?

1. **Check environment variables**: Make sure `.env` file has correct values
2. **Check RLS policies**: Ensure public read access is enabled
3. **Check data**: Verify resources exist in Supabase with `is_active = true`
4. **Check browser console**: Look for error messages
5. **Check network tab**: Verify API calls are being made

### "Supabase URL or Anon Key is missing" warning?

- Make sure your `.env` file exists and has the correct variable names
- Variable names must start with `VITE_` for Vite to expose them
- Restart your dev server after adding/changing environment variables

### Resources showing but HTML content not displaying?

- Check that `html_content` field is not empty
- Verify the `slug` field is set (required for navigation)
- Check browser console for any rendering errors

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)


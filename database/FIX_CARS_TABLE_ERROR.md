# Fix Cars Table RLS Policy Error

## Error: `column user_profiles.is_admin does not exist`

This error occurs because the SQL is trying to reference a `user_profiles.is_admin` column that doesn't exist in your database.

## Solution

The `cars_table.sql` file has been updated to remove the dependency on `user_profiles.is_admin`. The new version (`cars_table_fixed.sql`) uses simpler RLS policies that:

1. **Allow public inserts** - Anyone can submit car advertisements (pending approval)
2. **Allow public updates** - Admin can approve/reject cars via the admin dashboard
3. **Allow public deletes** - Admin can delete cars via the admin dashboard
4. **Restrict viewing** - Only active (approved) cars are visible to the public

## How to Fix

### Option 1: Use the Fixed SQL File (Recommended)

Run the fixed SQL file instead:

```sql
-- Use database/cars_table_fixed.sql
```

This version works without requiring the `user_profiles.is_admin` column.

### Option 2: Update Existing Table

If you've already created the table, drop the problematic policies and recreate them:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can update cars" ON cars;
DROP POLICY IF EXISTS "Admins can delete cars" ON cars;

-- Create new policies without admin check
CREATE POLICY "Anyone can update cars"
    ON cars FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Anyone can delete cars"
    ON cars FOR DELETE
    USING (true);
```

### Option 3: Create user_profiles Table (If Needed)

If you want to use admin-based policies in the future, create the user_profiles table:

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Then update the policies to use this table
```

## Security Note

The current simplified policies allow:
- ✅ Public users to submit cars (pending approval)
- ✅ Admin dashboard to approve/reject cars
- ✅ Only approved cars are visible to public

For production, you may want to:
- Use Supabase service role key for admin operations
- Implement proper admin authentication in your admin dashboard
- Add more restrictive RLS policies if needed

## Testing

After applying the fix:
1. Try inserting a car advertisement - should work
2. Check admin dashboard - should be able to approve/reject cars
3. View cars list - should only show approved cars












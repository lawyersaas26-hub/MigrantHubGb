# Admin Dashboard Setup Guide

This guide explains how to set up and use the admin dashboard to manage content in your Iraqi Immigrant Guide UK app.

## 🎯 Overview

The admin dashboard allows authenticated administrators to:
- Create, edit, and delete resources
- Manage HTML content for each category
- Toggle resource active/inactive status
- View all resources in a table format

## 📋 Prerequisites

1. Supabase project set up
2. Admin user account created in Supabase Auth
3. Environment variables configured (`.env` file)

## 🔧 Setup Steps

### Step 1: Run SQL Setup Scripts

1. Open your Supabase dashboard
2. Go to **SQL Editor**
3. First, run `supabase_admin_setup.sql`:
   - Copy and paste the contents of `supabase_admin_setup.sql`
   - Run the SQL script
4. Then, run `supabase_categories_setup.sql`:
   - Copy and paste the contents of `supabase_categories_setup.sql`
   - Run the SQL script
5. **IMPORTANT**: Run `fix_resources_category_constraint.sql`:
   - Copy and paste the contents of `fix_resources_category_constraint.sql`
   - Run the SQL script
   - This removes the hardcoded category check constraint and allows dynamic categories

This will:
- Create the `admin_users` table
- Create the `categories` table
- Remove hardcoded category constraint from `resources` table
- Add foreign key relationship between resources and categories
- Set up Row Level Security (RLS) policies
- Configure admin-only access to resources and categories
- Insert default categories matching your existing setup

### Step 2: Create Admin User (Using Signup Page)

1. Navigate to: `http://localhost:5173/admin/signup`
2. Fill in the signup form:
   - Enter your email
   - Create a password (minimum 6 characters)
   - Confirm your password
3. Click **"Create Admin Account"**
4. You'll be automatically added to the `admin_users` table
5. You'll be redirected to the login page

**Note**: The signup page automatically adds users to the admin table, so no manual SQL is needed!

### Step 3: Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/admin/signup` to create your first admin account

3. After signup, you'll be redirected to the login page

4. Sign in with your admin credentials

5. You should be redirected to `/admin/dashboard`

## 🚀 Accessing the Admin Dashboard

### Development
- Signup: `http://localhost:5173/admin/signup`
- Login: `http://localhost:5173/admin/login`

### Production
- Signup: `https://yourdomain.com/admin/signup`
- Login: `https://yourdomain.com/admin/login`

## 📖 Using the Admin Dashboard

### Dashboard Overview

The dashboard shows:
- **Header**: Your email and navigation buttons (Resources, Categories, Sign Out)
- **Resources Table**: All resources with:
  - Title and slug
  - Category
  - Language
  - Active/Inactive status
  - Edit and Delete actions

### Managing Categories

Click the **"Categories"** button in the dashboard header to manage categories.

**Features:**
- View all categories in a table
- See icon preview, names in all languages
- Create new categories
- Edit existing categories
- Delete categories
- Toggle active/inactive status

**Creating a Category:**
1. Click **"New Category"** from the Categories page
2. Fill in required fields:
   - **Category ID**: Unique identifier (lowercase, no spaces, e.g., `transportation`)
   - **Kurdish Name**: Required
   - **Arabic Name**: Required
   - **English Name**: Optional
   - **Icon**: Select from available Lucide icons
   - **Color**: Choose from color palette or enter custom Tailwind class
   - **Display Order**: Number for sorting (0, 1, 2, etc.)
   - **Active**: Toggle to show/hide category
   - **Descriptions**: Optional descriptions in all languages
3. Click **"Save Category"**

### Creating a New Resource

1. Click **"New Resource"** button
2. Fill in the form:
   - **Category**: Select from dropdown
   - **Language**: Kurdish, Arabic, or English
   - **Title**: Resource title (required)
   - **Slug**: URL-friendly identifier (optional but recommended)
   - **Description**: Brief description (optional)
   - **HTML Content**: Full HTML content (required)
   - **Contact Info**: Phone, email (optional)
   - **External Link**: Link to more info (optional)
   - **Source**: Content source (optional)
   - **Display Order**: Order for sorting (default: 0)
   - **Active**: Toggle to show/hide resource
3. Click **"Save Resource"**

### Editing a Resource

1. From the dashboard, click the **Edit** icon (pencil) next to a resource
2. Modify the fields as needed
3. Click **"Save Resource"**

### Deleting a Resource

1. From the dashboard, click the **Delete** icon (trash) next to a resource
2. Confirm deletion in the dialog
3. Resource will be permanently deleted

### Toggling Resource Status

1. Edit a resource
2. Check/uncheck the **"Active"** checkbox
3. Active resources are visible to users
4. Inactive resources are hidden from users but visible in admin

## 🔒 Security

### Authentication
- Admin routes are protected by authentication
- Only users in the `admin_users` table can access
- Session is checked on every page load

### Row Level Security (RLS)
- Public users can only read active resources
- Admins can read, create, update, and delete all resources
- Policies are enforced at the database level

## 📝 HTML Content Guidelines

When creating HTML content:

1. **Use Tailwind CSS classes** for styling (they're already loaded)
2. **Support RTL languages**:
   - Add `dir="rtl"` to containers for Kurdish/Arabic
   - Wrap English text/numbers in `<span dir="ltr">`
3. **Use Phosphor icons**:
   ```html
   <i class="ph ph-icon-name"></i>
   ```
4. **Responsive design**: Test on mobile devices
5. **Accessibility**: Use semantic HTML

### Example HTML Content Structure

```html
<div class="bg-white rounded-2xl p-6 shadow-sm">
    <h2 class="text-2xl font-bold mb-4">Title</h2>
    <p class="text-gray-700 mb-4">Description text...</p>
    
    <div class="space-y-4">
        <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold mb-2">Section Title</h3>
            <p>Content here...</p>
        </div>
    </div>
</div>
```

## 🐛 Troubleshooting

### "User is not an admin" Error
- **Solution**: Make sure the user signed up using the `/admin/signup` page (which automatically adds them to admin_users)
- **Alternative**: If you need to manually add a user, run this SQL:
  ```sql
  INSERT INTO admin_users (id, email) 
  VALUES ('USER_UUID', 'user@example.com');
  ```

### Signup Fails
- **Check**: Password is at least 6 characters
- **Check**: Passwords match
- **Check**: Email is valid and not already registered
- **Check**: RLS policy "Users can insert themselves as admin" is created

### Can't Access Dashboard
- **Check**: User is signed in
- **Check**: User exists in `admin_users` table
- **Check**: RLS policies are set up correctly

### Resources Not Saving
- **Check**: All required fields are filled (title, html_content)
- **Check**: Category ID matches allowed values
- **Check**: Browser console for error messages

### Build Errors
- **Check**: All admin files are in `pages/admin/` folder
- **Check**: Imports are correct
- **Run**: `npm run build` to see specific errors

## 🔄 Next Steps (Optional Enhancements)

1. **Rich Text Editor**: Install `react-quill` or `@tiptap/react` for WYSIWYG editing
2. **Category Management**: Add pages to manage categories
3. **Image Upload**: Integrate Supabase Storage for images
4. **Preview Mode**: Add preview before publishing
5. **Bulk Operations**: Add select multiple and bulk delete
6. **Search/Filter**: Add search and filter in dashboard table

## 📚 Related Files

- `supabase_admin_setup.sql` - Database setup script
- `lib/adminAuth.ts` - Authentication functions
- `lib/supabase.ts` - Database functions
- `pages/admin/AdminLogin.tsx` - Login page
- `pages/admin/AdminDashboard.tsx` - Dashboard page
- `pages/admin/AdminResourceForm.tsx` - Create/Edit form

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase RLS policies are correct
3. Ensure admin user is properly set up
4. Check environment variables are loaded

---

**Note**: Keep your admin credentials secure. Never commit `.env` files or expose admin endpoints publicly in production without additional security measures.


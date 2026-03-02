# Category Management Guide

This guide explains how to manage categories in the admin dashboard.

## 🎯 Overview

Categories are used to organize resources in your app. Each category has:
- **ID**: Unique identifier (cannot be changed after creation)
- **Names**: Kurdish, Arabic, and English names
- **Icon**: Visual representation (from Lucide icon library)
- **Color**: Background color (Tailwind CSS class)
- **Display Order**: Controls sorting order
- **Status**: Active/Inactive (active categories are visible to users)

## 📋 Accessing Category Management

1. Log in to the admin dashboard: `http://localhost:5173/admin/login`
2. Click the **"Categories"** button in the header
3. You'll see a table of all categories

## ➕ Creating a New Category

### Step 1: Click "New Category"

From the Categories page, click the **"New Category"** button.

### Step 2: Fill in Category Details

#### Required Fields:
- **Category ID**: 
  - Must be unique
  - Lowercase letters, numbers, and hyphens only
  - Examples: `transportation`, `employment-support`, `health-services`
  - ⚠️ Cannot be changed after creation

- **Kurdish Name**: 
  - Name displayed in Kurdish (RTL)
  - Example: `گواستنەوە`

- **Arabic Name**: 
  - Name displayed in Arabic (RTL)
  - Example: `النقل`

- **Icon**: 
  - Select from dropdown of available Lucide icons
  - Icons like: FileText, Home, Briefcase, Heart, etc.
  - Preview updates automatically

- **Color**: 
  - Click a color from the palette, OR
  - Enter a custom Tailwind CSS class (e.g., `bg-indigo-600`)
  - Preview updates automatically

#### Optional Fields:
- **English Name**: Name displayed in English
- **Description**: Descriptions in Kurdish, Arabic, and English
- **Display Order**: Number for sorting (default: 0)
- **Active**: Checkbox to show/hide category (default: checked)

### Step 3: Preview

A preview box shows how your category will appear with the selected icon and color.

### Step 4: Save

Click **"Save Category"** to create the category.

## ✏️ Editing a Category

1. From the Categories table, click the **Edit** icon (pencil) next to a category
2. Modify any fields (except Category ID)
3. Click **"Save Category"**

**Note**: Category ID cannot be changed after creation. If you need to change it, you'll need to:
1. Create a new category with the desired ID
2. Update all resources to use the new category ID
3. Delete the old category

## 🗑️ Deleting a Category

1. From the Categories table, click the **Delete** icon (trash) next to a category
2. Confirm deletion in the dialog

**Warning**: 
- Deleting a category does NOT delete associated resources
- Resources will become "orphaned" (no category)
- Consider deactivating instead of deleting if you want to hide it temporarily

## 👁️ Active vs Inactive

- **Active**: Category is visible to users in the app
- **Inactive**: Category is hidden from users but still exists in the database

Use inactive status to:
- Temporarily hide categories without deleting them
- Test new categories before making them public
- Archive old categories

## 🎨 Icon Selection

Available icons include:
- FileText, Home, Briefcase, GraduationCap, Heart, Scale
- Wallet, Globe, Phone, Building, User, Users
- Calendar, MapPin, Mail, PhoneCall, Video, Camera
- ShoppingBag, CreditCard, Banknote, TrendingUp, Award
- Book, BookOpen, MessageCircle, Settings, HelpCircle
- And many more...

If you need an icon that's not in the list, you can:
1. Add it to `utils/iconMapper.ts`
2. Import it from `lucide-react`
3. Add it to the `iconMap` object

## 🎨 Color Options

### Predefined Colors:
The form includes 15 common colors:
- Blue, Indigo, Purple, Pink, Rose
- Red, Orange, Amber, Yellow, Lime
- Green, Emerald, Teal, Cyan, Sky

### Custom Colors:
You can enter any Tailwind CSS background class:
- Format: `bg-{color}-{shade}`
- Examples: `bg-blue-500`, `bg-purple-700`, `bg-indigo-600`
- Use Tailwind color palette: https://tailwindcss.com/docs/customizing-colors

## 📊 Display Order

Categories are sorted by `display_order` (ascending), then by ID.

**Tips:**
- Use 1, 2, 3... for main categories
- Use 10, 20, 30... to leave room for future reordering
- Categories with the same order are sorted alphabetically by ID

## 🔄 Best Practices

1. **Plan Category IDs**: Choose clear, descriptive IDs that won't need changing
2. **Consistent Naming**: Keep naming consistent across languages
3. **Color Coordination**: Use colors that work well with your app theme
4. **Icon Relevance**: Choose icons that clearly represent the category
5. **Ordering**: Use display order to group related categories
6. **Deactivate, Don't Delete**: If unsure, deactivate instead of deleting

## 🔗 Related Resources

- **Resources Table**: Categories are referenced in the `resources` table via `category_id`
- **Resources Management**: Manage resources at `/admin/dashboard`
- **App Display**: Categories appear in the home page category grid

## 🐛 Troubleshooting

### Category ID Already Exists
- Category IDs must be unique
- Check the existing categories list
- Use a different ID or edit the existing category

### Icon Not Showing
- Make sure the icon name matches exactly (case-sensitive)
- Check `utils/iconMapper.ts` to see available icons
- Add the icon to the mapper if needed

### Color Not Applying
- Ensure it's a valid Tailwind CSS class
- Format: `bg-{color}-{shade}`
- Test in the preview box before saving

### Category Not Appearing in App
- Check that `is_active` is set to `true`
- Verify the category has resources (if needed)
- Clear browser cache and refresh




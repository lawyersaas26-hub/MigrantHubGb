# Driving Instructors Feature Setup Guide

This guide explains how to set up and use the driving instructors feature in your app.

## 📋 Overview

The driving instructors feature allows users to:
- Browse and search for driving instructors
- Filter by location, language, vehicle type, rating, and price
- View detailed instructor profiles with contact information
- Contact instructors directly via phone or email

## 🗄️ Database Setup

### Step 1: Create the Table

1. Open your Supabase dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase_driving_instructors_setup.sql`
4. Run the SQL script

This will create:
- `driving_instructors` table with all necessary fields
- Indexes for fast queries
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates

### Step 2: Verify Table Creation

Check that the table was created successfully:
- Go to **Table Editor** in Supabase
- You should see `driving_instructors` table
- Verify all columns are present

## 📝 Adding Instructors

### Option 1: Via Supabase Dashboard

1. Go to **Table Editor** > `driving_instructors`
2. Click **Insert** > **Insert row**
3. Fill in the fields:
   - **name**: Instructor's full name (required)
   - **phone**: Phone number (required)
   - **email**: Email address (optional)
   - **location**: City/area (e.g., "London", "Manchester")
   - **postcode**: UK postcode (optional, for better filtering)
   - **languages_spoken**: Array of languages (e.g., `["ku", "ar", "en"]`)
   - **experience_years**: Number of years of experience
   - **rating**: Rating from 0.00 to 5.00
   - **total_reviews**: Number of reviews
   - **price_per_hour**: Price in GBP (e.g., 35.00)
   - **vehicle_type**: "manual", "automatic", or "both"
   - **availability**: "full-time", "part-time", or "weekends-only"
   - **bio**: Instructor description/bio
   - **specialties**: Array (e.g., `["beginner", "test-prep", "refresher"]`)
   - **is_active**: true (to show in app)
   - **is_verified**: true (to show verified badge)

### Option 2: Via SQL

```sql
INSERT INTO driving_instructors (
    name, phone, email, location, postcode, languages_spoken,
    experience_years, rating, total_reviews, price_per_hour,
    vehicle_type, availability, bio, specialties, is_active, is_verified
) VALUES (
    'John Smith',
    '+44 7700 900123',
    'john.smith@example.com',
    'London',
    'SW1A 1AA',
    ARRAY['en', 'ku'],
    10,
    4.8,
    45,
    35.00,
    'both',
    'full-time',
    'Experienced driving instructor with 10 years of teaching experience. Specializes in helping nervous learners and test preparation.',
    ARRAY['beginner', 'test-prep'],
    true,
    true
);
```

## 🔗 Adding Link in Driving Category

To make the instructors list accessible from the driving category:

1. Go to your admin dashboard: `http://localhost:5173/admin/dashboard`
2. Click **New Resource**
3. Fill in:
   - **Category**: Select "driving"
   - **Language**: Select your language (ku/ar)
   - **Title**: "Find Driving Instructors" (or in Kurdish/Arabic)
   - **Slug**: "driving-instructors" (or similar)
   - **Description**: Brief description
   - **HTML Content**: Leave empty (or add description)
   - **External Link**: Leave empty
   - **Display Order**: Set a number (e.g., 1)
   - **Is Active**: Check this
4. Click **Save Resource**

**Important**: The resource needs to link to `/driving-instructors`. You can either:
- Add a custom button in the CategoryDetail page for this specific resource, OR
- Create a resource with HTML content that includes a link

### Alternative: Direct Navigation

You can also add a direct link by modifying the driving category resources to include a button that navigates to `/driving-instructors`.

## 🎨 Features

### Search Functionality
- Search by instructor name, location, or bio
- Real-time search as you type

### Filters
- **Location**: Filter by city/area
- **Language**: Filter by languages spoken (Kurdish, Arabic, English)
- **Vehicle Type**: Manual, Automatic, or Both
- **Min Rating**: Minimum rating (0-5)
- **Max Price**: Maximum price per hour in GBP

### Instructor Cards
- Name with verification badge (if verified)
- Rating and number of reviews
- Location
- Price per hour
- Experience years
- Languages spoken
- Bio preview

### Instructor Detail Page
- Full profile information
- Contact buttons (phone and email)
- Complete bio
- All specialties
- Availability information
- Vehicle type details

## 🔒 Security

- **Public Read Access**: Anyone can view active instructors
- **Admin Write Access**: Only authenticated admins can create/update/delete
- **RLS Policies**: Row Level Security ensures data protection

## 📱 User Flow

1. User navigates to Driving category
2. Clicks on "Find Driving Instructors" resource
3. Sees list of all instructors with search and filters
4. Can search or filter to find specific instructors
5. Clicks on an instructor card to see full details
6. Can call or email directly from detail page

## 🛠️ Customization

### Adding More Fields

To add more fields to instructors:

1. Add column to `driving_instructors` table in Supabase
2. Update `DrivingInstructor` interface in `lib/supabase.ts`
3. Update `DrivingInstructorsList.tsx` to display new field
4. Update `InstructorDetail.tsx` to show new field

### Styling

All components use Tailwind CSS. You can customize:
- Colors in component files
- Layout in component structure
- Icons from `lucide-react`

## 🐛 Troubleshooting

### Instructors not showing?
- Check `is_active = true` in database
- Verify RLS policies are set correctly
- Check browser console for errors

### Search not working?
- Verify the search query is being sent correctly
- Check Supabase logs for query errors

### Filters not applying?
- Verify filter values match database values
- Check that array fields (languages_spoken, specialties) are properly formatted

## 📚 Next Steps

1. ✅ Run SQL script to create table
2. ✅ Add some instructor data
3. ✅ Add resource link in driving category
4. ✅ Test the feature in the app
5. ✅ Customize as needed

## 💡 Tips

- Use verified badges for trusted instructors
- Keep bios concise but informative
- Use accurate locations for better filtering
- Set realistic ratings and prices
- Add specialties to help users find the right instructor



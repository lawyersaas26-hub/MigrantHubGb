# Subscription System Setup Guide

This guide details how to make the subscription system (Light, Gold, Business) fully functional in your app.

## Part 1: Database Setup (Supabase)

You need to create the database tables to store user profiles and subscriptions.

1.  **Go to Supabase Dashboard**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2.  Select your project => **SQL Editor**.
3.  **Run the Profiles Script**:
    *   Open `database/user_profiles_setup.sql` from your project.
    *   Copy the content and paste it into the SQL Editor.
    *   Click **Run**.
4.  **Run the Subscriptions Script**:
    *   Open `database/user_subscriptions_table.sql`.
    *   Copy/Paste into SQL Editor.
    *   Click **Run**.

## Part 2: Google Play Console Setup

To enable In-App Purchases (IAP) on Android, you must configure Google Play.

### 1. Create a Google Play Developer Account
If you haven't already, sign up at [play.google.com/console](https://play.google.com/console) ($25 one-time fee).

### 2. Create the App
1.  Click **Create app**.
2.  Enter App Name: "Migrant Hub GB" (or your chosen name).
3.  Select **App** (not Game) and **Free**.
4.  Accept declarations and create.

### 3. Setup Merchant Account
1.  In the Console, go to **Monetization setup** (or Setup > Payment profile).
2.  Create a **payments profile** (Merchant Account) to receive money. This is required before you can create products.

### 4. Create Subscriptions
Go to **Monetize** > **Products** > **Subscriptions**.

You need to create 3 subscriptions with the **EXACT** Product IDs used in the code:

#### **A. Light Plan**
*   **Product ID**: `light_monthly`
*   **Name**: Light Plan
*   **Description**: Access to all resources, search, and favorites.
*   **Base Plan**:
    *   **ID**: `light-monthly-base`
    *   **Price**: £6.99 (GBP)
    *   **Billing Period**: Monthly
    *   **Grace Period**: 7 days (recommended)

#### **B. Gold Plan**
*   **Product ID**: `gold_monthly`
*   **Name**: Gold Plan
*   **Description**: All Light features + Access to Job/Car/Lawyer listings.
*   **Base Plan**:
    *   **ID**: `gold-monthly-base`
    *   **Price**: £19.99 (GBP)
    *   **Billing Period**: Monthly

#### **C. Business Plan**
*   **Product ID**: `business_monthly`
*   **Name**: Business Plan
*   **Description**: All Gold features + Post listings (Jobs, Cars, etc.).
*   **Base Plan**:
    *   **ID**: `business-monthly-base`
    *   **Price**: £39.99 (GBP)
    *   **Billing Period**: Monthly

### 5. Upload a Signed APK/AAB
Google Play requires you to upload a build with the `BILLING` permission before it lets you test purchases.
1.  Build your app: `npm run build && npx cap sync`
2.  Open Android Studio: `npx cap open android`
3.  Generate Signed Bundle (Build > Generate Signed Bundle/APK).
4.  Upload this to an **Internal Testing** track in Google Play Console.
5.  Add your email (and any testers) to the **Testers** list for that track.

### 6. License Testing (IMPORTANT)
To test without spending real money:
1.  In Google Play Console, go to **Setup** > **License Testing**.
2.  Add your Gmail address (the one on the phone you are testing with) to the "License testers" list.
3.  On your phone/emulator, make sure you are logged into the Play Store with that account.

## Part 3: Testing

1.  **Run on Device**:
    ```bash
    npm run dev
    # In another terminal
    npx cap run android
    ```
2.  **Navigate to Account** > Choose a Plan (e.g., Light).
3.  **Click Subscribe**:
    *   You should see the Google Play purchase sheet pop up.
    *   Since you are a "License Tester", it will say "Test Card, always approves".
4.  **Confirm**:
    *   The app should verify the purchase and update your status to "Active".

## Troubleshooting

*   **"Product not found"**:
    *   Ensure the Product ID in Console matches `light_monthly` exactly.
    *   Ensure the app is uploaded to a Track (Internal Testing).
    *   Ensure your testing account is added to the Testers list.
*   **"Billing unavailable"**:
    *   Ensure you are testing on a real device or emulator with Google Play Store installed.
    *   Ensure you are logged into the Play Store.

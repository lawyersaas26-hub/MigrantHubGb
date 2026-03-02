# Google Play Store Publishing Guide

This guide covers the steps to build and publish your app (`com.migranthubGBv3.app`) to the Google Play Store.

## 1. Prerequisites (Setup Signing Config)

**I have automatically updated your `android/gradle.properties` with the following configuration based on your input:**

```properties
# Release Signing Configuration
MYAPP_RELEASE_STORE_FILE=D:/apps/iraqi-immigrant-guide-uk/android/keynew_v2
MYAPP_RELEASE_STORE_PASSWORD=krbb8jcgA@,
MYAPP_RELEASE_KEY_ALIAS=keynew_v2
MYAPP_RELEASE_KEY_PASSWORD=krbb8jcgA@,
```

> **Important:** I used `keynew_v2` as the Alias since you said "named keynew_v2". I also used the path you provided. Please ensure the file exists at **`D:\apps\iraqi-immigrant-guide-uk\android\keynew_v2`**. If the file has an extension like `.jks`, you must update the path in `android/gradle.properties` to include it.

## 2. Update App Version

Before every new release, you must increment the version code. Google Play will reject a new upload if the version code is not higher than the previous one.

**Action:** Open `android/app/build.gradle` and find the `defaultConfig` section (around line 10):

```gradle
defaultConfig {
    applicationId "com.migranthubGBv3.app"
    // ...
    versionCode 81      // <--- Updated to 81 to override Beta version
    versionName "5.0.4" // <--- Update this to match your desired version string
    // ...
}
```

## 3. Build the Release Bundle

Run the following commands in your terminal to build the Android App Bundle (.aab). This is the modern format required by Google Play.

1.  **Build web assets:**
    ```bash
    npm run build
    ```

2.  **Sync native project:**
    ```bash
    npx cap sync
    ```

3.  **Build the Bundle:**
    ```bash
    cd android
    ./gradlew bundleRelease
    ```

**Success?**
If successful, the signed bundle will be generated at:
`android/app/build/outputs/bundle/release/app-release.aab`

## 4. Upload to Google Play Console

1.  Go to the [Google Play Console](https://play.google.com/console).
2.  Select your app (**Migrant Hub GB**).
3.  In the left menu, go to **Release** > **Production**.
4.  Click **Create new release** (top right).
5.  **App Bundles:** Drag and drop the `app-release.aab` file you generated in Step 3.
6.  **Release Name:** Enter a name (e.g., "1.0.81 Release").
7.  **Release Notes:** Enter a description of what's new in this update.
8.  Click **Next**, review any warnings, and then **Start Rollout to Production**.

## 5. Configure App Access (Critical)

Google Play requires login credentials to test your app. Failing to provide this will result in a rejection with the error "Missing login credentials".

1.  **Create a Demo Account:**
    *   Go to your Supabase Dashboard -> Authentication.
    *   Create a user (e.g., `google@test.com` / `Tester123!`).
    *   Make sure this user can access the app (verify by logging in yourself).

2.  **Add to Play Console:**
    *   Go to **Google Play Console** -> **App Content** (bottom of left menu).
    *   Find **App access** and click **Manage**.
    *   Select **"All or some functionality is restricted"**.
    *   Click **Add new instructions**.
    *   **Name:** "Test Account"
    *   **Username/Phone:** `google@test.com` (or whatever you created)
    *   **Password:** `Tester123!`
    *   **Any other instructions:** "Please use these credentials to log in."
    *   Click **Apply**.

## 6. Send Changes for Review

After updating the App Access or uploading a new bundle, you must explicitly send the changes for review.

1.  Go to **Publishing overview** (top of left menu).
2.  You should see a section called **"Changes ready to send for review"**.
3.  Click **Send 1 change for review** (or however many changes are listed).
4.  Confirm the submission.

## 7. What's Next? (The Review Process)

now you wait!

*   **Review Time:** Google usually takes **1-3 days** to review your update. First-time submissions can take longer (up to 7 days), but updates are usually faster.
*   **Check Status:**
    *   Go to **Dashboard** in Play Console.
    *   Look at the "App status".
    *   **"In review"**: They are still checking it.
    *   **"Production"**: It's live! Users can download the update.
    *   **"Rejected"**: Check your email. They will tell you exactly why (fix it and release a new version).

## Troubleshooting

-   **"Keystore detection"**: If the build fails saying it cannot find the file, verify the path in `android/gradle.properties`.
-   **"Keytool not found"**: If you need to check the alias but `keytool` command isn't working, try looking in your Android Studio installation directory, e.g., `"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe"`.

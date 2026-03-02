# MacInCloud Step-by-Step Guide for Beginners

This guide breaks down the process of publishing your app to the Apple App Store using MacInCloud. It separates tasks into what you can do for free on Windows and what you must do during your paid Mac rental time.

## Phase 1: Preparation (Free - Do this on WINDOWS)
**Goal:** handle all the administrative work so you don't waste your paid rental time.

### Step 1: Apple Developer Account ($99/year)
You cannot publish without this.
1.  Go to [developer.apple.com](https://developer.apple.com).
2.  Click **Account** -> **Join the Apple Developer Program** -> **Enroll**.
3.  **IMPORTANT:** When asked for Entity Type, select **"Individual / Sole Proprietor"**.
    *   *If you select "Organization", it will ask for a "Work Email" and D-U-N-S number. This is much harder.*
    *   *As an "Individual", you can use your personal email.*
4.  Pay the $99 fee.
5.  **Crucial:** Ensure **Two-Factor Authentication (2FA)** is active on your Apple ID.
    *   *Note: Unlike Google Play, Apple does **NOT** require 20 testers. Once you pay, you can publish immediately.*

6.  Wait for the email confirmation from Apple saying "Welcome to the Apple Developer Program".

> [!important]
> **Use the Support App**: If you are stuck or seeing an error "To access App Store Connect...", download the **Apple Developer** app on your iPhone. Sign in there to finish your enrollment. It is often faster and less buggy than the website.

### Step 2: Create the App "Shell"
Tell Apple about your app before you upload it.
1.  Log in to [appstoreconnect.apple.com](https://appstoreconnect.apple.com).
    *   *If you see "To access App Store Connect...", it means your enrollment is still processing. Wait 24-48 hours after payment.*
2.  Click **My Apps** -> **(+) New App**.
3.  **Name:** "Migrant Hub GB" (or your chosen name).
4.  **Bundle ID:** This is your app's unique ID. It MUST match the one in your code.
    *   *Check your `capacitor.config.ts` file for `appId`.* (e.g., `com.migranthubGBv3.app`)
5.  **SKU:** A unique internal ID for you. You can use anything, e.g., `migranthub-ios-001`.

### Step 3: Git & GitHub (Your File Transport)
Since you can't plug a USB drive into a cloud Mac, use GitHub to move your code.
1.  Make sure your latest code is saved.
2.  **Generate Assets:** Run `npm run resources` in your project folder to create icons and splash screens.
3.  **Push to GitHub:**
    *   Open your terminal in the project folder.
    *   Run: `git add .`
    *   Run: `git commit -m "Ready for Mac"`
    *   Run: `git push`

---

## Phase 2: The Mac Session (Paid - Timer is Running)
**Goal:** Build the app and send it to Apple.

**Rent the Mac now.** Log in via Remote Desktop.

### Step 4: Setup the Mac Environment
1.  **Open "Terminal"** (Command+Space, type "Terminal").
2.  **Download Your Code:**
    *   Type: `git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git`
    *   (Replace with your actual repo URL).
3.  **Enter the Folder:**
    *   Type: `cd YOUR_REPO_NAME`
4.  **Install Dependencies:**
    *   Type: `npm install`
5.  **Initialize iOS Project:**
    *   Type: `npx cap add ios`
    *   *This command creates the special `ios` folder that Windows couldn't create.*
6.  **Sync Your Code:**
    *   Type: `npx cap sync`

### Step 5: Configure in Xcode (The Apple Builder)
1.  **Open the Project:**
    *   Type: `npx cap open ios`
    *   *Alternatively, open Finder -> ios -> App -> double-click `App.xcworkspace`.*
2.  **Sign In:**
    *   In Xcode menu (top left), go to **Settings** -> **Accounts**.
    *   Click `+` -> **Apple ID** -> Log in.
3.  **Set Your Team:**
    *   Click the blue **App** icon on the left sidebar (the very top one).
    *   Click the **Signing & Capabilities** tab in the main window.
    *   Under **Team**, select your name (it should say "Personal Team" or similar).
    *   Ensure **Bundle Identifier** matches what you set in Step 2.

### Step 6: Build and Upload ("Archive")
1.  **Select Destination:**
    *   In the very top bar of Xcode, look for the device selector (e.g., "iPhone 15").
    *   Change it to **"Any iOS Device (arm64)"**.
2.  **Archive:**
    *   Go to **Product** menu -> **Archive**.
    *   Wait. It will compile your whole app. This can take 5-10 minutes.
3.  **Upload:**
    *   Once finished, a window ("Organizer") will pop up showing your "Archive".
    *   Click **Distribute App** (blue button on the right).
    *   Select **App Store Connect** -> **Upload**.
    *   Keep clicking **Next** on the default options.
    *   Click **Upload**.

---

## Phase 3: Release (Free - Back on WINDOWS)
**Goal:** Test and Publish.

### Step 7: TestFlight (Internal Testing)
1.  Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) on your Windows PC.
2.  Click **TestFlight**. You should see your uploaded build (it might say "Processing" for 20 mins).
3.  **Add Tester:** Click **(+)** next to Internal Testers and add your email.
4.  **Install:** Get the "TestFlight" app on your iPhone. Open it, accept the invite, and install your app!

### Step 8: Public Release
1.  In App Store Connect, go to the **App Store** tab.
2.  Scroll down to the "Build" section and select the build you just uploaded.
3.  Upload screenshots (you can take them on your iPhone while testing).
4.  Fill in description, keywords, and support URL.
5.  Click **Submit for Review**.

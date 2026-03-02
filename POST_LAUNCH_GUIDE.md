# Post-Launch Operations & Management Guide

Congratulations on your app being live! Here is everything you need to know about managing your data and the admin system.

## 1. Supabase: Production vs. Development
**Do you need a separate production project?**
*   **Keep it as is:** For now, you can continue using your current Supabase project. It is already handling your dynamic data (Jobs, Lawyers, Topics, etc.).
*   **Future Growth:** If you ever plan to make major experimental changes (like deleting tables or restructuring everything), it is safer to create a "Development" project to test changes before applying them to the "Live" project. But for daily content updates, your current setup is perfect.

## 2. Accessing the Admin Dashboard
Since the app is live, you can access the admin dashboard directly through your public website URL:

*   **Login:** `https://your-domain.com/admin/login`
*   **Signup (if needed):** `https://your-domain.com/admin/signup`
*   **Dashboard:** `https://your-domain.com/admin/dashboard`

> [!TIP]
> You can also access these from your phone's browser! The dashboard is mobile-friendly, so you can update data while on the go.

## 3. How Data Updates Work (Real-time)
Your app uses a **Hybrid System**, which is very efficient:

| Content Type | Data Source | Admin Control |
| :--- | :--- | :--- |
| **Jobs, Lawyers, Businesses** | Live Supabase | **Live Updates:** Changes are visible immediately. |
| **Topics & Detailed Articles** | Live Supabase | **Live Updates:** Changes are visible immediately. |
| **Main Categories** | Static + Supabase | **Override:** The app uses static code but checks Supabase first. If you add a category/resource in Admin, it "overrides" the static one. |
| **App Settings (Logo, UI)** | Static Assets | **App Update Required:** Requires a new build and upload to Play Store. |

### Can I control data while live?
**Yes!** When you edit a Job, Lawyer, or Topic in the Admin Dashboard:
1.  You click "Save".
2.  The data is updated in the Supabase database.
3.  The next time a user opens that page in the app, they see the **new data** immediately.
4.  No need to publish a new version to the Play Store for content updates.

## 4. Operational "Don'ts"
*   **Don't delete tables** in the Supabase dashboard unless you are 100% sure.
*   **Don't change your Supabase URL/Keys** in the dashboard without updating the app first, or the app will break (it won't be able to "talk" to the database).
*   **Don't rename standard slugs** (like `immigration`, `health`) if you have hardcoded links pointing to them.

## 5. Summary Checklist for You
1.  ✅ **Content:** Use the Admin Dashboard for daily updates.
2.  ✅ **App Features:** If you want to add a *new screen* or change the *menu layout*, you must rebuild the app and upload to Play Store.
3.  ✅ **Admin Access:** Bookmark your `/admin/login` URL on your phone for quick access.

You have full control! If you want to see how to add a specific type of content, check the `ADMIN_DASHBOARD_SETUP.md` file in your project.

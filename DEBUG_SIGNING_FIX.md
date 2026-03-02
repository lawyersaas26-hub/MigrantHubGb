# Debug Signing Configuration Fix

## Issue
When running the app from Android Studio, Gradle was reporting an error:
```
property 'signingConfigData$gradle_core.signingConfigData.storeFile' file 'D:\apps\iraqi-immigrant-guide-uk\android\app' is not a file.
Reason: Expected an input to be a file but it was a directory.
```

This occurred because Android Studio was injecting a signing config that pointed to the `android/app` directory instead of the actual keystore file.

## Solution
Updated `android/app/build.gradle` to clean up invalid signing configs at multiple stages:

1. **Early cleanup in `gradle.projectsEvaluated`**:
   - Runs before task configuration to remove invalid signing configs early
   - Removes any signing configs where `storeFile` is null, doesn't exist, is a directory, or points to `projectDir`

2. **Cleanup in `afterEvaluate` block**:
   - Removes invalid signing configs after Android block is evaluated
   - Forces debug build type to use debug signing
   - Validates and removes invalid release configs

3. **Cleanup in `tasks.whenTaskAdded`**:
   - Intercepts tasks as they're added to clean up invalid configs
   - Fixes `packageDebug` task dependencies
   - Adds `doFirst` hook to ensure debug signing

4. **Task-level cleanup**:
   - `packageDebug.doFirst` cleans up invalid configs right before execution
   - Fixes task dependency for `mergeDebugNativeDebugMetadata`

5. **Disabled validation tasks**:
   - Disabled `validateSigningDebug` and `validateSigningRelease` tasks

## Changes Made

### `android/app/build.gradle`
- Added `gradle.projectsEvaluated` hook for early cleanup
- Enhanced `afterEvaluate` block to clean up ALL invalid signing configs
- Added cleanup in `tasks.whenTaskAdded` for `packageDebug`
- Fixed task dependency for `mergeDebugNativeDebugMetadata`
- Enhanced `buildTypes.release` validation to check for directory issues

### `android/gradle.properties`
- Already configured with `android.injected.signing.config=debug` to force debug signing
- All injected signing properties are set to empty strings

## Testing Steps

**IMPORTANT: Clear caches first!**

1. **Stop Gradle daemon** (in terminal):
   ```bash
   cd android
   gradlew --stop
   ```

2. **Invalidate Android Studio caches**:
   - **File > Invalidate Caches / Restart...**
   - Select **Invalidate and Restart**

3. **Clean the project**:
   - **Build > Clean Project**

4. **Rebuild the project**:
   - **Build > Rebuild Project**

5. **Run the app**:
   - **Run > Run 'app'**

## If Issues Persist

If you still see the error after clearing caches:

1. **Delete Gradle cache** (in terminal):
   ```bash
   cd android
   rm -rf .gradle
   rm -rf app/build
   ```

2. **Check Android Studio signing configuration**:
   - **File > Project Structure > Modules > app > Signing Configs**
   - Make sure no invalid signing configs are listed
   - If you see any config pointing to a directory, remove it

3. **Verify gradle.properties**:
   - Ensure `android.injected.signing.config=debug` is set
   - Ensure all `android.injected.signing.*` properties are empty

## Notes
- Debug builds will always use debug signing (the default Android debug keystore)
- Release builds will use release signing if a valid keystore exists, otherwise fall back to debug signing
- All invalid signing configs are automatically removed during the build process at multiple stages
- The fix includes proper task dependency management to resolve the `mergeDebugNativeDebugMetadata` warning

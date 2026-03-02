import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.migranthubGBv3.app',
  appName: 'Migrant Hub GB',
  webDir: 'dist',
  // Server config removed for production - app will load from bundled assets
  // For development, uncomment and set your IP:
  // server: {
  //   url: 'http://YOUR_IP:5173',
  //   cleartext: true,
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#7c3aed',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#7c3aed',
    },
    Browser: {
      toolbarColor: '#ffffff',
      presentationStyle: 'popover',
      // Android: Try to minimize toolbar
      // Note: Complete toolbar hiding may require custom implementation
    },
    PrivacyScreen: {
      enable: true,
      imageName: 'Splash',
    },
  },
};

export default config;


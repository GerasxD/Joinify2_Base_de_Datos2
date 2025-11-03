import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.joinify.app',
  appName: 'Joinify',
  webDir: 'dist/susc-comp/browser',
  server: {
    // En desarrollo, permite conectarse al servidor local
    androidScheme: 'http',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.71d30962c2cd4a24a897b8c785ae2729',
  appName: 'zen-notify-me',
  webDir: 'dist',
  server: {
    url: 'https://71d30962-c2cd-4a24-a897-b8c785ae2729.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;
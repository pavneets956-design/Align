import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "TalkingLight",
  slug: "talking-light",
  version: "1.0.0",
  orientation: "portrait",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false
  },
  android: {
    package: "com.talkinglight.app",
    permissions: ["RECORD_AUDIO", "VIBRATE"],
    blockedPermissions: []
  },
  extra: {
    availableVoices: ["pa-IN", "hi-IN", "en-US"]
  }
});

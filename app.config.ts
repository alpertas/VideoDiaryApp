import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "VideoDiary",
  slug: "VideoDiary",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "videodiary",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSCameraUsageDescription: "Video Diary needs camera access to record your video memories.",
      NSMicrophoneUsageDescription: "Video Diary needs microphone access to record audio with your videos.",
      NSPhotoLibraryUsageDescription: "Video Diary needs access to your photo library to save and select videos for your diary entries.",
      ITSAppUsesNonExemptEncryption: false
    },
    bundleIdentifier: "com.alpertas.VideoDiary"
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png"
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_MEDIA_VIDEO"
    ],
    package: "com.alpertas.VideoDiary"
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000"
        }
      }
    ],
    "expo-sqlite",
    "expo-video",
    [
      "expo-image-picker",
      {
        photosPermission: "Video Diary needs access to your photo library to select videos for your diary entries.",
        cameraPermission: "Video Diary needs camera access to record video memories."
      }
    ]
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true
  },
  extra: {
    router: {},
    eas: {
      projectId: "cefeb260-ed9f-4215-b908-7bcfab14ada1"
    }
  }
});

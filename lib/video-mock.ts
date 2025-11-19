/**
 * Mock implementation for expo-trim-video.
 * 
 * IMPORTANT: This is a temporary mock for development with Expo Go.
 * For production, use a development build to access native modules.
 * 
 * To create a development build:
 * 1. Run: npx expo prebuild
 * 2. Run: npx expo run:ios (or run:android)
 */

export interface TrimVideoOptions {
  videoUri: string;
  startMs: number;
  endMs: number;
}

export interface TrimVideoResult {
  videoUri: string;
}

/**
 * Mock trimVideo function that simulates video trimming.
 * In development, it just returns the original video URI.
 * 
 * NOTE: This mock does NOT actually trim the video!
 * To get real trimming functionality, you need to:
 * 1. Run: npx expo prebuild
 * 2. Run: npx expo run:ios (or run:android)
 */
export async function trimVideo(
  options: TrimVideoOptions
): Promise<TrimVideoResult> {
  console.warn("⚠️ MOCK TRIMMING - Video will NOT be trimmed in Expo Go!");
  console.log("📋 Mock trim request:", {
    start: `${(options.startMs / 1000).toFixed(1)}s`,
    end: `${(options.endMs / 1000).toFixed(1)}s`,
    duration: `${((options.endMs - options.startMs) / 1000).toFixed(1)}s`,
  });
  console.log("💡 To enable real trimming, build with: npx expo run:ios");

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return the original URI (mock behavior - NOT TRIMMED!)
  return {
    videoUri: options.videoUri,
  };
}


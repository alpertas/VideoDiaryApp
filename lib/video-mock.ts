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
 */
export async function trimVideo(
  options: TrimVideoOptions
): Promise<TrimVideoResult> {
  console.warn(
    "⚠️  Using MOCK trimVideo. For real functionality, create a development build."
  );

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return the original URI (mock behavior)
  return {
    videoUri: options.videoUri,
  };
}


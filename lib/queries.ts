import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import { VideoThumbnailsResult, getThumbnailAsync } from "expo-video-thumbnails";

import type { Video, VideoCreationData } from "@/types";
import * as db from "./database";
// Use mock for Expo Go, real implementation needs development build
import { trimVideo } from "./video-mock";

/**
 * Query keys for cache management.
 */
export const queryKeys = {
  videos: ["videos"] as const,
  video: (id: number) => ["videos", id] as const,
};

/**
 * Fetch all videos from SQLite.
 * Data is cached and automatically refetched on invalidation.
 */
export function useVideosQuery() {
  return useQuery({
    queryKey: queryKeys.videos,
    queryFn: () => db.getAllVideos(),
  });
}

/**
 * Fetch a single video by ID.
 */
export function useVideoQuery(id: number) {
  return useQuery({
    queryKey: queryKeys.video(id),
    queryFn: () => db.getVideoById(id),
    enabled: !!id,
  });
}

/**
 * Add a new video diary entry.
 * 
 * This is the CRITICAL mutation that handles the complete video creation flow:
 * 1. Trim the video to the selected 5-second segment
 * 2. Generate a thumbnail image for list performance
 * 3. Move both files from CacheDirectory to DocumentDirectory (persistence)
 * 4. Insert metadata into SQLite
 * 5. Invalidate the videos query to refresh the list
 * 
 * Why Tanstack Query?
 * - Provides loading/error states automatically
 * - Handles optimistic updates and rollbacks
 * - Manages cache invalidation correctly
 * - Better UX with proper async handling
 */
export function useAddVideoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VideoCreationData) => {
      // Step 1: Trim the video to selected segment
      const trimResult = await trimVideo({
        videoUri: data.sourceUri,
        startMs: data.startTime,
        endMs: data.endTime,
      });

      if (!trimResult || !trimResult.videoUri) {
        throw new Error("Video trimming failed");
      }

      // Step 2: Generate thumbnail from the trimmed video
      let thumbnailResult: VideoThumbnailsResult;
      try {
        thumbnailResult = await getThumbnailAsync(trimResult.videoUri, {
          time: 0, // First frame
        });
      } catch {
        throw new Error("Thumbnail generation failed");
      }

      // Step 3: Move files from CacheDirectory to DocumentDirectory for persistence
      // This prevents OS from deleting files when storage is low
      const videoFileName = `video_${Date.now()}.mp4`;
      const thumbnailFileName = `thumb_${Date.now()}.jpg`;

      const persistentVideoUri = `${FileSystem.documentDirectory}${videoFileName}`;
      const persistentThumbnailUri = `${FileSystem.documentDirectory}${thumbnailFileName}`;

      await FileSystem.moveAsync({
        from: trimResult.videoUri,
        to: persistentVideoUri,
      });

      await FileSystem.moveAsync({
        from: thumbnailResult.uri,
        to: persistentThumbnailUri,
      });

      // Step 4: Insert into SQLite with persistent URIs
      const videoId = await db.insertVideo({
        uri: persistentVideoUri,
        thumbnailUri: persistentThumbnailUri,
        name: data.name,
        description: data.description,
      });

      return videoId;
    },
    onSuccess: () => {
      // Step 5: Invalidate videos query to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.videos });
    },
  });
}

/**
 * Update video metadata (name and description).
 * Video file and thumbnail remain unchanged.
 */
export function useUpdateVideoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: number;
      name: string;
      description: string;
    }) => {
      const success = await db.updateVideo(params.id, {
        name: params.name,
        description: params.description,
      });

      if (!success) {
        throw new Error("Video not found or update failed");
      }

      return params.id;
    },
    onSuccess: (id) => {
      // Invalidate both the video list and the specific video query
      queryClient.invalidateQueries({ queryKey: queryKeys.videos });
      queryClient.invalidateQueries({ queryKey: queryKeys.video(id) });
    },
  });
}

/**
 * Delete a video entry from the database.
 * 
 * Note: This also attempts to delete the physical files.
 * If file deletion fails, the database entry is still removed.
 */
export function useDeleteVideoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (video: Video) => {
      // Attempt to delete physical files (best effort)
      try {
        await FileSystem.deleteAsync(video.uri, { idempotent: true });
        await FileSystem.deleteAsync(video.thumbnailUri, { idempotent: true });
      } catch {
        console.warn("Failed to delete video files");
        // Continue with database deletion even if file deletion fails
      }

      // Delete from database
      const success = await db.deleteVideo(video.id);

      if (!success) {
        throw new Error("Video not found or deletion failed");
      }

      return video.id;
    },
    onSuccess: () => {
      // Refresh the video list
      queryClient.invalidateQueries({ queryKey: queryKeys.videos });
    },
  });
}


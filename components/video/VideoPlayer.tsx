import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

interface VideoPlayerProps {
  uri: string;
  autoPlay?: boolean;
  className?: string;
  contentFit?: 'contain' | 'cover' | 'fill';
  startTime?: number;
  endTime?: number;
}

/**
 * VideoPlayer component using expo-video.
 * Displays video with play/pause controls.
 * Automatically handles player lifecycle and cleanup.
 */
export function VideoPlayer({
  uri,
  autoPlay = false,
  className = '',
  contentFit = 'cover',
  startTime,
  endTime,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Safely initialize player with error handling
  const player = useVideoPlayer(uri, (player) => {
    try {
      player.loop = false;
      player.muted = false;
      if (startTime !== undefined) {
        player.currentTime = startTime / 1000; // Convert ms to seconds
      }
      if (autoPlay) {
        player.play();
      }
    } catch (error) {
      console.error('VideoPlayer error:', error);
    }
  });

  // Sync playing state with player status and handle segment playback
  useEffect(() => {
    if (player) {
      const playingSubscription = player.addListener(
        'playingChange',
        (newState) => {
          setIsPlaying(newState.isPlaying);
        }
      );

      // Handle segment end time with setInterval (timeUpdate event doesn't fire reliably)
      let intervalId: ReturnType<typeof setInterval> | null = null;
      if (endTime !== undefined && startTime !== undefined) {
        intervalId = setInterval(() => {
          if (player && player.playing) {
            const currentTimeMs = player.currentTime * 1000;
            // Use 100ms lookahead to catch end time before it's passed
            if (currentTimeMs >= endTime - 100) {
              // IMPORTANT: Reset position BEFORE pausing to avoid getting stuck
              player.currentTime = startTime / 1000;
              player.pause();
            }
          }
        }, 100); // Check every 100ms
      }

      return () => {
        playingSubscription.remove();
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, [player, startTime, endTime]);

  // Update video position when startTime changes
  useEffect(() => {
    if (player && startTime !== undefined) {
      try {
        player.currentTime = startTime / 1000;
      } catch {
        // Silently ignore seek errors
      }
    }
  }, [player, startTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (player && player.playing) {
          player.pause();
        }
      } catch {
        // Silently ignore cleanup errors
      }
    };
  }, [player]);

  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pause();
      } else {
        // If at end position, restart from beginning
        const currentTimeMs = player.currentTime * 1000;
        const durationMs = player.duration * 1000;

        // Check if video is at end (within 100ms tolerance)
        const isAtEnd = Math.abs(currentTimeMs - durationMs) < 100;

        // Check if video is at segment end (if trimming is active)
        const isAtSegmentEnd =
          endTime !== undefined &&
          startTime !== undefined &&
          Math.abs(currentTimeMs - endTime) < 100;

        if (isAtEnd || isAtSegmentEnd) {
          const seekTime = startTime !== undefined ? startTime / 1000 : 0;
          player.currentTime = seekTime;
        }

        player.play();
      }
    }
  };

  return (
    <View
      className={`relative ${className}`}
      style={{ backgroundColor: '#000' }}
    >
      <VideoView
        player={player}
        style={{ width: '100%', height: '100%' }}
        contentFit={contentFit}
        nativeControls={false}
      />

      {/* Play/Pause Overlay Button */}
      <Pressable
        onPress={togglePlayPause}
        className="absolute inset-0 items-center justify-center"
      >
        {!isPlaying && (
          <View className="bg-black/50 rounded-full p-4">
            <Ionicons name="play" size={48} color="white" />
          </View>
        )}
      </Pressable>
    </View>
  );
}

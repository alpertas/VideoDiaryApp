import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

interface VideoPlayerProps {
  uri: string;
  autoPlay?: boolean;
  className?: string;
  contentFit?: "contain" | "cover" | "fill";
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
  className = "",
  contentFit = "cover",
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
      console.error("VideoPlayer error:", error);
    }
  });

  // Sync playing state with player status and handle segment playback
  useEffect(() => {
    if (player) {
      const playingSubscription = player.addListener("playingChange", (newState) => {
        setIsPlaying(newState.isPlaying);
      });

      // Handle segment end time
      let timeUpdateSubscription: any;
      if (endTime !== undefined) {
        timeUpdateSubscription = player.addListener("timeUpdate", (status) => {
          const currentTimeMs = status.currentTime * 1000;
          if (currentTimeMs >= endTime && player.playing) {
            player.pause();
            if (startTime !== undefined) {
              player.currentTime = startTime / 1000;
            }
          }
        });
      }

      return () => {
        playingSubscription.remove();
        if (timeUpdateSubscription) {
          timeUpdateSubscription.remove();
        }
      };
    }
  }, [player, startTime, endTime]);

  // Update video position when startTime changes
  useEffect(() => {
    if (player && startTime !== undefined) {
      try {
        player.currentTime = startTime / 1000;
      } catch (error) {
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
      } catch (error) {
        // Silently ignore cleanup errors
      }
    };
  }, [player]);

  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    }
  };

  return (
    <View
      className={`relative ${className}`}
      style={{ backgroundColor: "#000" }}
    >
      <VideoView
        player={player}
        style={{ width: "100%", height: "100%" }}
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

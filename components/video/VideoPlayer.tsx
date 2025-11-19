import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

interface VideoPlayerProps {
  uri: string;
  autoPlay?: boolean;
  className?: string;
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
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Safely initialize player with error handling
  const player = useVideoPlayer(uri, (player) => {
    try {
      player.loop = false;
      player.muted = false;
      if (autoPlay) {
        player.play();
      }
    } catch (error) {
      console.error("VideoPlayer error:", error);
    }
  });

  // Sync playing state with player status
  useEffect(() => {
    if (player) {
      const subscription = player.addListener("playingChange", (newState) => {
        setIsPlaying(newState.isPlaying);
      });
      return () => subscription.remove();
    }
  }, [player]);

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
        contentFit="cover"
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

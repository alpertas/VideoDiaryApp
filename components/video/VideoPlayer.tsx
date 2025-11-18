import React, { useEffect, useRef, useState } from "react";
import { View, Pressable } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";

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
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
    player.muted = false;
    if (autoPlay) {
      player.play();
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
    <View className={`relative ${className}`}>
      <VideoView
        player={player}
        className="w-full h-full"
        contentFit="contain"
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


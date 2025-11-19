import { Video } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface VideoListItemProps {
  video: Video;
  onPress: () => void;
}

/**
 * VideoListItem displays a video entry in the list.
 * Shows static thumbnail image (NOT expo-video) for optimal FlashList performance.
 * Displays video name, description, and formatted date.
 */
export function VideoListItem({ video, onPress }: VideoListItemProps) {
  const formattedDate = new Date(video.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Pressable
      onPress={onPress}
      className="flex-row bg-white dark:bg-gray-800 p-3 mb-4 mx-4 shadow-sm active:opacity-80"
    >
      {/* Thumbnail with Play Icon Overlay */}
      <View className="relative">
        <Image
          source={{ uri: video.thumbnailUri }}
          className="w-24 h-24 rounded-xl border-2 border-gray-200/50 dark:border-gray-600/50 bg-gray-200 dark:bg-gray-700"
          contentFit="cover"
        />
        <View className="absolute inset-0 items-center justify-center">
          <View className="bg-black/40 rounded-full p-2">
            <Ionicons name="play" size={24} color="white" />
          </View>
        </View>
      </View>

      {/* Metadata */}
      <View className="flex-1 ml-3 justify-center">
        <Text
          className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
          numberOfLines={1}
        >
          {video.name}
        </Text>

        {video.description && (
          <Text
            className="text-sm text-gray-600 dark:text-gray-400 mb-2"
            numberOfLines={2}
          >
            {video.description}
          </Text>
        )}

        <Text className="text-xs text-gray-500 dark:text-gray-500">
          {formattedDate}
        </Text>
      </View>
    </Pressable>
  );
}

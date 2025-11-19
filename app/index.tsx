import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { VideoListItem } from "@/components/video/VideoListItem";
import { useDeleteVideoMutation, useVideosQuery } from "@/lib/queries";
import type { Video } from "@/types";

/**
 * MainScreen displays all video diaries in a performant FlashList.
 * Features: Loading states, empty state, swipe actions, and navigation.
 */
export default function MainScreen() {
  const router = useRouter();
  const { data: videos, isLoading } = useVideosQuery();
  const deleteVideoMutation = useDeleteVideoMutation();

  const handleVideoPress = (videoId: number) => {
    router.push(`/videos/${videoId}`);
  };

  const handleAddVideo = () => {
    router.push("/add");
  };

  const handleDelete = (video: Video) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Delete Video",
      `Are you sure you want to delete "${video.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            deleteVideoMutation.mutate(video, {
              onSuccess: () => {
                Alert.alert("Success", "Video deleted successfully");
              },
              onError: () => {
                Alert.alert("Error", "Failed to delete video");
              },
            });
          },
        },
      ]
    );
  };

  const handleEdit = (videoId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/edit/${videoId}`);
  };

  const renderRightActions = (video: Video) => {
    return (
      <View className="flex-row h-full">
        <Pressable
          onPress={() => handleEdit(video.id)}
          className="bg-blue-500 justify-center items-center w-20 active:bg-blue-600"
          style={{ height: "100%" }}
        >
          <Ionicons name="pencil" size={20} color="white" />
          <Text className="text-white text-xs font-medium mt-1">Edit</Text>
        </Pressable>
        <Pressable
          onPress={() => handleDelete(video)}
          className="bg-red-500 justify-center items-center w-20 active:bg-red-600"
          style={{ height: "100%" }}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text className="text-white text-xs font-medium mt-1">Delete</Text>
        </Pressable>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Video; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <Swipeable
        renderRightActions={() => renderRightActions(item)}
        overshootRight={false}
        friction={1.5}
        rightThreshold={60}
      >
        <VideoListItem video={item} onPress={() => handleVideoPress(item.id)} />
      </Swipeable>
    </Animated.View>
  );

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 dark:text-gray-400 mt-4">
            Loading videos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Empty State
  if (!videos || videos.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons
            name="videocam-outline"
            size={80}
            color="#9CA3AF"
            style={{ marginBottom: 16 }}
          />
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            No Video Diaries Yet
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Start capturing your memories by adding your first video diary.
          </Text>
          <Pressable
            onPress={handleAddVideo}
            className="bg-blue-600 px-8 py-4 rounded-2xl active:opacity-70"
            style={{
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="add-circle-outline" size={28} color="white" />
              <Text className="text-white font-bold text-lg">
                Add Your First Video
              </Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // List View
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950">
        {/* Video List */}
        <FlashList
          data={videos}
          renderItem={renderItem}
          estimatedItemSize={132}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 100 }}
        />

        {/* Floating Action Button */}
        <Pressable
          onPress={handleAddVideo}
          className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center active:scale-95"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="add" size={32} color="white" />
        </Pressable>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

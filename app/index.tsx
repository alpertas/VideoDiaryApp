import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
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

  const flashListRef = React.useRef<FlashList<Video> | null>(null);

  // FAB pulsating animation
  const fabScale = useSharedValue(1);

  useEffect(() => {
    fabScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2500 }),
        withTiming(1, { duration: 2500 })
      ),
      -1,
      false
    );
  }, []);

  // Scroll to top when new videos are added
  useEffect(() => {
    if (videos && videos.length > 0) {
      flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [videos]);

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

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
      <View className="flex-row">
        <Pressable
          onPress={() => handleEdit(video.id)}
          className="bg-blue-500 justify-center items-center w-24 rounded-l-lg active:bg-blue-600"
          style={{ height: "100%" }}
        >
          <Ionicons name="pencil" size={20} color="white" />
          <Text className="text-white text-xs font-medium mt-1">Edit</Text>
        </Pressable>
        <Pressable
          onPress={() => handleDelete(video)}
          className="bg-red-500 justify-center items-center w-24 rounded-r-lg active:bg-red-600"
          style={{ height: "100%" }}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text className="text-white text-xs font-medium mt-1">Delete</Text>
        </Pressable>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Video; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50)}
      style={{ marginBottom: 16, marginHorizontal: 16 }}
    >
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
          ref={flashListRef}
          data={videos}
          renderItem={renderItem}
          estimatedItemSize={140}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 100 }}
        />

        {/* Floating Action Button */}
        <Animated.View
          style={[
            fabAnimatedStyle,
            {
              position: "absolute",
              bottom: 24,
              right: 24,
            },
          ]}
        >
          <Pressable
            onPress={handleAddVideo}
            className="bg-blue-600 w-14 h-14 rounded-full items-center justify-center active:scale-95"
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
        </Animated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

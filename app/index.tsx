import { Ionicons } from "@expo/vector-icons";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
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
import i18n from "@/lib/i18n";
import { useDeleteVideoMutation, useVideosQuery } from "@/lib/queries";
import { useFilterStore } from "@/store/filter-store";
import type { Video } from "@/types";

/**
 * MainScreen displays all video diaries in a performant FlashList.
 * Features: Loading states, empty state, swipe actions, and navigation.
 */
export default function MainScreen() {
  const router = useRouter();
  const { data: videos, isLoading } = useVideosQuery();
  const deleteVideoMutation = useDeleteVideoMutation();

  const flashListRef = React.useRef<FlashListRef<Video>>(null);

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
      i18n.t("main.deleteConfirmTitle"),
      i18n.t("main.deleteConfirmMessage", { name: video.name }),
      [
        { text: i18n.t("common.cancel"), style: "cancel" },
        {
          text: i18n.t("common.delete"),
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            deleteVideoMutation.mutate(video, {
              onSuccess: () => {
                Alert.alert(i18n.t("common.success"), i18n.t("main.deleteSuccess"));
              },
              onError: () => {
                Alert.alert(i18n.t("common.error"), i18n.t("main.deleteError"));
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

  const { searchQuery, sortOrder, setSearchQuery, toggleSortOrder } = useFilterStore();

  const renderRightActions = (video: Video) => {
    return (
      <View className="flex-row">
        <Pressable
          onPress={() => handleEdit(video.id)}
          className="bg-blue-500 justify-center items-center w-24 rounded-l-lg active:bg-blue-600"
          style={{ height: "100%" }}
        >
          <Ionicons name="pencil" size={20} color="white" />
          <Text className="text-white text-xs font-medium mt-1">{i18n.t("common.edit")}</Text>
        </Pressable>
        <Pressable
          onPress={() => handleDelete(video)}
          className="bg-red-500 justify-center items-center w-24 rounded-r-lg active:bg-red-600"
          style={{ height: "100%" }}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text className="text-white text-xs font-medium mt-1">{i18n.t("common.delete")}</Text>
        </Pressable>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Video; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50)}
      style={{ marginBottom: 16 }}
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
            {i18n.t("common.loading")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Empty State (No Videos at all)
  if (!videos || (videos.length === 0 && !searchQuery)) {
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
            {i18n.t("main.emptyTitle")}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center mb-8">
            {i18n.t("main.emptySubtitle")}
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
                {i18n.t("main.addFirst")}
              </Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // List View (With Search Header)
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950">
        {/* Fixed Header with Search and Sort */}
        <View className="px-4 py-2 mb-2 bg-gray-50 dark:bg-gray-950 z-10">
          <View className="flex-row gap-2">
            <View className="flex-1 bg-white dark:bg-gray-800 rounded-lg flex-row items-center px-3 border border-gray-200 dark:border-gray-700 h-12">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3 px-2 text-gray-900 dark:text-white"
                placeholder={i18n.t("main.searchPlaceholder")}
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </Pressable>
              )}
            </View>
            <Pressable
              onPress={toggleSortOrder}
              className="bg-white dark:bg-gray-800 px-4 rounded-lg flex-row gap-2 justify-center items-center border border-gray-200 dark:border-gray-700 active:bg-gray-100 dark:active:bg-gray-700 h-12"
            >
              <Text className="text-gray-700 dark:text-gray-300 font-medium">
                {i18n.t("main.sort")}
              </Text>
              <Ionicons
                name={sortOrder === "desc" ? "arrow-down" : "arrow-up"}
                size={16}
                color="#3B82F6"
              />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        {videos && videos.length === 0 ? (
          // Search Empty State
          <View className="flex-1 items-center justify-center px-8 pb-20">
            <Ionicons name="search-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-4 text-lg">
              {i18n.t("main.noSearchResults", { query: searchQuery })}
            </Text>
          </View>
        ) : (
          // Video List
          <FlashList
            ref={flashListRef}
            data={videos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingTop: 12, paddingBottom: 100, paddingHorizontal: 16 }}
            />
        )}

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

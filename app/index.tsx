import { Ionicons } from "@expo/vector-icons";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  Text,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Reanimated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchBar } from "@/components/ui/SearchBar";
import { VideoListItem } from "@/components/video/VideoListItem";
import { useVideoList } from "@/hooks/useVideoList";
import i18n from "@/lib/i18n";
import { useFilterStore } from "@/store/filter-store";
import type { Video } from "@/types";

/**
 * MainScreen (Refactored)
 * A "Dumb View" that displays the video list using `useVideoList`.
 */
export default function MainScreen() {
  const {
    videos,
    isLoading,
    searchQuery,
    handleEdit,
    handleDelete,
    handleAddVideo,
  } = useVideoList();

  const { sortOrder, toggleSortOrder } = useFilterStore();
  const flashListRef = React.useRef<FlashListRef<Video>>(null);

  // FAB pulsating animation using Reanimated v2+ API
  const fabOpacity = useSharedValue(1);

  React.useEffect(() => {
    fabOpacity.value = withRepeat(
      withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [fabOpacity]);

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fabOpacity.value,
  }));

  const renderRightActions = (video: Video) => (
    <View className="flex-row">
      <Pressable
        onPress={() => handleEdit(video.id)}
        className="bg-blue-500 justify-center items-center w-24 rounded-l-lg active:bg-blue-600"
        style={{ height: "100%" }}
      >
        <Ionicons name="pencil" size={20} color="white" />
        <Text className="text-white text-xs mt-1">{i18n.t("common.edit")}</Text>
      </Pressable>
      <Pressable
        onPress={() => handleDelete(video)}
        className="bg-red-500 justify-center items-center w-24 rounded-r-lg active:bg-red-600"
        style={{ height: "100%" }}
      >
        <Ionicons name="trash" size={20} color="white" />
        <Text className="text-white text-xs mt-1">{i18n.t("common.delete")}</Text>
      </Pressable>
    </View>
  );

  const renderItem = ({ item, index }: { item: Video; index: number }) => (
    <Reanimated.View
      entering={FadeInDown.delay(index * 50)}
      style={{ marginBottom: 16 }}
    >
      <Swipeable
        renderRightActions={() => renderRightActions(item)}
        overshootRight={false}
      >
        <VideoListItem
          video={item}
          onPress={() => router.push(`/videos/${item.id}`)}
        />
      </Swipeable>
    </Reanimated.View>
  );

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 justify-center items-center">
        <Text className="text-gray-500 dark:text-gray-400">
          {i18n.t("common.loading")}
        </Text>
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
            <SearchBar />
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
        <Reanimated.View
          style={[
            {
              position: "absolute",
              bottom: 32,
              right: 32,
            },
            fabAnimatedStyle,
          ]}
        >
          <Pressable
            onPress={handleAddVideo}
            className="bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg active:bg-blue-700"
            style={{
              shadowColor: "#2563EB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Ionicons name="add" size={32} color="white" />
          </Pressable>
        </Reanimated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Loader } from '@/components/ui/Loader';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import i18n from '@/lib/i18n';
import { useVideoQuery } from '@/lib/queries';

/**
 * VideoDetailsScreen displays full video player with metadata.
 * Fetches video data from SQLite using the ID parameter.
 */
export default function VideoDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: video, isLoading, refetch } = useVideoQuery(Number(id));

  // Refetch when screen comes into focus to ensure fresh data
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleEdit = () => {
    router.push(`/edit/${id}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <Loader />
      </SafeAreaView>
    );
  }

  if (!video) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="alert-circle-outline" size={80} color="#EF4444" />
          <Text className="text-xl font-bold text-gray-900 dark:text-white mt-4">
            {i18n.t('details.notFoundTitle')}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center mt-2">
            {i18n.t('details.notFoundMsg')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = new Date(video.createdAt).toLocaleDateString(
    i18n.locale,
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const formattedTime = new Date(video.createdAt).toLocaleTimeString(
    i18n.locale,
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1">
        {/* Video Player */}
        <View className="bg-black w-full h-80 justify-center">
          <VideoPlayer
            uri={video.uri}
            className="w-full h-full"
            contentFit="contain"
          />
        </View>

        {/* Metadata Section */}
        <View className="p-6">
          {/* Title and Edit Button */}
          <View className="flex-row items-start justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white flex-1 mr-4">
              {video.name}
            </Text>
            <Pressable
              onPress={handleEdit}
              className="bg-blue-600 px-4 py-2 rounded-lg active:opacity-80"
            >
              <View className="flex-row items-center">
                <Ionicons name="pencil" size={16} color="white" />
                <Text className="text-white font-semibold ml-2">
                  {i18n.t('common.edit')}
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Date and Time */}
          <View className="flex-row items-center mb-6">
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#6B7280"
              style={{ marginRight: 8 }}
            />
            <Text className="text-gray-600 dark:text-gray-400">
              {formattedDate} at {formattedTime}
            </Text>
          </View>

          {/* Description */}
          {video.description && (
            <View>
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {i18n.t('add.descLabel')}
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 leading-6">
                {video.description}
              </Text>
            </View>
          )}

          {!video.description && (
            <Text className="text-gray-500 dark:text-gray-500 italic">
              {i18n.t('details.noDesc')}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

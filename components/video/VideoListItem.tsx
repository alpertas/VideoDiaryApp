import { Video } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Reanimated, { FadeInDown } from 'react-native-reanimated';

import i18n from '@/lib/i18n';

interface VideoListItemProps {
  video: Video;
  onPress: () => void;
  onEdit: (id: number) => void;
  onDelete: (video: Video) => void;
  index?: number;
}

/**
 * VideoListItem displays a video entry in the list with swipe actions.
 * Shows static thumbnail image (NOT expo-video) for optimal FlashList performance.
 * Displays video name, description, and formatted date.
 * Encapsulates swipe-to-edit/delete functionality.
 */
export function VideoListItem({
  video,
  onPress,
  onEdit,
  onDelete,
  index = 0,
}: VideoListItemProps) {
  const formattedDate = new Date(video.createdAt).toLocaleDateString(
    i18n.locale,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  const renderRightActions = () => (
    <View className="flex-row">
      <Pressable
        onPress={() => onEdit(video.id)}
        className="bg-blue-500 justify-center items-center w-24 rounded-l-lg active:bg-blue-600"
        style={{ height: '100%' }}
      >
        <Ionicons name="pencil" size={20} color="white" />
        <Text className="text-white text-xs mt-1">{i18n.t('common.edit')}</Text>
      </Pressable>
      <Pressable
        onPress={() => onDelete(video)}
        className="bg-red-500 justify-center items-center w-24 rounded-r-lg active:bg-red-600"
        style={{ height: '100%' }}
      >
        <Ionicons name="trash" size={20} color="white" />
        <Text className="text-white text-xs mt-1">
          {i18n.t('common.delete')}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <Reanimated.View
      entering={FadeInDown.delay(index * 50)}
      style={{ marginBottom: 16 }}
    >
      <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
        <Pressable
          onPress={onPress}
          className="flex-row bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm active:opacity-80"
        >
          {/* Thumbnail */}
          <Image
            source={{ uri: video.thumbnailUri }}
            className="w-24 h-24 rounded-xl border-2 border-gray-200/50 dark:border-gray-600/50 bg-gray-200 dark:bg-gray-700"
            contentFit="cover"
          />

          {/* Metadata */}
          <View className="flex-1 ml-3 justify-center">
            <Text
              className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
              numberOfLines={1}
            >
              {video.name}
            </Text>

            {video.description && video.description.trim() !== '' && (
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
      </Swipeable>
    </Reanimated.View>
  );
}

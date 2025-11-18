import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * MainScreen displays the list of all video diaries.
 * Videos are fetched from SQLite and rendered in a FlashList for optimal performance.
 * Supports swipe gestures for quick edit/delete actions.
 */
export default function MainScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Video Diary
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center">
          Main Screen Placeholder - Will implement video list with FlashList
        </Text>
      </View>
    </SafeAreaView>
  );
}


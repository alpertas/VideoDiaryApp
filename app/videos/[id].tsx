import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

/**
 * VideoDetailsScreen shows a full-screen video player with metadata.
 * Video data is fetched from SQLite using the ID parameter.
 */
export default function VideoDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Video Details
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center">
          Details Placeholder for Video ID: {id}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center mt-2">
          Will display video player and metadata
        </Text>
      </View>
    </SafeAreaView>
  );
}


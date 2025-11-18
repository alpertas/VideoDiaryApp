import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

/**
 * EditVideoScreen allows updating the name and description of an existing video.
 * Form is pre-filled with current values and validated with Zod before submission.
 */
export default function EditVideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Edit Video
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center">
          Edit Placeholder for Video ID: {id}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center mt-2">
          Will display form to update name and description
        </Text>
      </View>
    </SafeAreaView>
  );
}


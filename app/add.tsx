import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * AddVideoScreen handles the 3-step wizard for creating a new video diary entry.
 * Step 1: Select video from library
 * Step 2: Trim 5-second segment with draggable scrubber
 * Step 3: Add name and description with validation
 * 
 * The save operation uses a Tanstack Query mutation to:
 * - Trim the video and generate a thumbnail
 * - Move the file to DocumentDirectory for persistence
 * - Insert metadata into SQLite
 */
export default function AddVideoScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Add Video Wizard
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center">
          3-Step Wizard Placeholder
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center mt-2">
          Step 1: Select → Step 2: Trim → Step 3: Metadata
        </Text>
      </View>
    </SafeAreaView>
  );
}


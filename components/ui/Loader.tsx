import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
}

/**
 * Shared Loader component for displaying loading states.
 * Provides a centered ActivityIndicator with optional message.
 * Supports dark mode and customizable size/color.
 */
export function Loader({
  size = 'large',
  color = '#3B82F6',
  message,
}: LoaderProps) {
  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="text-gray-500 dark:text-gray-400 mt-4">{message}</Text>
      )}
    </View>
  );
}

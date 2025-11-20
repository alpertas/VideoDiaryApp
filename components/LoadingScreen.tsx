import i18n from '@/lib/i18n';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoadingScreenProps {
  error?: Error | null;
}

/**
 * Loading screen shown during app initialization.
 * Displays a spinner and localized loading message.
 * If there's an error, shows error message instead.
 */
export function LoadingScreen({ error }: LoadingScreenProps) {
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {i18n.t('common.loadingError')}
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center mb-4">
            {error.message}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-500 text-center">
            {i18n.t('common.retry')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
          {i18n.t('common.loadingApp')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

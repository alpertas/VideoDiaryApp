import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import i18n from '@/lib/i18n';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRestart = async () => {
    try {
      await Updates.reloadAsync();
    } catch {
      // If reload fails (e.g. in development), just reset state
      this.setState({ hasError: false, error: null });
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
          <View className="flex-1 items-center justify-center p-6">
            <Ionicons name="warning-outline" size={80} color="#EF4444" />
            <Text className="text-2xl font-bold text-gray-800 dark:text-white mt-4 mb-2">
              {i18n.t('errorBoundary.title')}
            </Text>
            <Text className="text-base text-gray-500 dark:text-gray-400 text-center mb-8">
              {i18n.t('errorBoundary.subtitle')}
            </Text>
            {this.state.error && (
              <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-8 w-full">
                <Text className="text-red-700 dark:text-red-400 text-xs font-mono">
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
            <Pressable
              onPress={this.handleRestart}
              className="bg-blue-500 px-8 py-4 rounded-xl active:bg-blue-600"
            >
              <Text className="text-white text-base font-semibold">
                {i18n.t('errorBoundary.restart')}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

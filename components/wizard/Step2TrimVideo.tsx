import React from 'react';
import { Text, View } from 'react-native';

import { VideoTrimmer } from '@/components/video/VideoTrimmer';
import i18n from '@/lib/i18n';

interface Step2TrimVideoProps {
  videoUri: string;
  videoDuration: number;
  maxDuration: number;
  onTrimChange: (start: number, end: number) => void;
}

export function Step2TrimVideo({
  videoUri,
  videoDuration,
  maxDuration,
  onTrimChange,
}: Step2TrimVideoProps) {
  return (
    <View className="flex-1 py-4">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {i18n.t('add.step2Title')}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 mb-6">
        {i18n.t('add.step2Subtitle', { duration: maxDuration / 1000 })}
      </Text>
      <VideoTrimmer
        videoUri={videoUri}
        videoDuration={videoDuration}
        onTrimChange={onTrimChange}
      />
    </View>
  );
}

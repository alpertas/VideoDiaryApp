import React, { useCallback, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { VideoPlayer } from "./VideoPlayer";

interface VideoTrimmerProps {
  videoUri: string;
  videoDuration: number;
  onTrimChange: (startTime: number, endTime: number) => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const TIMELINE_PADDING = 40;
const TIMELINE_WIDTH = SCREEN_WIDTH - TIMELINE_PADDING * 2;
const TRIM_DURATION = 5000; // 5 seconds in milliseconds

/**
 * VideoTrimmer allows selecting a 5-second segment from a video.
 * Features draggable handles using react-native-gesture-handler and Reanimated.
 * Enforces exactly 5-second duration constraint.
 */
export function VideoTrimmer({
  videoUri,
  videoDuration,
  onTrimChange,
}: VideoTrimmerProps) {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(
    Math.min(TRIM_DURATION, videoDuration)
  );

  // Shared values for animated positions
  const startPosition = useSharedValue(0);
  const endPosition = useSharedValue(
    (Math.min(TRIM_DURATION, videoDuration) / videoDuration) * TIMELINE_WIDTH
  );

  // Convert position to time
  const positionToTime = (position: number): number => {
    return (position / TIMELINE_WIDTH) * videoDuration;
  };

  // Update trim range
  const updateTrimRange = useCallback(
    (newStart: number, newEnd: number) => {
      setStartTime(newStart);
      setEndTime(newEnd);
      onTrimChange(newStart, newEnd);
    },
    [onTrimChange]
  );

  // Start handle gesture
  const startHandleGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newPosition = Math.max(
        0,
        Math.min(event.translationX + startPosition.value, TIMELINE_WIDTH - 50)
      );

      // Ensure 5-second constraint
      const newStartTime = positionToTime(newPosition);
      const maxStartTime = videoDuration - TRIM_DURATION;

      if (newStartTime <= maxStartTime) {
        startPosition.value = newPosition;
      }
    })
    .onEnd(() => {
      const newStartTime = positionToTime(startPosition.value);
      const newEndTime = newStartTime + TRIM_DURATION;

      // Adjust if exceeds video duration
      if (newEndTime > videoDuration) {
        const adjustedStart = videoDuration - TRIM_DURATION;
        startPosition.value = withSpring(
          (adjustedStart / videoDuration) * TIMELINE_WIDTH
        );
        endPosition.value = withSpring(TIMELINE_WIDTH);
        runOnJS(updateTrimRange)(adjustedStart, videoDuration);
      } else {
        endPosition.value = withSpring(
          (newEndTime / videoDuration) * TIMELINE_WIDTH
        );
        runOnJS(updateTrimRange)(newStartTime, newEndTime);
      }
    });

  // End handle gesture
  const endHandleGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newPosition = Math.max(
        50,
        Math.min(event.translationX + endPosition.value, TIMELINE_WIDTH)
      );

      // Ensure 5-second constraint
      const newEndTime = positionToTime(newPosition);
      const minEndTime = TRIM_DURATION;

      if (newEndTime >= minEndTime) {
        endPosition.value = newPosition;
      }
    })
    .onEnd(() => {
      const newEndTime = positionToTime(endPosition.value);
      const newStartTime = newEndTime - TRIM_DURATION;

      // Adjust if goes below 0
      if (newStartTime < 0) {
        startPosition.value = withSpring(0);
        endPosition.value = withSpring(
          (TRIM_DURATION / videoDuration) * TIMELINE_WIDTH
        );
        runOnJS(updateTrimRange)(0, TRIM_DURATION);
      } else {
        startPosition.value = withSpring(
          (newStartTime / videoDuration) * TIMELINE_WIDTH
        );
        runOnJS(updateTrimRange)(newStartTime, newEndTime);
      }
    });

  const startHandleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: startPosition.value }],
  }));

  const endHandleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: endPosition.value }],
  }));

  const selectionStyle = useAnimatedStyle(() => ({
    left: startPosition.value,
    width: endPosition.value - startPosition.value,
  }));

  return (
    <View className="w-full">
      {/* Video Preview */}
      <VideoPlayer uri={videoUri} className="w-full h-64 bg-black rounded-lg" />

      {/* Timeline */}
      <View className="mt-6 px-10">
        <View className="relative h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          {/* Selected Region Highlight */}
          <Animated.View
            style={selectionStyle}
            className="absolute top-0 bottom-0 bg-blue-500/30 border-l-2 border-r-2 border-blue-500"
          />

          {/* Start Handle */}
          <GestureDetector gesture={startHandleGesture}>
            <Animated.View
              style={startHandleStyle}
              className="absolute top-0 bottom-0 w-6 bg-blue-600 items-center justify-center"
            >
              <View className="w-1 h-8 bg-white rounded-full" />
            </Animated.View>
          </GestureDetector>

          {/* End Handle */}
          <GestureDetector gesture={endHandleGesture}>
            <Animated.View
              style={endHandleStyle}
              className="absolute top-0 bottom-0 w-6 bg-blue-600 items-center justify-center"
            >
              <View className="w-1 h-8 bg-white rounded-full" />
            </Animated.View>
          </GestureDetector>
        </View>

        {/* Time Display */}
        <View className="flex-row justify-between mt-3">
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            {(startTime / 1000).toFixed(1)}s
          </Text>
          <Text className="text-sm font-semibold text-blue-600">
            5.0s selected
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            {(endTime / 1000).toFixed(1)}s
          </Text>
        </View>
      </View>
    </View>
  );
}

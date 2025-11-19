import React, { useCallback, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
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
  const savedStart = useSharedValue(0);
  const savedEnd = useSharedValue(
    (Math.min(TRIM_DURATION, videoDuration) / videoDuration) * TIMELINE_WIDTH
  );

  // Convert position to time
  const positionToTime = (position: number): number => {
    "worklet";
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

  // Start handle gesture - moves both handles together maintaining 5s duration
  const startHandleGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      savedStart.value = startPosition.value;
      savedEnd.value = endPosition.value;
    })
    .onUpdate((event) => {
      ("worklet");
      const trimWidth = (TRIM_DURATION / videoDuration) * TIMELINE_WIDTH;
      const maxStartPosition = TIMELINE_WIDTH - trimWidth;
      const newStartPosition = Math.max(
        0,
        Math.min(savedStart.value + event.translationX, maxStartPosition)
      );
      // Keep 5-second duration by moving both handles together
      startPosition.value = newStartPosition;
      endPosition.value = newStartPosition + trimWidth;
    })
    .onEnd(() => {
      "worklet";
      const newStartTime = positionToTime(startPosition.value);
      const newEndTime = newStartTime + TRIM_DURATION;
      runOnJS(updateTrimRange)(newStartTime, newEndTime);
      savedStart.value = startPosition.value;
      savedEnd.value = endPosition.value;
    });

  // End handle gesture - moves both handles together maintaining 5s duration
  const endHandleGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      savedStart.value = startPosition.value;
      savedEnd.value = endPosition.value;
    })
    .onUpdate((event) => {
      ("worklet");
      const trimWidth = (TRIM_DURATION / videoDuration) * TIMELINE_WIDTH;
      const newEndPosition = Math.max(
        trimWidth,
        Math.min(savedEnd.value + event.translationX, TIMELINE_WIDTH)
      );
      // Keep 5-second duration by moving both handles together
      endPosition.value = newEndPosition;
      startPosition.value = newEndPosition - trimWidth;
    })
    .onEnd(() => {
      "worklet";
      const newEndTime = positionToTime(endPosition.value);
      const newStartTime = newEndTime - TRIM_DURATION;
      runOnJS(updateTrimRange)(newStartTime, newEndTime);
      savedStart.value = startPosition.value;
      savedEnd.value = endPosition.value;
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
      <VideoPlayer
        uri={videoUri}
        className="w-full h-64 bg-black rounded-lg mb-4"
        autoPlay={false}
      />

      {/* Timeline with Draggable Handles */}
      <View className="mt-2 px-10">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Drag handles to select 5-second segment
        </Text>

        <View
          className="relative h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"
          style={{ overflow: "visible" }}
        >
          {/* Selected Region Highlight */}
          <Animated.View
            style={[
              selectionStyle,
              {
                position: "absolute",
                top: 0,
                bottom: 0,
                backgroundColor: "rgba(59, 130, 246, 0.3)",
                borderLeftWidth: 2,
                borderRightWidth: 2,
                borderColor: "#3B82F6",
              },
            ]}
          />

          {/* Start Handle */}
          <GestureDetector gesture={startHandleGesture}>
            <Animated.View
              style={[
                startHandleStyle,
                {
                  position: "absolute",
                  top: -8,
                  bottom: -8,
                  width: 40,
                  backgroundColor: "#3B82F6",
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                },
              ]}
            >
              <View
                style={{
                  width: 4,
                  height: 40,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 2,
                }}
              />
            </Animated.View>
          </GestureDetector>

          {/* End Handle */}
          <GestureDetector gesture={endHandleGesture}>
            <Animated.View
              style={[
                endHandleStyle,
                {
                  position: "absolute",
                  top: -8,
                  bottom: -8,
                  width: 40,
                  backgroundColor: "#3B82F6",
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                },
              ]}
            >
              <View
                style={{
                  width: 4,
                  height: 40,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 2,
                }}
              />
            </Animated.View>
          </GestureDetector>
        </View>

        {/* Time Display */}
        <View className="flex-row justify-between mt-3">
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Start: {(startTime / 1000).toFixed(1)}s
          </Text>
          <Text className="text-sm font-semibold text-blue-600">
            Duration: 5.0s
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            End: {(endTime / 1000).toFixed(1)}s
          </Text>
        </View>
      </View>
    </View>
  );
}

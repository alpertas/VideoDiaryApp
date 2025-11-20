import React, { useCallback, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { VideoPlayer } from "./VideoPlayer";

interface VideoTrimmerProps {
  videoUri: string;
  videoDuration: number;
  onTrimChange: (startTime: number, endTime: number) => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const TIMELINE_PADDING = 45;
const TIMELINE_WIDTH = SCREEN_WIDTH - TIMELINE_PADDING * 2;
const HANDLE_WIDTH = 25;
const USABLE_TIMELINE_WIDTH = TIMELINE_WIDTH - HANDLE_WIDTH;
const MIN_DURATION = 1000; // 1 second in milliseconds
const MAX_DURATION = 5000; // 5 seconds in milliseconds

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
  const [endTime, setEndTime] = useState(Math.min(MAX_DURATION, videoDuration));

  // Convert time to position
  const timeToPosition = (time: number): number => {
    return (time / videoDuration) * USABLE_TIMELINE_WIDTH;
  };

  // Shared values for animated positions
  const startPosition = useSharedValue(HANDLE_WIDTH / 2);
  const endPosition = useSharedValue(
    timeToPosition(Math.min(MAX_DURATION, videoDuration)) + HANDLE_WIDTH / 2
  );
  const savedStart = useSharedValue(HANDLE_WIDTH / 2);
  const savedEnd = useSharedValue(
    timeToPosition(Math.min(MAX_DURATION, videoDuration)) + HANDLE_WIDTH / 2
  );

  // Shared values for scale animations
  const startHandleScale = useSharedValue(1.0);
  const endHandleScale = useSharedValue(1.0);

  // Convert position to time
  const positionToTime = (position: number): number => {
    "worklet";
    return (
      ((position - HANDLE_WIDTH / 2) / USABLE_TIMELINE_WIDTH) * videoDuration
    );
  };

  // Derived values for live time display
  const liveStartTime = useDerivedValue(() => {
    return positionToTime(startPosition.value);
  });

  const liveEndTime = useDerivedValue(() => {
    return positionToTime(endPosition.value);
  });

  const liveDuration = useDerivedValue(() => {
    return liveEndTime.value - liveStartTime.value;
  });

  // Update state in real-time as handles move
  useAnimatedReaction(
    () => {
      return {
        start: liveStartTime.value,
        end: liveEndTime.value,
      };
    },
    (current) => {
      runOnJS(setStartTime)(current.start);
      runOnJS(setEndTime)(current.end);
    }
  );

  // Update trim range
  const updateTrimRange = useCallback(
    (newStart: number, newEnd: number) => {
      setStartTime(newStart);
      setEndTime(newEnd);
      onTrimChange(newStart, newEnd);
    },
    [onTrimChange]
  );

  // Start handle gesture - move start handle independently with min/max constraints
  const startHandleGesture = Gesture.Pan()
    .onBegin(() => {
      ("worklet");
      savedStart.value = startPosition.value;
      savedEnd.value = endPosition.value;
      // Subtle scale up on press
      startHandleScale.value = withTiming(1.05, { duration: 100 });
    })
    .onUpdate((event) => {
      "worklet";
      const minStartPosition = Math.max(
        HANDLE_WIDTH / 2,
        endPosition.value -
          (MAX_DURATION / videoDuration) * USABLE_TIMELINE_WIDTH
      );
      const maxStartPosition =
        endPosition.value -
        (MIN_DURATION / videoDuration) * USABLE_TIMELINE_WIDTH;
      const newPosition = Math.max(
        minStartPosition,
        Math.min(savedStart.value + event.translationX, maxStartPosition)
      );
      startPosition.value = newPosition;
    })
    .onEnd(() => {
      ("worklet");
      const newStartTime = positionToTime(startPosition.value);
      const newEndTime = positionToTime(endPosition.value);
      runOnJS(updateTrimRange)(newStartTime, newEndTime);
      savedStart.value = startPosition.value;
      savedEnd.value = endPosition.value;
      // Scale back to normal on release
      startHandleScale.value = withTiming(1.0, { duration: 150 });
    });

  // End handle gesture - move end handle independently with min/max constraints
  const endHandleGesture = Gesture.Pan()
    .onBegin(() => {
      ("worklet");
      savedStart.value = startPosition.value;
      savedEnd.value = endPosition.value;
      // Subtle scale up on press
      endHandleScale.value = withTiming(1.05, { duration: 100 });
    })
    .onUpdate((event) => {
      "worklet";
      const minEndPosition =
        startPosition.value +
        (MIN_DURATION / videoDuration) * USABLE_TIMELINE_WIDTH;
      const maxEndPosition = Math.min(
        USABLE_TIMELINE_WIDTH + HANDLE_WIDTH / 2,
        startPosition.value +
          (MAX_DURATION / videoDuration) * USABLE_TIMELINE_WIDTH
      );
      const newPosition = Math.max(
        minEndPosition,
        Math.min(savedEnd.value + event.translationX, maxEndPosition)
      );
      endPosition.value = newPosition;
    })
    .onEnd(() => {
      ("worklet");
      const newStartTime = positionToTime(startPosition.value);
      const newEndTime = positionToTime(endPosition.value);
      runOnJS(updateTrimRange)(newStartTime, newEndTime);
      savedStart.value = startPosition.value;
      savedEnd.value = endPosition.value;
      // Scale back to normal on release
      endHandleScale.value = withTiming(1.0, { duration: 150 });
    });

  // Center pan gesture - drag entire selection maintaining duration
  const centerPanGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      savedStart.value = startPosition.value;
      savedEnd.value = endPosition.value;
    })
    .onUpdate((event) => {
      "worklet";
      const selectionWidth = savedEnd.value - savedStart.value;
      let newStart = savedStart.value + event.translationX;

      // Constrain to bounds
      const minStart = HANDLE_WIDTH / 2;
      const maxStart =
        USABLE_TIMELINE_WIDTH + HANDLE_WIDTH / 2 - selectionWidth;
      newStart = Math.max(minStart, Math.min(newStart, maxStart));

      startPosition.value = newStart;
      endPosition.value = newStart + selectionWidth;
    })
    .onEnd(() => {
      "worklet";
      const newStartTime = positionToTime(startPosition.value);
      const newEndTime = positionToTime(endPosition.value);
      runOnJS(updateTrimRange)(newStartTime, newEndTime);
      savedStart.value = startPosition.value;
      savedEnd.value = endPosition.value;
    });

  const startHandleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: startPosition.value - HANDLE_WIDTH / 2 },
      { scale: startHandleScale.value },
    ],
  }));

  const endHandleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: endPosition.value - HANDLE_WIDTH / 2 },
      { scale: endHandleScale.value },
    ],
  }));

  const selectionStyle = useAnimatedStyle(() => ({
    left: startPosition.value - HANDLE_WIDTH / 2,
    width: endPosition.value - startPosition.value,
  }));

  return (
    <View className="w-full">
      {/* Video Preview */}
      <VideoPlayer
        uri={videoUri}
        className="w-full h-64 bg-black rounded-lg mb-4"
        autoPlay={false}
        contentFit="contain"
        startTime={startTime}
        endTime={endTime}
      />

      {/* Timeline with Draggable Handles */}
      <View className="mt-2 px-10">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Drag handles to select 1-5 second segment
        </Text>

        <View
          className="relative h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"
          style={{ overflow: "visible" }}
        >
          {/* Selected Region Highlight */}
          <GestureDetector gesture={centerPanGesture}>
            <Animated.View
              style={[
                selectionStyle,
                {
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  backgroundColor: "rgba(59, 130, 246, 0.3)",
                },
              ]}
            />
          </GestureDetector>

          {/* Start Handle */}
          <GestureDetector gesture={startHandleGesture}>
            <Animated.View
              style={[
                startHandleStyle,
                {
                  position: "absolute",
                  left: 0,
                  top: -1,
                  bottom: -1,
                  width: HANDLE_WIDTH,
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
                  width: 3,
                  height: 35,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
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
                  left: 0,
                  top: -1,
                  bottom: -1,
                  width: HANDLE_WIDTH,
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
                  width: 3,
                  height: 35,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
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
            Duration: {((endTime - startTime) / 1000).toFixed(1)}s
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            End: {(endTime / 1000).toFixed(1)}s
          </Text>
        </View>
      </View>
    </View>
  );
}

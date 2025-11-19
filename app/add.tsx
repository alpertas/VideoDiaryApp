import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { VideoTrimmer } from "@/components/video/VideoTrimmer";
import { useAddVideoMutation } from "@/lib/queries";
import {
  videoMetadataSchema,
  type VideoMetadataFormData,
} from "@/lib/validation";

type WizardStep = 1 | 2 | 3;

interface SelectedVideo {
  uri: string;
  duration: number;
}

/**
 * AddVideoScreen implements a 3-step wizard for creating video diary entries.
 * Uses Tanstack Query mutation to handle the complete video processing pipeline.
 */
export default function AddVideoScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(
    null
  );
  const [trimRange, setTrimRange] = useState({ start: 0, end: 5000 });

  const addVideoMutation = useAddVideoMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoMetadataFormData>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Step 1: Select video from library
  const handleSelectVideo = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to select videos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: false,
        quality: 1,
        videoExportPreset: ImagePicker.VideoExportPreset.HighestQuality,
      });

      if (!result.canceled && result.assets[0]) {
        const video = result.assets[0];

        // Validate video asset
        if (!video.uri) {
          Alert.alert("Error", "Failed to load video. Please try again.");
          return;
        }

        // Validate duration (must be at least 5 seconds)
        if (!video.duration || video.duration < 5000) {
          Alert.alert(
            "Video Too Short",
            "Please select a video that is at least 5 seconds long."
          );
          return;
        }

        console.log("✅ Video selected:", {
          uri: video.uri,
          duration: video.duration,
        });

        setSelectedVideo({
          uri: video.uri,
          duration: video.duration,
        });
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("❌ Error selecting video:", error);
      Alert.alert(
        "Error",
        "Failed to load video. Please check permissions and try again."
      );
    }
  };

  // Step 2: Handle trim change
  const handleTrimChange = (start: number, end: number) => {
    setTrimRange({ start, end });
    console.log("✂️ Trim range updated:", {
      start: `${(start / 1000).toFixed(1)}s`,
      end: `${(end / 1000).toFixed(1)}s`,
      duration: `${((end - start) / 1000).toFixed(1)}s`,
    });
  };

  // Step 3: Submit form and save video
  const onSubmit = (formData: VideoMetadataFormData) => {
    if (!selectedVideo) return;

    console.log("💾 Saving video with trim:", {
      start: `${(trimRange.start / 1000).toFixed(1)}s`,
      end: `${(trimRange.end / 1000).toFixed(1)}s`,
      name: formData.name,
    });

    addVideoMutation.mutate(
      {
        sourceUri: selectedVideo.uri,
        startTime: trimRange.start,
        endTime: trimRange.end,
        name: formData.name,
        description: formData.description || "",
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Video diary created successfully!");
          router.back();
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            error instanceof Error ? error.message : "Failed to save video"
          );
        },
      }
    );
  };

  // Navigation
  const goBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep((prev) => Math.max(1, prev - 1) as WizardStep);
    }
  };

  const goNext = () => {
    if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          {/* Step Indicator */}
          <View className="flex-row justify-center items-center py-4 px-4">
            {[1, 2, 3].map((step) => (
              <View key={step} className="flex-row items-center">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    step === currentStep
                      ? "bg-blue-600"
                      : step < currentStep
                        ? "bg-green-600"
                        : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  <Text className="text-white font-semibold">{step}</Text>
                </View>
                {step < 3 && (
                  <View
                    className={`w-12 h-1 mx-2 ${
                      step < currentStep
                        ? "bg-green-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Step Content */}
          <View className="flex-1 px-4">
            {/* Step 1: Select Video */}
            {currentStep === 1 && (
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Select Video
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-center mb-8">
                  Choose a video from your library that is at least 5 seconds
                  long.
                </Text>
                <Button
                  title="Choose from Library"
                  onPress={handleSelectVideo}
                  variant="primary"
                />
              </View>
            )}

            {/* Step 2: Trim Video */}
            {currentStep === 2 && selectedVideo && (
              <View className="flex-1 py-4">
                <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Trim Video
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 mb-6">
                  Select a 5-second segment from your video by dragging the
                  handles.
                </Text>
                <VideoTrimmer
                  videoUri={selectedVideo.uri}
                  videoDuration={selectedVideo.duration}
                  onTrimChange={handleTrimChange}
                />
              </View>
            )}

            {/* Step 3: Add Metadata */}
            {currentStep === 3 && (
              <View className="flex-1 py-4">
                <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Add Details
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 mb-6">
                  Give your video diary a name and optional description.
                </Text>

                {/* Name Input */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </Text>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg"
                        placeholder="Enter video name"
                        placeholderTextColor="#9CA3AF"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  {errors.name && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </Text>
                  )}
                </View>

                {/* Description Input */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </Text>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg h-24"
                        placeholder="Enter description (optional)"
                        placeholderTextColor="#9CA3AF"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        multiline
                        textAlignVertical="top"
                      />
                    )}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Navigation Buttons */}
          <View className="px-4 pb-4 pt-2">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button
                  title={currentStep === 1 ? "Cancel" : "Back"}
                  onPress={goBack}
                  variant="secondary"
                  disabled={addVideoMutation.isPending}
                />
              </View>
              <View className="flex-1">
                {currentStep === 2 && (
                  <Button title="Next" onPress={goNext} variant="primary" />
                )}
                {currentStep === 3 && (
                  <Button
                    title="Save"
                    onPress={handleSubmit(onSubmit)}
                    variant="primary"
                    loading={addVideoMutation.isPending}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

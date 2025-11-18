import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { useUpdateVideoMutation, useVideoQuery } from "@/lib/queries";
import {
  videoMetadataSchema,
  type VideoMetadataFormData,
} from "@/lib/validation";

/**
 * EditVideoScreen allows updating video metadata (name and description).
 * Form is pre-filled with current values and validated with Zod.
 */
export default function EditVideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: video, isLoading } = useVideoQuery(Number(id));
  const updateVideoMutation = useUpdateVideoMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VideoMetadataFormData>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Pre-fill form when video data loads
  useEffect(() => {
    if (video) {
      reset({
        name: video.name,
        description: video.description || "",
      });
    }
  }, [video, reset]);

  const onSubmit = (formData: VideoMetadataFormData) => {
    updateVideoMutation.mutate(
      {
        id: Number(id),
        name: formData.name,
        description: formData.description || "",
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Video updated successfully!");
          router.back();
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            error instanceof Error ? error.message : "Failed to update video"
          );
        },
      }
    );
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  if (!video) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Video Not Found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="p-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Video Details
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mb-6">
            Update the name and description of your video diary.
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
                  className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg h-32"
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

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button
                title="Cancel"
                onPress={handleCancel}
                variant="secondary"
                disabled={updateVideoMutation.isPending}
              />
            </View>
            <View className="flex-1">
              <Button
                title="Save Changes"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                loading={updateVideoMutation.isPending}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


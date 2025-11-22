import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";

import i18n from "@/lib/i18n";
import type { VideoMetadataFormData } from "@/lib/validation";

interface Step3MetadataFormProps {
  control: Control<VideoMetadataFormData>;
  errors: FieldErrors<VideoMetadataFormData>;
}

export function Step3MetadataForm({ control, errors }: Step3MetadataFormProps) {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View className="flex-1 py-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {i18n.t("add.step3Title")}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 mb-6">
          {i18n.t("add.step3Subtitle")}
        </Text>

        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {i18n.t("add.nameLabel")}
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg"
                placeholder={i18n.t("add.namePlaceholder")}
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
            {i18n.t("add.descLabel")}
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg h-24"
                placeholder={i18n.t("add.descPlaceholder")}
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ""}
                multiline
                textAlignVertical="top"
              />
            )}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

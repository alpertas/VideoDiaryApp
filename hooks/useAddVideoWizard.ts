import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

import i18n from "@/lib/i18n";
import { useAddVideoMutation } from "@/lib/queries";
import {
  videoMetadataSchema,
  type VideoMetadataFormData,
} from "@/lib/validation";

export type WizardStep = 1 | 2 | 3;

export interface SelectedVideo {
  uri: string;
  duration: number;
}

export function useAddVideoWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);
  const MAX_DURATION = Number(process.env.EXPO_PUBLIC_MAX_VIDEO_DURATION) || 5000;
  const [trimRange, setTrimRange] = useState({ start: 0, end: MAX_DURATION });
  const [isPicking, setIsPicking] = useState(false);

  const addVideoMutation = useAddVideoMutation();

  const form = useForm<VideoMetadataFormData>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: {
      name: "",
    },
  });

  // Step 1: Select video from library
  const handleSelectVideo = async () => {
    setIsPicking(true);

    // CRITICAL: Short delay to allow React render cycle to update UI (show spinner)
    // before the Native Bridge blocks opening the Gallery
    await new Promise(r => setTimeout(r, 100));

    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          i18n.t("add.permissionTitle"),
          i18n.t("add.permissionMsg")
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
          Alert.alert(i18n.t("common.error"), i18n.t("add.loadError"));
          return;
        }

        // Validate duration (must be at least 5 seconds)
        if (!video.duration || video.duration < MAX_DURATION) {
          Alert.alert(
            i18n.t("add.videoTooShortTitle"),
            i18n.t("add.videoTooShortMsg", { duration: MAX_DURATION / 1000 })
          );
          return;
        }

        setSelectedVideo({
          uri: video.uri,
          duration: video.duration,
        });
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("❌ Error selecting video:", error);
      Alert.alert(i18n.t("common.error"), i18n.t("add.loadError"));
    } finally {
      // Always reset loading state, even if user cancels or error occurs
      setIsPicking(false);
    }
  };

  // Step 2: Handle trim change
  const handleTrimChange = (start: number, end: number) => {
    setTrimRange({ start, end });
  };

  // Step 3: Submit form and save video
  const onSubmit = (formData: VideoMetadataFormData) => {
    if (!selectedVideo) return;

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
          Alert.alert(i18n.t("common.success"), i18n.t("add.successMsg"));
          router.back();
        },
        onError: (error) => {
          Alert.alert(
            i18n.t("common.error"),
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

  return {
    currentStep,
    selectedVideo,
    trimRange,
    form,
    MAX_DURATION,
    isPending: addVideoMutation.isPending,
    isPicking,
    handleSelectVideo,
    handleTrimChange,
    onSubmit,
    goBack,
    goNext,
  };
}

import React from "react";

import { Step1SelectVideo } from "@/components/wizard/Step1SelectVideo";
import { Step2TrimVideo } from "@/components/wizard/Step2TrimVideo";
import { Step3MetadataForm } from "@/components/wizard/Step3MetadataForm";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { useAddVideoWizard } from "@/hooks/useAddVideoWizard";

/**
 * AddVideoScreen (Refactored)
 * A "Dumb View" that orchestrates the wizard using `useAddVideoWizard`.
 */
export default function AddVideoScreen() {
  const {
    currentStep,
    selectedVideo,
    form,
    MAX_DURATION,
    isPending,
    isPicking,
    handleSelectVideo,
    handleTrimChange,
    onSubmit,
    goBack,
    goNext,
  } = useAddVideoWizard();

  return (
    <WizardLayout
      currentStep={currentStep}
      onBack={goBack}
      onNext={goNext}
      onSave={form.handleSubmit(onSubmit)}
      isPending={isPending}
    >
      {currentStep === 1 && (
        <Step1SelectVideo
          onSelect={handleSelectVideo}
          maxDuration={MAX_DURATION}
          isPicking={isPicking}
        />
      )}

      {currentStep === 2 && selectedVideo && (
        <Step2TrimVideo
          videoUri={selectedVideo.uri}
          videoDuration={selectedVideo.duration}
          maxDuration={MAX_DURATION}
          onTrimChange={handleTrimChange}
        />
      )}

      {currentStep === 3 && (
        <Step3MetadataForm
          control={form.control}
          errors={form.formState.errors}
        />
      )}
    </WizardLayout>
  );
}

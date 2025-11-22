import React from "react";
import { ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import type { WizardStep } from "@/hooks/useAddVideoWizard";
import i18n from "@/lib/i18n";

interface WizardLayoutProps {
  currentStep: WizardStep;
  children: React.ReactNode;
  onBack: () => void;
  onNext?: () => void;
  onSave?: () => void;
  isPending?: boolean;
}

export function WizardLayout({
  currentStep,
  children,
  onBack,
  onNext,
  onSave,
  isPending,
}: WizardLayoutProps) {
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
          <View className="flex-1 px-4">{children}</View>

          {/* Navigation Buttons */}
          <View className="px-4 pb-4 pt-2">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button
                  title={
                    currentStep === 1 ? i18n.t("common.cancel") : i18n.t("common.back")
                  }
                  onPress={onBack}
                  variant="secondary"
                  disabled={isPending}
                />
              </View>
              <View className="flex-1">
                {currentStep === 2 && onNext && (
                  <Button
                    title={i18n.t("common.next")}
                    onPress={onNext}
                    variant="primary"
                  />
                )}
                {currentStep === 3 && onSave && (
                  <Button
                    title={i18n.t("common.save")}
                    onPress={onSave}
                    variant="primary"
                    loading={isPending}
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

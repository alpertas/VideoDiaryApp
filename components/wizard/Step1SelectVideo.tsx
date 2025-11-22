import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import i18n from "@/lib/i18n";

interface Step1SelectVideoProps {
  onSelect: () => void;
  maxDuration: number;
}

export function Step1SelectVideo({ onSelect, maxDuration }: Step1SelectVideoProps) {
  return (
    <View className="flex-1 items-center justify-center py-8">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {i18n.t("add.step1Title")}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-center mb-8">
        {i18n.t("add.step1Subtitle", { duration: maxDuration / 1000 })}
      </Text>
      <Button
        title={i18n.t("add.chooseBtn")}
        onPress={onSelect}
        variant="primary"
      />
    </View>
  );
}

import i18n from "@/lib/i18n";
import { useFilterStore } from "@/store/filter-store";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

/**
 * SearchBar component with internal debounce logic.
 * Prevents list flickering and focus loss by managing local state.
 */
export function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Sync local state with global state on mount (or if global changes externally)
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Debounce logic: Update global store 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        setSearchQuery(localQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery, searchQuery]);

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery(""); // Clear immediately on explicit action
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-800 rounded-lg flex-row items-center px-3 border border-gray-200 dark:border-gray-700 h-12">
      <Ionicons name="search" size={20} color="#9CA3AF" />
      <TextInput
        className="flex-1 py-3 px-2 text-gray-900 dark:text-white"
        placeholder={i18n.t("main.searchPlaceholder")}
        placeholderTextColor="#9CA3AF"
        value={localQuery}
        onChangeText={setLocalQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {localQuery.length > 0 && (
        <Pressable onPress={handleClear}>
          <Ionicons name="close-circle" size={20} color="#9CA3AF" />
        </Pressable>
      )}
    </View>
  );
}

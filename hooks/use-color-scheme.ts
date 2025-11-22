import { useUIStore } from '@/store/ui-store';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Custom hook that combines Zustand themeMode with system color scheme.
 * - If themeMode is 'system', returns the device's color scheme
 * - If themeMode is 'light' or 'dark', returns that value
 */
export function useColorScheme() {
    const systemColorScheme = useRNColorScheme();
    const { themeMode } = useUIStore();

    if (themeMode === 'system') {
        return systemColorScheme ?? 'light';
    }

    return themeMode;
}

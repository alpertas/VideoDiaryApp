import { initDatabase } from '@/lib/database';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

interface UseAppLoadingResult {
  isReady: boolean;
  error: Error | null;
}

/**
 * Custom hook to manage app loading state.
 * Orchestrates database initialization and splash screen visibility.
 *
 * @returns {UseAppLoadingResult} - Loading state and error if any
 */
export function useAppLoading(): UseAppLoadingResult {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize database
        await initDatabase();

        // Mark app as ready
        setIsReady(true);
      } catch (e) {
        console.error('Failed to initialize app:', e);
        setError(e instanceof Error ? e : new Error('Unknown error'));
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // Separate timeout effect that depends on isReady
  useEffect(() => {
    if (isReady) return; // Already ready, no timeout needed

    const timeout = setTimeout(() => {
      const timeoutError = new Error('App initialization timeout');
      console.error(timeoutError);
      setError(timeoutError);
      SplashScreen.hideAsync();
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isReady]);

  return { isReady, error };
}

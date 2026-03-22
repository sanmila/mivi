import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { LanguageProvider } from '../context/LanguageContext';
import { ToastProvider } from '../context/ToastContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import { DemoProvider } from '../context/DemoContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { OfflineBanner } from '../components/OfflineBanner';
import { trackEvent } from '../utils/analytics';
import { Platform } from 'react-native';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    trackEvent('app_opened');
    
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SubscriptionProvider>
          <DemoProvider>
            <LanguageProvider>
              <ToastProvider>
                <OfflineBanner />
                <Stack screenOptions={{ 
                  headerShown: false,
                  animation: 'fade'
                }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="welcome" />
                  <Stack.Screen name="hero" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="onboarding" />
                  <Stack.Screen name="analysis" />
                  <Stack.Screen name="result" />
                  <Stack.Screen name="auth-entry" />
                  <Stack.Screen name="signup" />
                  <Stack.Screen name="login" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="recalibration" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="weekly-report" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="share-adaptation" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="adaptation-info" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="body-control" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="session-summary" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="settings" />
                  <Stack.Screen name="exercise-library" />
                  <Stack.Screen name="exercise-technique" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="body-metrics" />
                  <Stack.Screen name="personal-records" />
                  <Stack.Screen name="subscription" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </ToastProvider>
            </LanguageProvider>
          </DemoProvider>
        </SubscriptionProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

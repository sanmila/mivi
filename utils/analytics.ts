// Minimal analytics hook for tracking events locally (to be synced with backend later)
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (__DEV__) {
    console.log(`[Analytics] ${eventName}`, params || '');
  }
  // Future: Send to Mixpanel, Amplitude, or custom backend
};

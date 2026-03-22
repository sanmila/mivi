import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Fallback for web environment where SecureStore is not available
const isWeb = Platform.OS === 'web';

export const getTokens = async () => {
  try {
    if (isWeb && typeof window !== 'undefined') {
      return {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
      };
    }
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    return { accessToken, refreshToken };
  } catch (e) {
    // Catch SecurityError if localStorage is blocked by browser settings
    console.warn('Failed to get tokens', e);
    return { accessToken: null, refreshToken: null };
  }
};

export const setTokens = async (accessToken: string, refreshToken: string) => {
  try {
    if (isWeb && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return;
    }
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  } catch (e) {
    console.warn('Failed to set tokens', e);
  }
};

export const clearTokens = async () => {
  try {
    if (isWeb && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return;
    }
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  } catch (e) {
    console.warn('Failed to clear tokens', e);
  }
};

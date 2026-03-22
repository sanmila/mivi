import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { apiClient } from '../utils/api';

export type SubscriptionLevel = 'FREE' | 'PRO' | 'ELITE';

interface SubscriptionContextType {
  subscription: SubscriptionLevel;
  setSubscription: (level: SubscriptionLevel) => Promise<void>;
  syncSubscription: () => Promise<void>;
  isPro: boolean;
  isElite: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const isWeb = Platform.OS === 'web';

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubState] = useState<SubscriptionLevel>('FREE');

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const stored = isWeb 
          ? localStorage.getItem('mivi_subscription') 
          : await SecureStore.getItemAsync('mivi_subscription');
        if (stored === 'PRO' || stored === 'ELITE') {
          setSubState(stored as SubscriptionLevel);
        }
      } catch (e) {
        console.error('Failed to load subscription state', e);
      }
      
      // Attempt to sync with backend
      syncSubscription();
    };
    loadSubscription();
  }, []);

  const syncSubscription = async () => {
    try {
      const res = await apiClient.get('/v2/mivi/subscription/status');
      if (res?.level) {
        await setSubscription(res.level as SubscriptionLevel);
      }
    } catch (e) {
      // Silently fail and rely on local cache
    }
  };

  const setSubscription = async (level: SubscriptionLevel) => {
    setSubState(level);
    try {
      if (isWeb) {
        localStorage.setItem('mivi_subscription', level);
      } else {
        await SecureStore.setItemAsync('mivi_subscription', level);
      }
    } catch (e) {
      console.error('Failed to save subscription state', e);
    }
  };

  return (
    <SubscriptionContext.Provider value={{ 
      subscription, 
      setSubscription,
      syncSubscription,
      isPro: subscription === 'PRO' || subscription === 'ELITE',
      isElite: subscription === 'ELITE'
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

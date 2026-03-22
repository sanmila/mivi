import React, { createContext, useContext, useState, useCallback } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface ToastContextType {
  showToast: (title: string, body: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<{ title: string; body: string; id: number } | null>(null);

  const showToast = useCallback((title: string, body: string) => {
    const id = Date.now();
    setToast({ title, body, id });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <View key={toast.id} style={styles.toastContainer}>
          <Text style={styles.title}>{toast.title}</Text>
          <Text style={styles.body}>{toast.body}</Text>
        </View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#1A1B1E',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    borderRadius: SIZES.radius,
    padding: 16,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.textDarkPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  body: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textDarkSecondary,
  }
});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

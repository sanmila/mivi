import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

interface ErrorStateProps {
  onRetry: () => void;
  isDark?: boolean;
}

export const ErrorState = ({ onRetry, isDark = false }: ErrorStateProps) => {
  const { t } = useLanguage();

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <AlertCircle size={32} color={COLORS.accent} style={styles.icon} />
      <Text style={[styles.title, isDark && styles.titleDark]}>{t('errorTitle')}</Text>
      <Text style={[styles.description, isDark && styles.descriptionDark]}>{t('errorDesc')}</Text>
      
      <TouchableOpacity 
        style={[styles.button, isDark && styles.buttonDark]} 
        activeOpacity={0.8} 
        onPress={onRetry}
      >
        <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>{t('retry')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  containerDark: {
    backgroundColor: '#1A1B1E',
    borderColor: COLORS.darkBorder,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  titleDark: {
    color: COLORS.textDarkPrimary,
  },
  description: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  descriptionDark: {
    color: COLORS.textDarkSecondary,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.textPrimary,
    borderRadius: 4,
  },
  buttonDark: {
    borderColor: COLORS.textDarkPrimary,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonTextDark: {
    color: COLORS.textDarkPrimary,
  }
});

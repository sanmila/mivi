import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isDark?: boolean;
}

export const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction, isDark = false }: EmptyStateProps) => {
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.iconBox, isDark && styles.iconBoxDark]}>
        <Icon size={24} color={isDark ? COLORS.textDarkSecondary : COLORS.textSecondary} />
      </View>
      <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      <Text style={[styles.description, isDark && styles.descriptionDark]}>{description}</Text>
      
      {actionLabel && onAction && (
        <TouchableOpacity 
          style={[styles.button, isDark && styles.buttonDark]} 
          activeOpacity={0.8} 
          onPress={onAction}
        >
          <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
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
    borderStyle: 'dashed',
  },
  containerDark: {
    backgroundColor: '#1A1B1E',
    borderColor: COLORS.darkBorder,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBoxDark: {
    backgroundColor: COLORS.darkPanel,
    borderColor: COLORS.darkBorder,
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
    backgroundColor: COLORS.textPrimary,
    borderRadius: 4,
  },
  buttonDark: {
    backgroundColor: COLORS.textDarkPrimary,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.card,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonTextDark: {
    color: COLORS.darkPanel,
  }
});

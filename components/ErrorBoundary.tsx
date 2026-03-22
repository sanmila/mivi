import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { translations } from '../constants/translations';
import { trackEvent } from '../utils/analytics';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    trackEvent('app_crash', { error: error.message });
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Fallback to Russian if context is unavailable at this level
      const t = (key: string) => translations['ru'][key as keyof typeof translations['ru']] || key;

      return (
        <View style={styles.container}>
          <Text style={styles.title}>{t('somethingWentWrong')}</Text>
          <Text style={styles.subtitle}>{t('tryRestart')}</Text>
          
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.buttonText}>{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkPanel,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.paddingLarge,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.textDarkPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textDarkSecondary,
    marginBottom: 32,
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: SIZES.radius,
  },
  buttonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});

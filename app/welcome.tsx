import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

const LOGO_URL = 'https://images.dualite.app/67a2899f-ad42-4385-b6ae-15305675cef2/white-e69d1f36-45dc-422a-a5ec-d2116b76e24b.webp';

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top + 24, 24), paddingBottom: Math.max(insets.bottom + 24, 48) }]}>
      <View style={styles.center}>
        <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
        <View style={styles.accentLine} />
        <Text style={styles.tagline}>
          {t('mainTagline')}
        </Text>
        <Text style={styles.explanation}>
          {t('welcomeExplanation')}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          activeOpacity={0.9}
          onPress={() => router.push('/onboarding')}
        >
          <Text style={styles.primaryButtonText}>{t('begin')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          activeOpacity={0.7}
          onPress={() => router.push('/hero')}
        >
          <Text style={styles.secondaryButtonText}>{t('whatIsMivi')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'space-between', padding: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 170, height: 56 },
  accentLine: { width: 38, height: 2, backgroundColor: COLORS.accent, borderRadius: 1, marginTop: 18, marginBottom: 26 },
  tagline: { fontFamily: 'Inter_500Medium', fontSize: 15, color: '#FFFFFF', textAlign: 'center', lineHeight: 24, maxWidth: 260 },
  explanation: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginTop: 24, maxWidth: 280 },
  footer: { gap: 16 },
  primaryButton: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  primaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 },
  secondaryButton: { backgroundColor: COLORS.card, height: 48, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 14 },
  secondaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1 }
});

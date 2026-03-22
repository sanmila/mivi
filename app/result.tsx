import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { useDemo } from '../context/DemoContext';

export default function ResultScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { setDemoLevel, setHasCompletedMinimumSetup } = useDemo();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top + 24, 24), paddingBottom: Math.max(insets.bottom + 24, 40) }]}>
      <View style={styles.center}>
        <Text style={styles.title}>{t('miviReadyTitle')}</Text>
        <Text style={styles.subtitle}>{t('resultReady')}</Text>
        
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>{t('adaptBaseline')}</Text>
          <Text style={styles.scoreValue}>67</Text>
          <Text style={styles.scoreDesc}>{t('miviReadyDesc')}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.9} 
          onPress={() => router.push('/auth-entry')}
        >
          <Text style={styles.buttonText}>{t('saveProfile')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.guestButton} 
          activeOpacity={0.7} 
          onPress={() => {
            setDemoLevel('calibration');
            setHasCompletedMinimumSetup(false);
            router.replace('/(tabs)');
          }}
        >
          <Text style={styles.guestButtonText}>{t('continueAsGuest')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'space-between' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SIZES.paddingLarge },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary, marginBottom: 48, textAlign: 'center' },
  scoreBox: { alignItems: 'center', marginBottom: 20 },
  scoreLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  scoreValue: { fontFamily: 'Inter_700Bold', fontSize: 100, color: COLORS.textPrimary, letterSpacing: -4, lineHeight: 110 },
  scoreDesc: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginTop: 16, maxWidth: 280 },
  footer: { paddingHorizontal: SIZES.paddingLarge },
  button: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14, width: '100%' },
  buttonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 },
  guestButton: { marginTop: 16, alignItems: 'center', paddingVertical: 8 },
  guestButtonText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textSecondary }
});

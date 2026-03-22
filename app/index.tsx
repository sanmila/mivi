import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  Easing 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../constants/translations';
import { getTokens, clearTokens } from '../utils/auth';
import { apiClient } from '../utils/api';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'be', label: 'Беларуская' },
  { code: 'kk', label: 'Қазақша' },
  { code: 'en', label: 'English' },
];

const LOGO_URL = 'https://images.dualite.app/67a2899f-ad42-4385-b6ae-15305675cef2/white-e69d1f36-45dc-422a-a5ec-d2116b76e24b.webp';

export default function BootstrapScreen() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  
  const [sessionTarget, setSessionTarget] = useState<'tabs' | 'welcome' | null>(null);
  const [animationFinished, setAnimationFinished] = useState(false);

  const logoOpacity = useSharedValue(0);
  const lineScale = useSharedValue(0);
  const ruOpacity = useSharedValue(0);
  const ruTranslateY = useSharedValue(10);
  const subOpacity = useSharedValue(0);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { accessToken } = await getTokens();
        if (!accessToken) {
          setSessionTarget('welcome');
          return;
        }
        await apiClient.get('/v2/mivi/athlete/profile');
        setSessionTarget('tabs');
      } catch (e: any) {
        if (e.message?.includes('401') || e.message?.includes('403')) {
          await clearTokens();
          setSessionTarget('welcome');
        } else {
          setSessionTarget('tabs');
        }
      }
    };
    checkSession();

    logoOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
    lineScale.value = withDelay(600, withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }));
    ruOpacity.value = withDelay(1000, withTiming(0.92, { duration: 450, easing: Easing.out(Easing.ease) }));
    ruTranslateY.value = withDelay(1000, withTiming(0, { duration: 450, easing: Easing.out(Easing.ease) }));
    subOpacity.value = withDelay(1300, withTiming(0.4, { duration: 450, easing: Easing.out(Easing.ease) }));

    const timer = setTimeout(() => {
      setAnimationFinished(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({ opacity: logoOpacity.value }));
  const lineStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: lineScale.value }] }));
  const ruStyle = useAnimatedStyle(() => ({ 
    opacity: ruOpacity.value,
    transform: [{ translateY: ruTranslateY.value }]
  }));
  const subStyle = useAnimatedStyle(() => ({ opacity: subOpacity.value }));

  if (!animationFinished || !sessionTarget) {
    return (
      <View style={styles.splashContainer}>
        <Animated.Image 
          source={{ uri: LOGO_URL }} 
          style={[styles.splashLogoImage, logoStyle]} 
          resizeMode="contain"
        />
        <Animated.View style={[styles.splashLine, lineStyle]} />
        <Animated.Text style={[styles.splashTagline, ruStyle]}>
          {t('mainTagline')}
        </Animated.Text>
        <Animated.Text style={[styles.splashSubTagline, subStyle]}>
          {t('splashSubTagline')}
        </Animated.Text>
      </View>
    );
  }

  if (sessionTarget === 'tabs') {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 60, 100) }]}>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>{t('selectLanguage')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langCard, isSelected && styles.langCardSelected]}
              onPress={() => setLanguage(lang.code)}
              activeOpacity={0.9}
            >
              <Text style={[styles.langText, isSelected && styles.langTextSelected]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 24, 40) }]}>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.9}
          onPress={() => router.push('/welcome')}
        >
          <Text style={styles.buttonText}>{t('continueBtn')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1, backgroundColor: '#0B0F14', justifyContent: 'center', alignItems: 'center' },
  splashLogoImage: { height: 56, width: 170, backgroundColor: 'transparent' },
  splashLine: { width: 38, height: 2, backgroundColor: '#FF542C', borderRadius: 1, marginTop: 24, marginBottom: 24 },
  splashTagline: { fontFamily: 'Inter_500Medium', fontSize: 15, color: '#FFFFFF', textAlign: 'center', lineHeight: 24, maxWidth: 260 },
  splashSubTagline: { fontFamily: 'Inter_500Medium', fontSize: 9, color: '#FFFFFF', textAlign: 'center', marginTop: 24, letterSpacing: 2, textTransform: 'uppercase' },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingBottom: 16, paddingHorizontal: SIZES.paddingLarge },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: -0.5 },
  content: { padding: SIZES.paddingLarge, paddingTop: 24, gap: 12 },
  langCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, padding: 20, borderRadius: SIZES.radius, flexDirection: 'row', alignItems: 'center' },
  langCardSelected: { borderColor: COLORS.accent, backgroundColor: 'rgba(255, 84, 44, 0.04)' },
  langText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: COLORS.textPrimary },
  langTextSelected: { color: COLORS.accent },
  footer: { padding: SIZES.paddingLarge },
  button: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  buttonText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 }
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

const LOGO_URL = 'https://images.dualite.app/67a2899f-ad42-4385-b6ae-15305675cef2/white-e69d1f36-45dc-422a-a5ec-d2116b76e24b.webp';

export default function HeroScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.closeBtn} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroTextContainer}>
          <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
          <Text style={styles.subtitle}>{t('heroSubtitle')}</Text>
          <Text style={styles.description}>{t('heroDesc')}</Text>
        </View>

        <View style={styles.featuresList}>
          
          <View style={styles.featureBlock}>
            <View style={styles.mockupCardCenter}>
              <Text style={styles.mockupGiant}>82</Text>
              <Text style={styles.mockupAccent}>+4</Text>
            </View>
            <Text style={styles.caption}>{t('heroCap1')}</Text>
          </View>

          <View style={styles.featureBlock}>
            <View style={styles.mockupCardLeft}>
              <Text style={styles.mockupExercise}>{t('benchPress')}</Text>
              <Text style={styles.mockupReps}>4 × 8</Text>
              <View style={styles.mockupCircles}>
                <View style={[styles.circle, styles.circleFilled]} />
                <View style={[styles.circle, styles.circleFilled]} />
                <View style={styles.circle} />
                <View style={styles.circle} />
              </View>
            </View>
            <Text style={styles.caption}>{t('heroCap2')}</Text>
          </View>

          <View style={styles.featureBlock}>
            <View style={styles.mockupCardCenter}>
              <View style={styles.chartContainer}>
                <View style={[styles.chartBar, { height: '40%' }]} />
                <View style={[styles.chartBar, { height: '60%' }]} />
                <View style={[styles.chartBar, { height: '50%' }]} />
                <View style={[styles.chartBar, { height: '80%', backgroundColor: COLORS.accent }]} />
              </View>
            </View>
            <Text style={styles.caption}>{t('heroCap3')}</Text>
          </View>

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: SIZES.paddingLarge },
  closeBtn: { padding: 4 },
  content: { paddingHorizontal: SIZES.paddingLarge, paddingBottom: 60 },
  heroTextContainer: { marginTop: 16, marginBottom: 48 },
  logo: { width: 160, height: 48, marginBottom: 16 },
  subtitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, lineHeight: 20 },
  description: { fontFamily: 'Inter_500Medium', fontSize: 15, color: COLORS.textSecondary, lineHeight: 24 },
  featuresList: { gap: 40 },
  featureBlock: { alignItems: 'center' },
  mockupCardCenter: { width: '100%', height: 160, backgroundColor: COLORS.card, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 },
  mockupCardLeft: { width: '100%', height: 160, backgroundColor: COLORS.card, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 32, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 },
  caption: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary, textAlign: 'center' },
  mockupGiant: { fontFamily: 'Inter_700Bold', fontSize: 64, color: COLORS.textPrimary, letterSpacing: -3, marginTop: 8, marginBottom: -8 },
  mockupAccent: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.accent },
  mockupExercise: { fontFamily: 'Inter_700Bold', fontSize: 20, color: COLORS.textPrimary, marginBottom: 4 },
  mockupReps: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textSecondary, marginBottom: 20 },
  mockupCircles: { flexDirection: 'row', gap: 12 },
  circle: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: COLORS.textSecondary },
  circleFilled: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 12 },
  chartBar: { width: 24, backgroundColor: COLORS.border, borderRadius: 2 },
});

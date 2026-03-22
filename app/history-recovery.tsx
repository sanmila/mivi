import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, HeartPulse } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function RecoveryHistoryScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const MOCK_HISTORY = [
    { id: '1', date: t('todayLabel'), score: t('statusModerate'), sleep: `6${t('h')} 42${t('m')}`, hrv: `58 ${t('ms')}`, rhr: `61 ${t('bpm')}` },
    { id: '2', date: t('oct24'), score: t('statusHigh'), sleep: `8${t('h')} 10${t('m')}`, hrv: `65 ${t('ms')}`, rhr: `58 ${t('bpm')}` },
    { id: '3', date: t('oct23'), score: t('statusLow'), sleep: `5${t('h')} 30${t('m')}`, hrv: `45 ${t('ms')}`, rhr: `65 ${t('bpm')}` },
    { id: '4', date: t('oct22'), score: t('statusModerate'), sleep: `7${t('h')} 15${t('m')}`, hrv: `55 ${t('ms')}`, rhr: `60 ${t('bpm')}` },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color={COLORS.textDarkPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>{t('recoveryHistory')}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {MOCK_HISTORY.map(day => (
          <View key={day.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <HeartPulse size={16} color={day.score === t('statusLow') ? COLORS.accent : COLORS.textDarkPrimary} />
                <Text style={styles.sessionDate}>{day.date}</Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{day.score}</Text>
              </View>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>{t('sleep')}</Text>
                <Text style={styles.statValue}>{day.sleep}</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>{t('hrv')}</Text>
                <Text style={styles.statValue}>{day.hrv}</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>{t('restingHr')}</Text>
                <Text style={styles.statValue}>{day.rhr}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkPanel },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textDarkPrimary, textTransform: 'uppercase', letterSpacing: 1.5, flex: 1, textAlign: 'center' },
  content: { padding: SIZES.paddingLarge, gap: 16, paddingBottom: 40 },
  historyCard: { backgroundColor: '#1A1B1E', borderWidth: 1, borderColor: COLORS.darkBorder, borderRadius: SIZES.radius, padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sessionDate: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textDarkPrimary },
  scoreBadge: { backgroundColor: COLORS.darkBorder, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  scoreText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textDarkPrimary, textTransform: 'uppercase' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBlock: { gap: 4 },
  statLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textDarkSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textDarkPrimary }
});

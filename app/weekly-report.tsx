import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { COLORS, SIZES } from '../constants/theme';
import { X, CheckCircle2, TrendingUp, Activity, Lock } from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';
import { useWeeklyReport } from '../hooks/useApi';
import { useSubscription } from '../context/SubscriptionContext';
import { trackEvent } from '../utils/analytics';

export default function WeeklyReportScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { isPro } = useSubscription();
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const { data: reportData } = useWeeklyReport(todayStr);

  const openPaywall = () => {
    trackEvent('subscription_screen_opened', { source: 'weekly_report_footer' });
    router.push('/subscription');
  };

  let headline = t('headlineStable');
  if (reportData?.averages?.readinessScore < 50) {
    headline = t('headlineLagging');
  } else if (reportData?.consistency?.daysWith2PlusPillars >= 5) {
    headline = t('headlineExcellent');
  }

  const wins = [];
  if (reportData?.consistency?.daysWith2PlusPillars >= 4) {
    wins.push({ icon: CheckCircle2, text: `${t('discipline')}: ${reportData.consistency.daysWith2PlusPillars}/7 ${t('daysLogged')}` });
  }
  if (reportData?.trainingStats?.sessionsCount > 0) {
    wins.push({ icon: Activity, text: `${t('trainLoad')}: ${reportData.trainingStats.sessionsCount} ${t('workoutsCount')}` });
  }
  if (reportData?.deltas?.adaptation > 0) {
    wins.push({ icon: TrendingUp, text: `${t('adaptation')}: +${reportData.deltas.adaptation} ${t('perWeek')}` });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('weeklyReport')}</Text>
          <Text style={styles.subtitle}>{t('weekW4')}</Text>
        </View>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        
        <View style={styles.headlineBox}>
          <Text style={styles.headlineText}>{headline}</Text>
        </View>

        {wins.length > 0 && (
          <View style={styles.winsCard}>
            <Text style={styles.sectionLabel}>{t('winsOfWeek')}</Text>
            {wins.map((win, idx) => (
              <View key={idx} style={styles.winRow}>
                <win.icon size={16} color={COLORS.accent} />
                <Text style={styles.winText}>{win.text}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.adaptBlock}>
          <Text style={styles.sectionLabel}>{t('adaptation')}</Text>
          <Text style={styles.giantMetric}>82</Text>
          <Text style={styles.metricSub}>{t('plusWeek')}</Text>
          
          <View style={styles.interpBox}>
            <Text style={styles.interpText}>{t('adaptInterpretation')}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{t('perfIndicators')}</Text>
          <View style={styles.row}><Text style={styles.body}>{t('strength')}</Text><Text style={styles.value}>74  <Text style={styles.trendUp}>↑ +3</Text></Text></View>
          <View style={styles.divider} />
          <View style={styles.row}><Text style={styles.body}>{t('endurance')}</Text><Text style={styles.value}>68  <Text style={styles.trendUp}>↑ +2</Text></Text></View>
          <View style={styles.divider} />
          <View style={styles.row}><Text style={styles.body}>{t('recovery')}</Text><Text style={styles.value}>71  <Text style={styles.trendNeutral}>{t('stableLower')}</Text></Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{t('weeklyLoad')}</Text>
          <View style={styles.row}><Text style={styles.body}>{t('totalWorkouts')}</Text><Text style={styles.value}>4</Text></View>
          <View style={styles.divider} />
          <View style={styles.row}><Text style={styles.body}>{t('totalVolume')}</Text><Text style={styles.value}>72 {t('sets')}</Text></View>
          <View style={styles.divider} />
          <View style={styles.row}><Text style={styles.body}>{t('avgIntensityReport')}</Text><Text style={styles.value}>RPE 7.8</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{t('sysRecReport')}</Text>
          <Text style={styles.recommendationText}>{t('sysRecReportValue')}</Text>
          <Text style={styles.projectionText}>{t('sysRecReportProj')}</Text>
        </View>

        {!isPro && (
          <TouchableOpacity style={styles.upgradeBanner} activeOpacity={0.8} onPress={openPaywall}>
            <Lock size={14} color={COLORS.accent} />
            <Text style={styles.upgradeBannerText}>{t('upgradeForInsights')}</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: SIZES.paddingLarge, paddingTop: 48, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.textPrimary, letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary },
  content: { padding: SIZES.paddingLarge, gap: 16, paddingBottom: 40 },
  headlineBox: { backgroundColor: COLORS.accent, padding: 16, borderRadius: SIZES.radius, marginTop: 8 },
  headlineText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#FFFFFF', lineHeight: 20 },
  winsCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: SIZES.paddingLarge, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 },
  winRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  winText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary },
  adaptBlock: { alignItems: 'center', paddingVertical: 16 },
  giantMetric: { fontFamily: 'Inter_700Bold', fontSize: 80, color: COLORS.textPrimary, letterSpacing: -4, marginTop: 8, marginBottom: -4 },
  metricSub: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 24 },
  interpBox: { backgroundColor: COLORS.card, padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 },
  interpText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary, lineHeight: 22, textAlign: 'center' },
  card: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: SIZES.paddingLarge, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 },
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  body: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary },
  value: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textPrimary },
  trendUp: { color: COLORS.accent, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  trendNeutral: { color: COLORS.textSecondary, fontFamily: 'Inter_500Medium', fontSize: 14 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  recommendationText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary, lineHeight: 22, marginBottom: 12 },
  projectionText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  upgradeBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.card, paddingVertical: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.accent, marginTop: 8 },
  upgradeBannerText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 0.5 }
});

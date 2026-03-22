import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { format, subDays } from 'date-fns';
import Svg, { Line } from 'react-native-svg';
import { COLORS, SIZES } from '../../constants/theme';
import { MetricMedium, Label, Body, Micro } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Divider } from '../../components/Divider';
import { useLanguage } from '../../context/LanguageContext';
import { useLogAction, useRecoverDaily } from '../../hooks/useApi';
import { Skeleton } from '../../components/Skeleton';
import { ErrorState } from '../../components/ErrorState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalHeader } from '../../components/GlobalHeader';

const RecoverySkeleton = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={{ paddingTop: Math.max(insets.top + 20, 40), paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Skeleton isDark style={{ width: 80, height: 20 }} />
        </View>
        <Skeleton isDark style={{ width: 120, height: 16, alignSelf: 'center', marginBottom: 36 }} />
        <Skeleton style={{ width: 100, height: 16, marginBottom: 8 }} />
        <Skeleton style={{ width: 140, height: 40, marginBottom: 12 }} />
        <Skeleton style={{ width: 60, height: 24, borderRadius: 4, marginBottom: 24 }} />
        <Skeleton style={{ width: '100%', height: 56, borderRadius: SIZES.radius, marginBottom: 24 }} />
        <Skeleton style={{ width: '100%', height: 160, borderRadius: SIZES.radius, marginBottom: 24 }} />
        <Skeleton style={{ width: '100%', height: 140, borderRadius: SIZES.radius }} />
      </View>
    </View>
  );
};

export default function RecoveryScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const logRecover = useLogAction('/v2/mivi/recover/daily');
  
  const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const { data: yesterdayData, isLoading, isError, refetch } = useRecoverDaily(yesterdayStr);

  const [sleep, setSleep] = useState({ h: 6, m: 42 });
  const [hrv, setHrv] = useState(58);
  const [rhr, setRhr] = useState(61);

  useEffect(() => {
    if (yesterdayData) {
      if (yesterdayData.sleepHours) {
        const totalMins = Math.round(yesterdayData.sleepHours * 60);
        setSleep({ h: Math.floor(totalMins / 60), m: totalMins % 60 });
      }
      if (yesterdayData.hrv) setHrv(yesterdayData.hrv);
      if (yesterdayData.restingHr) setRhr(yesterdayData.restingHr);
    }
  }, [yesterdayData]);

  if (isLoading) return <RecoverySkeleton />;
  if (isError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', padding: 16 }]}>
        <ErrorState onRetry={refetch} />
      </View>
    );
  }

  // 7-Day Trend Data (Y positions in percentage, where 0% is top, 100% is bottom)
  const trendData = [60, 45, 55, 70, 50, 65, 40];
  const days = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      
      <GlobalHeader title={t('tabRecover')} />

      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Label>{t('recState')}</Label>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
              <Micro style={styles.statusText}>{t('stable')}</Micro>
            </View>
          </View>
          <MetricMedium>{t('recoveryStatusModerate')}</MetricMedium>
        </View>

        <View style={styles.explanationCard}>
          <Text style={styles.explanationText}>{t('recoveryExplanation')}</Text>
        </View>

        <TouchableOpacity 
          style={styles.checkinBtn} 
          activeOpacity={0.8}
          onPress={() => router.push('/recovery-checkin')}
        >
          <Text style={styles.checkinBtnText}>{t('dailyCheckin')}</Text>
        </TouchableOpacity>

        <Card>
          <Label style={styles.sectionTitle}>{t('biometrics')}</Label>
          
          <View style={styles.bioRow}>
            <Body style={styles.bioLabel}>{t('sleep')}</Body>
            <Body style={styles.bioValue}>{sleep.h}{t('h')} {sleep.m}{t('m')}</Body>
          </View>
          <Divider />
          
          <View style={styles.bioRow}>
            <Body style={styles.bioLabel}>{t('hrv')}</Body>
            <Body style={styles.bioValue}>{hrv} {t('ms')}</Body>
          </View>
          <Divider />
          
          <View style={styles.bioRow}>
            <Body style={styles.bioLabel}>{t('restingHr')}</Body>
            <Body style={styles.bioValue}>{rhr} {t('bpm')}</Body>
          </View>
          <Divider />
          
          <View style={styles.bioRow}>
            <Body style={styles.bioLabel}>{t('feelingLabel')}</Body>
            <Body style={styles.bioValue}>{t('feelingValue')}</Body>
          </View>
        </Card>

        <Card>
          <Label style={styles.sectionTitle}>{t('recoveryTrend')}</Label>
          <View style={styles.chartContainer}>
            <View style={styles.trendGraph}>
              <Svg style={StyleSheet.absoluteFill}>
                <Line x1="0" y1="50%" x2="100%" y2="50%" stroke={COLORS.border} strokeWidth="1" strokeDasharray="4 4" />
                {trendData.map((y, i) => {
                  if (i === 0) return null;
                  const prevY = trendData[i - 1];
                  const x1 = `${(i - 1) * (100 / 6)}%`;
                  const x2 = `${i * (100 / 6)}%`;
                  return (
                    <Line key={`line-${i}`} x1={x1} y1={`${prevY}%`} x2={x2} y2={`${y}%`} stroke={COLORS.textSecondary} strokeOpacity="0.4" strokeWidth="1.5" />
                  );
                })}
              </Svg>
              {trendData.map((y, i) => {
                const isLast = i === trendData.length - 1;
                const x = `${i * (100 / 6)}%`;
                return (
                  <View key={`point-${i}`} style={[
                    isLast ? styles.trendPointToday : styles.trendPoint,
                    { left: x, top: `${y}%`, marginTop: isLast ? -4 : -3, marginLeft: isLast ? -4 : -3 }
                  ]} />
                );
              })}
            </View>
            <View style={styles.chartLabels}>
              {days.map((day, i) => (
                <Text key={i} style={[styles.chartLabelText, { left: `${i * (100 / 6)}%` }]}>
                  {day}
                </Text>
              ))}
            </View>
          </View>
        </Card>

        <Card>
          <Label style={styles.sectionTitle}>{t('todayRecLabel')}</Label>
          <Text style={styles.recommendationText}>{t('todayRecValue')}</Text>
        </Card>

        <TouchableOpacity 
          style={styles.primaryButton} 
          activeOpacity={0.9}
          onPress={() => logRecover.mutate({ sleepHours: sleep.h + sleep.m/60, hrv, restingHr: rhr })}
        >
          <Text style={styles.primaryButtonText}>{t('updateState')}</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 28 },
  header: { marginBottom: 24 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: COLORS.border, borderRadius: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { color: COLORS.textPrimary, fontFamily: 'Inter_600SemiBold', fontSize: 10, textTransform: 'uppercase' },
  explanationCard: { backgroundColor: COLORS.card, padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24 },
  explanationText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary, lineHeight: 22 },
  checkinBtn: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  checkinBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: COLORS.textPrimary },
  sectionTitle: { marginBottom: 20 },
  bioRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bioLabel: { flex: 1, paddingRight: 16 },
  bioValue: { fontFamily: 'Inter_600SemiBold', flexShrink: 0 },
  chartContainer: { width: '100%', paddingHorizontal: 10 },
  trendGraph: { height: 100, justifyContent: 'center', position: 'relative', width: '100%' },
  trendPoint: { width: 6, height: 6, backgroundColor: COLORS.textSecondary, borderRadius: 3, position: 'absolute' },
  trendPointToday: { width: 8, height: 8, backgroundColor: COLORS.accent, borderRadius: 4, position: 'absolute', shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 2 },
  chartLabels: { height: 20, marginTop: 12, position: 'relative', width: '100%' },
  chartLabelText: { position: 'absolute', width: 30, marginLeft: -15, textAlign: 'center', fontFamily: 'Inter_500Medium', fontSize: 10, color: COLORS.textSecondary },
  recommendationText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary, lineHeight: 22 },
  primaryButton: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14, marginTop: 8 },
  primaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 }
});

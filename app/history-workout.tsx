import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Activity } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function WorkoutHistoryScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const MOCK_HISTORY = [
    { id: '1', date: t('todayLabel'), type: t('pushDay1'), duration: `55 ${t('min')}`, volume: `18 ${t('sets')}`, intensity: 'RPE 8' },
    { id: '2', date: t('oct24'), type: t('pullDay1'), duration: `60 ${t('min')}`, volume: `20 ${t('sets')}`, intensity: 'RPE 7.5' },
    { id: '3', date: t('oct22'), type: t('legsDay1'), duration: `65 ${t('min')}`, volume: `22 ${t('sets')}`, intensity: 'RPE 8.5' },
    { id: '4', date: t('oct20'), type: t('pushDay2'), duration: `50 ${t('min')}`, volume: `16 ${t('sets')}`, intensity: 'RPE 7' },
  ];

  const renderTrendChart = (data: number[], color: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 300;
    const height = 60;
    const stepX = width / (data.length - 1);
    
    const points = data.map((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <Svg width="100%" height={60} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <Path d={`M ${points}`} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        {data.map((val, i) => {
          const x = i * stepX;
          const y = height - ((val - min) / range) * height;
          return <Circle key={i} cx={x} cy={y} r="4" fill={color} />;
        })}
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color={COLORS.textDarkPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>{t('workoutHistory')}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        
        {/* Simple Progress Trend */}
        <View style={styles.trendCard}>
          <Text style={styles.trendTitle}>{t('volumeTrend')}</Text>
          <View style={styles.chartWrapper}>
            {renderTrendChart([16, 22, 20, 18], COLORS.accent)}
          </View>
        </View>

        {MOCK_HISTORY.map(session => (
          <View key={session.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <Activity size={16} color={COLORS.accent} />
                <Text style={styles.sessionType}>{session.type}</Text>
              </View>
              <Text style={styles.sessionDate}>{session.date}</Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>{t('duration')}</Text>
                <Text style={styles.statValue}>{session.duration}</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>{t('volume')}</Text>
                <Text style={styles.statValue}>{session.volume}</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>{t('intensity')}</Text>
                <Text style={styles.statValue}>{session.intensity}</Text>
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
  trendCard: { backgroundColor: '#1A1B1E', borderWidth: 1, borderColor: COLORS.darkBorder, borderRadius: SIZES.radius, padding: 20, marginBottom: 8 },
  trendTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textDarkSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  chartWrapper: { height: 60, width: '100%', paddingHorizontal: 8 },
  historyCard: { backgroundColor: '#1A1B1E', borderWidth: 1, borderColor: COLORS.darkBorder, borderRadius: SIZES.radius, padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sessionType: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textDarkPrimary },
  sessionDate: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textDarkSecondary },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBlock: { gap: 4 },
  statLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textDarkSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textDarkPrimary }
});

import React from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS, SIZES } from '../../constants/theme';
import { MetricMedium, Label, Body, Micro } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Divider } from '../../components/Divider';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Scale, Trophy, Lock, History } from 'lucide-react-native';
import { useSubscription } from '../../context/SubscriptionContext';
import { trackEvent } from '../../utils/analytics';
import { Skeleton } from '../../components/Skeleton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalHeader } from '../../components/GlobalHeader';

const InsightsSkeleton = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={{ paddingTop: Math.max(insets.top + 20, 40), paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Skeleton isDark style={{ width: 80, height: 20 }} />
        </View>
        <Skeleton isDark style={{ width: 120, height: 16, alignSelf: 'center', marginBottom: 36 }} />
        
        {/* Scores Grid */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <Skeleton style={{ flex: 1, height: 80, borderRadius: SIZES.radius }} />
          <Skeleton style={{ flex: 1, height: 80, borderRadius: SIZES.radius }} />
          <Skeleton style={{ flex: 1, height: 80, borderRadius: SIZES.radius }} />
        </View>
        
        {/* Trends */}
        <Skeleton style={{ width: '100%', height: 320, borderRadius: SIZES.radius, marginBottom: 16 }} />
        
        {/* Prediction */}
        <Skeleton style={{ width: '100%', height: 80, borderRadius: SIZES.radius, marginBottom: 24 }} />
        
        {/* Weekly Report */}
        <Skeleton style={{ width: '100%', height: 100, borderRadius: SIZES.radius, marginBottom: 24 }} />
        
        {/* Tools */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <Skeleton style={{ flex: 1, height: 80, borderRadius: SIZES.radius }} />
          <Skeleton style={{ flex: 1, height: 80, borderRadius: SIZES.radius }} />
          <Skeleton style={{ flex: 1, height: 80, borderRadius: SIZES.radius }} />
        </View>
        
        {/* History */}
        <Skeleton style={{ width: '100%', height: 180, borderRadius: SIZES.radius }} />
      </View>
    </View>
  );
};

export default function InsightsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { isPro } = useSubscription();

  const openPaywall = (source: string) => {
    trackEvent('subscription_screen_opened', { source });
    router.push('/subscription');
  };

  const renderLineChart = (data: number[], color: string, highlightLast: boolean = false) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 200;
    const height = 60;
    const stepX = width / (data.length - 1);
    
    const points = data.map((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <Svg width="100%" height={60} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <Path d={`M ${points}`} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        {data.map((val, i) => {
          const x = i * stepX;
          const y = height - ((val - min) / range) * height;
          const isLast = i === data.length - 1;
          const radius = isLast && highlightLast ? "5" : "3";
          const pointColor = isLast && highlightLast ? COLORS.accent : color;
          return <Circle key={i} cx={x} cy={y} r={radius} fill={pointColor} />;
        })}
      </Svg>
    );
  };

  const renderBarChart = (data: number[], color: string) => {
    const max = Math.max(...data);
    const width = 200;
    const height = 60;
    const barWidth = 12;
    const stepX = width / data.length;

    return (
      <Svg width="100%" height={60} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {data.map((val, i) => {
          const x = i * stepX + (stepX - barWidth) / 2;
          const barHeight = (val / max) * height;
          const y = height - barHeight;
          return <Path key={i} d={`M ${x},${y} h ${barWidth} v ${barHeight} h -${barWidth} Z`} fill={i === data.length - 1 ? color : COLORS.border} />;
        })}
      </Svg>
    );
  };

  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  if (isLoading) return <InsightsSkeleton />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      
      <GlobalHeader title={t('perfInsights')} />

      <View style={{ paddingHorizontal: 16 }}>
        {/* 1. Performance Scores */}
        <View style={styles.scoreGrid}>
          <Card style={styles.scoreCard}>
            <Micro>{t('strength')}</Micro>
            <MetricMedium style={styles.scoreValue}>74<Text style={styles.scoreMax}> / 100</Text></MetricMedium>
          </Card>
          <Card style={styles.scoreCard}>
            <Micro>{t('endurance')}</Micro>
            <MetricMedium style={styles.scoreValue}>68<Text style={styles.scoreMax}> / 100</Text></MetricMedium>
          </Card>
          <Card style={styles.scoreCard}>
            <Micro>{t('recovery')}</Micro>
            <MetricMedium style={styles.scoreValue}>71<Text style={styles.scoreMax}> / 100</Text></MetricMedium>
          </Card>
        </View>

        {/* 2 & 3. Progress Dynamics & Prediction */}
        {isPro ? (
          <>
            <Card>
              <Label style={styles.sectionTitle}>{t('progTrends')}</Label>
              
              <View style={styles.trendRow}>
                <Body style={styles.trendLabel}>{t('adaptation')}</Body>
                <View style={styles.chartWrapper}>
                  {renderLineChart([75, 76, 78, 82], COLORS.accent, true)}
                </View>
              </View>
              <Divider />
              
              <View style={styles.trendRow}>
                <Body style={styles.trendLabel}>{t('strength')}</Body>
                <View style={styles.chartWrapper}>
                  {renderBarChart([68, 70, 71, 74], COLORS.textPrimary)}
                </View>
              </View>
              <Divider />

              <View style={styles.trendRow}>
                <Body style={styles.trendLabel}>{t('weight')}</Body>
                <View style={styles.chartWrapper}>
                  {renderLineChart([83.5, 83.2, 82.8, 82.0], COLORS.textPrimary)}
                </View>
              </View>
              <Divider />

              <View style={styles.trendRow}>
                <Body style={styles.trendLabel}>{t('caloriesTrend')}</Body>
                <View style={styles.chartWrapper}>
                  {renderBarChart([2100, 2200, 2150, 2150], COLORS.textPrimary)}
                </View>
              </View>
            </Card>

            <Card style={{ marginBottom: 24 }}>
              <View style={styles.analysisRow}>
                <View>
                  <Micro>{t('platRisk')}</Micro>
                  <Body style={styles.riskValue}>{t('low')}</Body>
                </View>
                <View style={styles.analysisDivider} />
                <View style={styles.projectionBox}>
                  <Micro>{t('projection')}</Micro>
                  <Body style={styles.projectionText}>{t('perfInc2w')}</Body>
                </View>
              </View>
            </Card>
          </>
        ) : (
          <TouchableOpacity style={styles.lockedCard} activeOpacity={0.8} onPress={() => openPaywall('insights_charts')}>
            <Lock size={24} color={COLORS.textSecondary} style={{ marginBottom: 12 }} />
            <Text style={styles.lockedTitle}>{t('lockedCharts')}</Text>
            <Text style={styles.lockedAction}>{t('upgradeForInsights')} →</Text>
          </TouchableOpacity>
        )}

        {/* 4. Weekly Report */}
        <TouchableOpacity 
          style={styles.reportCard} 
          activeOpacity={0.9}
          onPress={() => router.push('/weekly-report')}
        >
          <Text style={styles.reportCardTitle}>{t('weeklyReport')}</Text>
          <Text style={styles.reportCardAction}>{t('viewWeeklyReport')} →</Text>
        </TouchableOpacity>

        {/* 5. Tools Section */}
        <View style={styles.modulesGrid}>
          <TouchableOpacity style={styles.moduleBtn} activeOpacity={0.7} onPress={() => router.push('/exercise-library')}>
            <BookOpen size={20} color={COLORS.textPrimary} />
            <Text style={styles.moduleBtnText}>{t('exerciseLibrary')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moduleBtn} activeOpacity={0.7} onPress={() => router.push('/body-metrics')}>
            <Scale size={20} color={COLORS.textPrimary} />
            <Text style={styles.moduleBtnText}>{t('bodyMetrics')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moduleBtn} activeOpacity={0.7} onPress={() => router.push('/personal-records')}>
            <Trophy size={20} color={COLORS.textPrimary} />
            <Text style={styles.moduleBtnText}>{t('personalRecords')}</Text>
          </TouchableOpacity>
        </View>

        {/* 6. History Section */}
        <Card style={styles.historyCard}>
          <Label style={styles.sectionTitleTight}>{t('history')}</Label>
          <TouchableOpacity style={styles.historyRow} activeOpacity={0.7} onPress={() => router.push('/history-workout')}>
            <History size={16} color={COLORS.textSecondary} />
            <Text style={styles.historyText}>{t('workoutHistory')}</Text>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={styles.historyRow} activeOpacity={0.7} onPress={() => router.push('/history-recovery')}>
            <History size={16} color={COLORS.textSecondary} />
            <Text style={styles.historyText}>{t('recoveryHistory')}</Text>
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={styles.historyRow} activeOpacity={0.7} onPress={() => router.push('/history-nutrition')}>
            <History size={16} color={COLORS.textSecondary} />
            <Text style={styles.historyText}>{t('nutritionHistory')}</Text>
          </TouchableOpacity>
        </Card>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 28 },
  
  scoreGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  scoreCard: { flex: 1, padding: 12, alignItems: 'center' },
  scoreValue: { fontSize: 28, marginTop: 8 },
  scoreMax: { fontSize: 14, color: COLORS.textSecondary, fontFamily: 'Inter_600SemiBold', letterSpacing: 0 },
  
  sectionTitle: { marginBottom: 20 },
  trendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60 },
  trendLabel: { width: 100 },
  chartWrapper: { flex: 1, height: 60, marginLeft: 16 },
  
  analysisRow: { flexDirection: 'row', alignItems: 'center' },
  riskValue: { fontFamily: 'Inter_600SemiBold', marginTop: 4 },
  analysisDivider: { width: 1, height: 40, backgroundColor: COLORS.border, marginHorizontal: 16 },
  projectionBox: { flex: 1 },
  projectionText: { marginTop: 4, fontSize: 14, lineHeight: 20 },
  
  lockedCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 32, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', alignItems: 'center', marginBottom: 24 },
  lockedTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  lockedAction: { fontFamily: 'Inter_700Bold', fontSize: 14, color: COLORS.textPrimary },

  reportCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20, marginBottom: 24, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', borderWidth: 1, borderColor: COLORS.border },
  reportCardTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: COLORS.textPrimary, marginBottom: 12 },
  reportCardAction: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 1 },
  
  modulesGrid: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  moduleBtn: { flex: 1, backgroundColor: COLORS.card, paddingVertical: 16, paddingHorizontal: 8, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', gap: 8 },
  moduleBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textPrimary, textTransform: 'uppercase', textAlign: 'center' },
  
  historyCard: { marginBottom: 0, paddingVertical: 16 },
  sectionTitleTight: { marginBottom: 16 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  historyText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 0.5 },
});

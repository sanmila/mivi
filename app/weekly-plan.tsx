import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldAlert } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { useDailyEngine } from '../hooks/useApi';

const AnimatedNode = ({ isToday, isCompleted }: { isToday: boolean, isCompleted: boolean }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isToday) {
      scale.value = withRepeat(
        withTiming(1.15, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    } else {
      scale.value = 1;
    }
  }, [isToday]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={[
      styles.node,
      isCompleted && styles.nodeCompleted,
      isToday && styles.nodeToday,
      isToday && animatedStyle
    ]} />
  );
};

export default function WeeklyPlanScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { data: engine } = useDailyEngine();

  const MOCK_PLAN = [
    { day: t('mon'), type: t('planStrength'), status: 'completed' },
    { day: t('tue'), type: t('planRestDay'), status: 'completed' },
    { day: t('wed'), type: t('planFullBody'), status: 'today' },
    { day: t('thu'), type: t('planRestDay'), status: 'upcoming' },
    { day: t('fri'), type: t('planStrength'), status: 'upcoming' },
    { day: t('sat'), type: t('planMobility'), status: 'upcoming' },
    { day: t('sun'), type: t('planRestDay'), status: 'upcoming' },
  ];

  const reasonMsg = engine?.weeklyPlanReason ? t(engine.weeklyPlanReason as any) : t('systemAdjusted');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('weeklyPlan')}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        
        <View style={styles.adjustmentBanner}>
          <ShieldAlert size={16} color={COLORS.accent} />
          <Text style={styles.adjustmentText}>{reasonMsg}</Text>
        </View>

        <View style={styles.timeline}>
          {MOCK_PLAN.map((item, index) => {
            const isToday = item.status === 'today';
            const isCompleted = item.status === 'completed';
            
            return (
              <View key={index} style={styles.dayRow}>
                
                <View style={styles.dayLabelCol}>
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{item.day}</Text>
                </View>
                
                <View style={styles.timelineCol}>
                  {index !== MOCK_PLAN.length - 1 && <View style={[styles.line, isCompleted && styles.lineCompleted]} />}
                  <View style={styles.nodeContainer}>
                    <AnimatedNode isToday={isToday} isCompleted={isCompleted} />
                  </View>
                  {isToday && <View style={styles.connectorLine} />}
                </View>
                
                <View style={[styles.dayCard, isToday && styles.dayCardToday]}>
                  <Text style={[styles.dayType, isToday && styles.dayTypeToday]}>{item.type}</Text>
                  {isToday && <Text style={styles.todayBadge}>{t('todayLabel')}</Text>}
                </View>

              </View>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1.5 },
  content: { padding: SIZES.paddingLarge, paddingBottom: 40 },
  adjustmentBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.accent, marginBottom: 32 },
  adjustmentText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textPrimary, flex: 1, lineHeight: 20 },
  timeline: { paddingLeft: 8 },
  
  dayRow: { flexDirection: 'row', marginBottom: 24, zIndex: 1 },
  
  dayLabelCol: { width: 32, alignItems: 'flex-start' },
  dayLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary, marginTop: 19 },
  dayLabelToday: { color: COLORS.accent },
  
  timelineCol: { width: 28, position: 'relative' },
  nodeContainer: { position: 'absolute', top: 20, left: '50%', transform: [{ translateX: -6 }], zIndex: 2 },
  node: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.card, borderWidth: 2, borderColor: COLORS.border },
  nodeCompleted: { backgroundColor: COLORS.textPrimary, borderColor: COLORS.textPrimary },
  nodeToday: { borderColor: COLORS.accent, backgroundColor: COLORS.card },
  
  line: { position: 'absolute', width: 1, backgroundColor: COLORS.border, top: 32, bottom: -44, left: '50%', transform: [{ translateX: -0.5 }], zIndex: 1 },
  lineCompleted: { backgroundColor: COLORS.textPrimary },
  
  connectorLine: { position: 'absolute', left: '50%', width: 22, top: 26, height: 1, backgroundColor: COLORS.accent, zIndex: 0, transform: [{ translateY: -0.5 }] },
  
  dayCard: { flex: 1, marginLeft: 8, backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 16, borderWidth: 1, borderColor: COLORS.border, alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 },
  dayCardToday: { borderColor: COLORS.accent },
  dayType: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: COLORS.textSecondary },
  dayTypeToday: { color: COLORS.textPrimary, fontFamily: 'Inter_700Bold' },
  todayBadge: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }
});

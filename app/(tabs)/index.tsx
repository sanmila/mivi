import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing, withRepeat, useAnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import { Label, Micro, MetricMedium, Body } from '../../components/Typography';
import { Settings, Share, Lock, Utensils, HeartPulse, Lightbulb, User, ChevronRight } from 'lucide-react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useDailyEngine } from '../../hooks/useApi';
import { Skeleton } from '../../components/Skeleton';
import { ErrorState } from '../../components/ErrorState';
import { useSubscription } from '../../context/SubscriptionContext';
import { useDemo } from '../../context/DemoContext';
import { trackEvent } from '../../utils/analytics';
import { GlobalHeader } from '../../components/GlobalHeader';

const { height } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DashboardSkeleton = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={styles.darkPanel}>
        <View style={{ paddingTop: Math.max(insets.top + 20, 40), paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Skeleton isDark style={{ width: 80, height: 20 }} />
          <Skeleton isDark style={{ width: 24, height: 24, borderRadius: 12 }} />
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <Skeleton isDark style={{ width: 120, height: 16, alignSelf: 'center', marginBottom: 36 }} />
          <View style={[styles.gaugeContainer, { height: 200 }]} />
          <Skeleton isDark style={{ width: '100%', height: 100, borderRadius: SIZES.radius, marginBottom: 24 }} />
        </View>
      </View>
      <View style={[styles.lightContent, { paddingHorizontal: 16 }]}>
        <Skeleton style={{ width: '100%', height: 180, borderRadius: SIZES.radius, marginBottom: 16 }} />
        <Skeleton style={{ width: '100%', height: 80, borderRadius: SIZES.radius, marginBottom: 12 }} />
        <Skeleton style={{ width: '100%', height: 80, borderRadius: SIZES.radius }} />
      </View>
    </View>
  );
};

const CalibrationDashboard = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const radius = 100; 
  const strokeWidth = 1.5;
  const center = radius + 20;
  const size = center * 2;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={styles.darkPanel}>
        <GlobalHeader 
          title={t('yourBodyToday')}
          rightNode={
            <TouchableOpacity onPress={() => router.push('/settings')} activeOpacity={0.7} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Settings size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          }
        />

        <View style={{ paddingHorizontal: 16 }}>
          <View style={styles.gaugeContainer}>
            <Svg width={size} height={size}>
              <Circle cx={center} cy={center} r={radius} stroke={COLORS.border} strokeWidth={strokeWidth} strokeDasharray="8 8" fill="none" />
            </Svg>
            <View style={styles.gaugeCenter}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>
                {t('baseMode')}
              </Text>
              <Text style={[styles.readinessLabel, { color: COLORS.textSecondary, textAlign: 'center', marginTop: 4, fontSize: 13 }]}>
                {t('calibNotEnoughData')}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, color: COLORS.textPrimary, marginBottom: 8, textAlign: 'center' }}>
              {t('calibTitle')}
            </Text>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 16 }}>
              {t('calibDesc')}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.lightContent, { paddingHorizontal: 16 }]}>
        <Label style={styles.sectionTitleTight}>{t('whatToDoToday')}</Label>
        
        <TouchableOpacity style={styles.setupCard} activeOpacity={0.8} onPress={() => router.push('/onboarding')}>
          <View style={styles.setupCardLeft}>
            <View style={styles.setupIconBox}>
              <User size={18} color={COLORS.accent} />
            </View>
            <Text style={styles.setupCardText}>{t('calibFillProfile')}</Text>
          </View>
          <ChevronRight size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.setupCard} activeOpacity={0.8} onPress={() => router.push('/recovery-checkin')}>
          <View style={styles.setupCardLeft}>
            <View style={styles.setupIconBox}>
              <HeartPulse size={18} color={COLORS.accent} />
            </View>
            <Text style={styles.setupCardText}>{t('calibAddRecovery')}</Text>
          </View>
          <ChevronRight size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.setupCard} activeOpacity={0.8} onPress={() => router.push('/nutrition')}>
          <View style={styles.setupCardLeft}>
            <View style={styles.setupIconBox}>
              <Utensils size={18} color={COLORS.accent} />
            </View>
            <Text style={styles.setupCardText}>{t('calibSetupNutrition')}</Text>
          </View>
          <ChevronRight size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const BeginnerDashboard = () => {
  const router = useRouter();
  const { t } = useLanguage();
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={styles.darkPanel}>
        <GlobalHeader 
          title={t('yourBodyToday')}
          rightNode={
            <>
              <TouchableOpacity onPress={() => router.push('/share-adaptation')} activeOpacity={0.7} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Share size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/settings')} activeOpacity={0.7} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Settings size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </>
          }
        />

        <View style={{ paddingHorizontal: 16 }}>
          <View style={styles.beginnerReadinessCard}>
            <View style={styles.readinessTitleRow}>
              <View style={styles.readinessDot} />
              <Text style={styles.readinessLabelText}>{t('readinessLabel')}</Text>
            </View>
            <Text style={styles.beginnerReadinessTitle}>{t('readinessGood')}</Text>
            <Text style={styles.beginnerReadinessDesc}>{t('readinessGoodDesc')}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.lightContent, { paddingHorizontal: 16 }]}>
        <Text style={styles.beginnerSectionTitle}>{t('planForToday')}</Text>
        
        <View style={styles.beginnerTrainingCard}>
          <Text style={styles.beginnerActionMain} numberOfLines={1} adjustsFontSizeToFit>{t('lightTraining')}</Text>
          
          <View style={styles.beginnerDetailsContainer}>
            <Text style={styles.beginnerDetailText}>{t('minMovement')}</Text>
            <Text style={styles.beginnerDetailText}>{t('warmup3min')}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            activeOpacity={0.9}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/training');
            }}
          >
            <Text style={styles.primaryButtonText}>{t('begin')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.beginnerSectionTitle}>{t('recoveryLabel')}</Text>

        <View style={styles.beginnerSecondaryCard}>
          <View style={styles.beginnerActionHeader}>
            <HeartPulse size={20} color={COLORS.textSecondary} />
            <Text style={styles.beginnerActionTitleSecondary}>{t('recoveryLabel')}</Text>
          </View>
          <View style={styles.beginnerActionInfo}>
            <Text style={styles.beginnerActionMainSecondary}>{t('sleep7h')}</Text>
            <Text style={styles.beginnerActionSubSecondary}>{t('feelingStable')}</Text>
          </View>
        </View>

        <Text style={styles.beginnerSectionTitle}>{t('fuelLabel')}</Text>

        <View style={styles.beginnerSecondaryCard}>
          <View style={styles.beginnerActionHeader}>
            <Utensils size={20} color={COLORS.textSecondary} />
            <Text style={styles.beginnerActionTitleSecondary}>{t('fuelLabel')}</Text>
          </View>
          <View style={styles.beginnerActionInfo}>
            <Text style={styles.beginnerActionMainSecondary}>{t('goal1800')}</Text>
            <Text style={styles.beginnerActionSubSecondary}>{t('protein90')}</Text>
          </View>
        </View>

        <View style={styles.beginnerMotivationCard}>
          <View style={styles.motivationTitleRow}>
            <Lightbulb size={16} color={COLORS.accent} />
            <Text style={styles.beginnerMotivationTitle}>{t('motivationTitle')}</Text>
          </View>
          <Text style={styles.beginnerMotivationDesc}>{t('motivationDesc')}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const IntermediateDashboard = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const { data: engine } = useDailyEngine();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={styles.darkPanel}>
        <GlobalHeader 
          title={t('yourBodyToday')}
          rightNode={
            <>
              <TouchableOpacity onPress={() => router.push('/share-adaptation')} activeOpacity={0.7} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Share size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/settings')} activeOpacity={0.7} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Settings size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </>
          }
        />

        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={styles.gaugeMetric}>72</Text>
            <Text style={[styles.readinessLabel, { marginTop: 8, color: COLORS.textSecondary }]}>{t('adaptGoodDesc')}</Text>
          </View>

          <View style={[styles.whyBlock, { marginBottom: 32 }]}>
            <Text style={styles.whyTitle}>{t('whyToday')}</Text>
            {(engine?.bodyToday.whyBullets || ['reason1', 'reason2', 'reason3']).map((bullet: string, idx: number) => (
              <View key={idx} style={styles.whyRow}>
                <View style={styles.whyBullet} />
                <Text style={styles.whyText}>{t(bullet as any)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.systemPanelContainer}>
            <View style={styles.systemPanelCol}>
              <Text style={styles.systemPanelLabel}>{t('recovery')}</Text>
              <Text style={styles.systemPanelValue}>{t('moderate')}</Text>
            </View>
            <View style={styles.systemPanelSeparator} />
            <View style={styles.systemPanelCol}>
              <Text style={styles.systemPanelLabel}>{t('load')}</Text>
              <Text style={styles.systemPanelValueAccent}>+4</Text>
            </View>
            <View style={styles.systemPanelSeparator} />
            <View style={styles.systemPanelCol}>
              <Text style={styles.systemPanelLabel}>{t('tabFuel')}</Text>
              <Text style={styles.systemPanelValue}>{t('macrosBalanced')}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.lightContent, { paddingHorizontal: 16 }]}>
        <Label style={styles.sectionTitleTight}>{t('planForToday')}</Label>
        
        <View style={styles.actionCardPrimary}>
          <Text style={styles.actionMainPrimary} numberOfLines={1} adjustsFontSizeToFit>{t('strengthTraining')}</Text>
          <Text style={styles.actionSubPrimary}>{t('min45')}</Text>
          <Text style={styles.actionWarmup}>{t('warmup5min')}</Text>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            activeOpacity={0.9}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/training');
            }}
          >
            <Text style={styles.primaryButtonText}>{t('startTraining')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionCardSecondary}>
          <View style={styles.actionHeader}>
            <HeartPulse size={16} color={COLORS.textSecondary} />
            <Text style={styles.actionTitleSecondary}>{t('recoveryLabel')}</Text>
          </View>
          <View style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionMainSecondary}>{t('recModerate')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionCardSecondary}>
          <View style={styles.actionHeader}>
            <Utensils size={16} color={COLORS.textSecondary} />
            <Text style={styles.actionTitleSecondary}>{t('fuelLabel')}</Text>
          </View>
          <View style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionMainSecondary}>{t('nutrStable')}</Text>
            </View>
          </View>
        </View>

        <Label style={styles.sectionTitleTight}>{t('weeklyProgress')}</Label>
        <View style={styles.intermediateProgressCard}>
          <View style={styles.row}>
            <Text style={styles.body}>{t('trainingSplit')}</Text>
            <Text style={styles.value}>Push / Pull / Legs</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.body}>{t('volumeMetrics')}</Text>
            <Text style={styles.value}>48 {t('sets')}</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
};

function AdvancedDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const { isPro } = useSubscription();

  useEffect(() => {
    trackEvent('dashboard_viewed');
  }, []);

  const { data: engine, isLoading, isError, refetch } = useDailyEngine();

  const openPaywall = (source: string) => {
    trackEvent('subscription_screen_opened', { source });
    router.push('/subscription');
  };

  const isAdvanced = engine?.userLevel === 'advanced';

  const startValue = 78;
  const endValue = engine?.bodyToday.adaptationScore ?? 0;
  const [score, setScore] = useState(startValue);
  const progress = useSharedValue(startValue);
  const breatheScale = useSharedValue(1);

  const radius = 100; 
  const strokeWidth = 0.5;
  const center = radius + 20;
  const size = center * 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!isPro || !engine) return;
    
    progress.value = withTiming(endValue, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });

    breatheScale.value = withRepeat(
      withTiming(1.03, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    let startTime = Date.now();
    const duration = 1500;
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const tProgress = Math.min(elapsed / duration, 1);
      const easeT = 1 - Math.pow(1 - tProgress, 3);
      setScore(Math.floor(startValue + easeT * (endValue - startValue)));
      
      if (tProgress >= 1) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [endValue, startValue, isPro, engine]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - (circumference * progress.value) / 100,
    };
  });

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breatheScale.value }]
  }));

  const displayScore = engine ? score : '--';
  const coachMessageKey = isAdvanced ? 'coachAdvanced' : 'coachIntermediate';

  const renderLineChart = (data: number[], color: string, highlightLast: boolean = false) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 200;
    const height = 40;
    const stepX = width / (data.length - 1);
    
    const points = data.map((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <Svg width="100%" height={40} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
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

  if (isLoading) return <DashboardSkeleton />;
  if (isError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', padding: 16 }]}>
        <ErrorState onRetry={refetch} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      
      {/* SECTION 1: BODY TODAY (Hero) */}
      <View style={styles.darkPanel}>
        <GlobalHeader 
          title={t('yourBodyToday')}
          rightNode={
            <>
              <TouchableOpacity onPress={() => router.push('/share-adaptation')} activeOpacity={0.7} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Share size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/settings')} activeOpacity={0.7} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Settings size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </>
          }
        />

        <View style={{ paddingHorizontal: 16 }}>
          {isPro ? (
            <Animated.View style={[styles.gaugeContainer, breatheStyle]}>
              <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                <Defs>
                  <RadialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <Stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.08" />
                    <Stop offset="100%" stopColor={COLORS.accent} stopOpacity="0" />
                  </RadialGradient>
                </Defs>
                <Circle cx={center} cy={center} r={radius + 20} fill="url(#glow)" />
                <Circle cx={center} cy={center} r={radius} stroke={COLORS.border} strokeWidth={strokeWidth} fill="none" />
                {engine && (
                  <AnimatedCircle cx={center} cy={center} r={radius} stroke="#E2E2E2" strokeWidth={1} fill="none" strokeDasharray={circumference} animatedProps={animatedProps} strokeLinecap="round" />
                )}
              </Svg>
              
              <View style={styles.gaugeCenter}>
                <TouchableOpacity onPress={() => router.push('/body-control')} activeOpacity={0.7} style={styles.gaugeCenterTouchable}>
                  <Text style={styles.gaugeMetric}>{displayScore}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.gaugeContainer, breatheStyle]}>
              <Svg width={size} height={size}>
                <Circle cx={center} cy={center} r={radius} stroke={COLORS.border} strokeWidth={strokeWidth} strokeDasharray="4 4" fill="none" />
              </Svg>
              <View style={styles.gaugeCenter}>
                <TouchableOpacity onPress={() => openPaywall('adaptation_gauge')} activeOpacity={0.7} style={styles.gaugeCenterTouchable}>
                  <Lock size={24} color={COLORS.textSecondary} style={{ marginBottom: 8 }} />
                  <Text style={[styles.readinessLabel, { color: COLORS.textSecondary }]}>{t('lockedAdaptation')}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Coach Message */}
          <Text style={styles.coachMessage}>{t(coachMessageKey)}</Text>

          {/* Why Today Looks Like This */}
          {engine?.bodyToday.whyBullets && (
            <View style={[styles.whyBlock, { marginBottom: 32 }]}>
              <Text style={styles.whyTitle}>{t('whyToday')}</Text>
              {engine.bodyToday.whyBullets.map((bullet: string, idx: number) => (
                <View key={idx} style={styles.whyRow}>
                  <View style={styles.whyBullet} />
                  <Text style={styles.whyText}>{t(bullet as any)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Unified System Status Panel */}
          <View style={styles.systemPanelContainer}>
            <View style={styles.systemPanelCol}>
              <Text style={styles.systemPanelLabel}>{t('recovery')}</Text>
              <Text style={styles.systemPanelValue}>{t('moderate')}</Text>
            </View>
            <View style={styles.systemPanelSeparator} />
            <View style={styles.systemPanelCol}>
              <Text style={styles.systemPanelLabel}>{t('load')}</Text>
              <Text style={styles.systemPanelValueAccent}>{engine?.bodyToday.trainingLoad || '+6'}</Text>
            </View>
            <View style={styles.systemPanelSeparator} />
            <View style={styles.systemPanelCol}>
              <Text style={styles.systemPanelLabel}>{t('tabFuel')}</Text>
              <Text style={styles.systemPanelValue}>{t('macrosBalanced')}</Text>
            </View>
          </View>

        </View>
      </View>

      {/* SECTION 2: PLAN FOR TODAY */}
      <View style={[styles.lightContent, { paddingHorizontal: 16 }]}>
        <Label style={styles.sectionTitleTight}>{t('planForToday')}</Label>

        {/* Main Training Card */}
        {isPro ? (
          <View style={styles.actionCardPrimary}>
            <Text style={styles.actionMainPrimary} numberOfLines={1} adjustsFontSizeToFit>
              {engine?.actionToday.training.type ? t(engine.actionToday.training.type as any) : t('noDataYet')}
            </Text>
            
            <View style={styles.intensityBlock}>
              <Text style={styles.intensityLabel}>{t('intensity')}</Text>
              <Text style={styles.intensityValue}>{t(engine?.actionToday.training.intensity as any) || engine?.actionToday.training.intensity}</Text>
            </View>

            <Text style={styles.actionSubPrimary}>
              {t('duration')}: {engine?.actionToday.training.duration} {t('min')}
            </Text>
            <Text style={styles.actionWarmup}>
              {t('warmup')}: {t(engine?.actionToday.training.warmup as any) || engine?.actionToday.training.warmup}
            </Text>
            
            <TouchableOpacity 
              style={styles.primaryButton}
              activeOpacity={0.9}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/training');
              }}
            >
              <Text style={styles.primaryButtonText}>{t('startTraining')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.lockedLightCard} activeOpacity={0.8} onPress={() => openPaywall('planner_card')}>
            <View style={styles.lockedLightHeader}>
              <Lock size={16} color={COLORS.textSecondary} />
              <Text style={styles.lockedLightLabel}>{t('lockedPlanner')}</Text>
            </View>
            <Text style={styles.lockedLightAction}>{t('unlockSystem')} →</Text>
          </TouchableOpacity>
        )}

        {/* Secondary Support Cards */}
        <View style={styles.actionCardSecondary}>
          <View style={styles.actionHeader}>
            <Utensils size={16} color={COLORS.textSecondary} />
            <Text style={styles.actionTitleSecondary}>{t('fuelLabel')}</Text>
          </View>
          <View style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionMainSecondary}>{engine?.actionToday.nutrition.targetKcal} {t('kcal')}</Text>
              <Text style={styles.actionSubSecondary}>{t('nutritionFocus')}: {t(engine?.actionToday.nutrition.focus as any) || engine?.actionToday.nutrition.focus}</Text>
            </View>
            <TouchableOpacity style={styles.quietButton} activeOpacity={0.8} onPress={() => router.push('/nutrition')}>
              <Text style={styles.quietButtonText}>{t('logFood')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionCardSecondary}>
          <View style={styles.actionHeader}>
            <HeartPulse size={16} color={COLORS.textSecondary} />
            <Text style={styles.actionTitleSecondary}>{t('recoveryLabel')}</Text>
          </View>
          <View style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionMainSecondary}>{t('recoveryAction')}</Text>
              <Text style={styles.actionSubSecondary}>{t(engine?.actionToday.recovery.action as any) || engine?.actionToday.recovery.action}</Text>
            </View>
            <TouchableOpacity style={styles.quietButton} activeOpacity={0.8} onPress={() => router.push('/recovery')}>
              <Text style={styles.quietButtonText}>{t('btnLogRec')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Label style={styles.sectionTitleTight}>{t('perfInsights')}</Label>
        
        <View style={styles.scoreGrid}>
          <View style={styles.scoreCard}>
            <Micro>{t('strength')}</Micro>
            <MetricMedium style={styles.scoreValue}>74<Text style={styles.scoreMax}> / 100</Text></MetricMedium>
          </View>
          <View style={styles.scoreCard}>
            <Micro>{t('endurance')}</Micro>
            <MetricMedium style={styles.scoreValue}>68<Text style={styles.scoreMax}> / 100</Text></MetricMedium>
          </View>
        </View>

        <View style={styles.advancedCard}>
          <Label style={styles.sectionTitle}>{t('progTrends')}</Label>
          <View style={styles.trendRow}>
            <Body style={styles.trendLabel}>{t('adaptation')}</Body>
            <View style={styles.chartWrapper}>
              {renderLineChart([75, 76, 78, 82], COLORS.accent, true)}
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.reportCard} 
          activeOpacity={0.9}
          onPress={() => router.push('/weekly-report')}
        >
          <Text style={styles.reportCardTitle}>{t('weeklyReport')}</Text>
          <Text style={styles.reportCardAction}>{t('viewWeeklyReport')} →</Text>
        </TouchableOpacity>

        <View style={styles.advancedCard}>
          <View style={styles.projectionBox}>
            <Micro>{t('projection')}</Micro>
            <Body style={styles.projectionText}>{t('perfInc2w')}</Body>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

export default function DashboardRouter() {
  const { demoLevel, isInCalibration } = useDemo();

  if (isInCalibration) return <CalibrationDashboard />;
  if (demoLevel === 'beginner') return <BeginnerDashboard />;
  if (demoLevel === 'intermediate') return <IntermediateDashboard />;
  if (demoLevel === 'advanced') return <AdvancedDashboard />;
  
  return <CalibrationDashboard />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 28 },
  darkPanel: { backgroundColor: COLORS.darkPanel, paddingBottom: 40 },
  
  gaugeContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 28, position: 'relative' },
  gaugeCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  gaugeCenterTouchable: { alignItems: 'center', justifyContent: 'center' },
  gaugeMetric: { fontFamily: 'Inter_700Bold', fontSize: 100, color: COLORS.textPrimary, letterSpacing: -4, lineHeight: 110 },
  readinessLabel: { color: COLORS.textPrimary, fontFamily: 'Inter_600SemiBold', fontSize: 14, marginTop: -8 },
  
  coachMessage: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary, textAlign: 'center', marginBottom: 24, paddingHorizontal: 16, lineHeight: 22 },

  systemPanelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    marginBottom: 44,
  },
  systemPanelCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  systemPanelSeparator: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  systemPanelLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  systemPanelValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  systemPanelValueAccent: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: COLORS.accent,
  },
  
  whyBlock: { backgroundColor: COLORS.card, padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border },
  whyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  whyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  whyBullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.textSecondary, marginTop: 7 },
  whyText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textPrimary, lineHeight: 20, flex: 1 },

  lightContent: { backgroundColor: COLORS.background, paddingVertical: 16, gap: 16 },
  sectionTitleTight: { fontSize: 11, color: COLORS.textSecondary, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Inter_600SemiBold', marginTop: 8, marginBottom: 4 },
  
  actionCardPrimary: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 24, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  actionMainPrimary: { fontFamily: 'Inter_700Bold', fontSize: 26, color: COLORS.textPrimary, marginBottom: 24, letterSpacing: -1 },
  intensityBlock: { marginBottom: 12 },
  intensityLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  intensityValue: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: COLORS.accent },
  actionSubPrimary: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  actionWarmup: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textSecondary, marginBottom: 30, marginTop: 12 },
  
  primaryButton: { backgroundColor: COLORS.accent, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', width: '100%' },
  primaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 },
  
  actionCardSecondary: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  actionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  actionTitleSecondary: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionInfo: { flex: 1, paddingRight: 16 },
  actionMainSecondary: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textPrimary, marginBottom: 4 },
  actionSubSecondary: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textSecondary },
  quietButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.textSecondary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  quietButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  lockedLightCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', alignItems: 'center', gap: 12 },
  lockedLightHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lockedLightLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  lockedLightAction: { fontFamily: 'Inter_700Bold', fontSize: 14, color: COLORS.textPrimary },

  // --- CALIBRATION DASHBOARD STYLES ---
  setupCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  setupCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  setupIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 84, 44, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupCardText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  // --- BEGINNER DASHBOARD STYLES ---
  beginnerReadinessCard: { backgroundColor: COLORS.card, padding: 20, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  readinessTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  readinessDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#34C759' },
  readinessLabelText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  beginnerReadinessTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.textPrimary, marginBottom: 8, letterSpacing: 0 },
  beginnerReadinessDesc: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  beginnerSectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  beginnerTrainingCard: { backgroundColor: COLORS.card, padding: 20, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  beginnerActionMain: { fontFamily: 'Inter_700Bold', fontSize: 22, color: COLORS.textPrimary, marginBottom: 14 },
  beginnerDetailsContainer: { gap: 8, marginBottom: 20 },
  beginnerDetailText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary },
  beginnerSecondaryCard: { backgroundColor: COLORS.card, padding: 20, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  beginnerActionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  beginnerActionTitleSecondary: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  beginnerActionInfo: { gap: 4 },
  beginnerActionMainSecondary: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: COLORS.textPrimary },
  beginnerActionSubSecondary: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary },
  beginnerMotivationCard: { backgroundColor: COLORS.card, padding: 20, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, marginTop: 8, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  motivationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  beginnerMotivationTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  beginnerMotivationDesc: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary, lineHeight: 22 },

  // --- INTERMEDIATE & ADVANCED ADDITIONS ---
  intermediateProgressCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  advancedCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  scoreGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  scoreCard: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: COLORS.card, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  scoreValue: { fontSize: 28, marginTop: 8 },
  scoreMax: { fontSize: 14, color: COLORS.textSecondary, fontFamily: 'Inter_600SemiBold', letterSpacing: 0 },
  sectionTitle: { marginBottom: 20 },
  trendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 40 },
  trendLabel: { width: 100 },
  chartWrapper: { flex: 1, height: 40, marginLeft: 16 },
  reportCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20, marginBottom: 16, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  reportCardTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: COLORS.textPrimary, marginBottom: 12 },
  reportCardAction: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 1 },
  projectionBox: { flex: 1 },
  projectionText: { marginTop: 4, fontSize: 14, lineHeight: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  body: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary },
  value: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
});

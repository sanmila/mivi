import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../constants/theme';
import { Label } from '../../components/Typography';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, ArrowLeft, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useDailyEngine } from '../../hooks/useApi';
import { Skeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalHeader } from '../../components/GlobalHeader';

const TrainingSkeleton = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={{ paddingTop: Math.max(insets.top + 20, 40), paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Skeleton isDark style={{ width: 80, height: 20 }} />
        </View>
        <Skeleton isDark style={{ width: 120, height: 16, alignSelf: 'center', marginBottom: 36 }} />
        <Skeleton style={{ width: '100%', height: 200, borderRadius: SIZES.radius, marginBottom: 24 }} />
        <Skeleton style={{ width: 100, height: 14, marginBottom: 12 }} />
        <Skeleton style={{ width: '100%', height: 60, borderRadius: SIZES.radius, marginBottom: 24 }} />
        <Skeleton style={{ width: 100, height: 14, marginBottom: 12 }} />
        <Skeleton style={{ width: '100%', height: 160, borderRadius: SIZES.radius }} />
      </View>
    </View>
  );
};

const NextExercisePreview = ({ exercise, easyMode }: any) => {
  const { t } = useLanguage();
  const adjustedSets = easyMode ? Math.max(1, Math.floor(exercise.sets * 0.9)) : exercise.sets;
  return (
    <View style={styles.nextPreviewCard}>
      <Text style={styles.nextLabel}>{t('nextLabel')}</Text>
      <Text style={styles.nextName}>{exercise.name}</Text>
      <Text style={styles.nextReps}>{adjustedSets} × {exercise.reps} {t('reps')}</Text>
    </View>
  );
};

const ActiveExerciseBlock = ({ exercise, onComplete, onOpenTechnique, easyMode, isAdvanced, nextExercise, estRemaining }: any) => {
  const { t } = useLanguage();
  const adjustedSets = easyMode ? Math.max(1, Math.floor(exercise.sets * 0.9)) : exercise.sets;
  const rpeMatch = exercise.rpe.match(/\d+/);
  const adjustedRpe = easyMode && rpeMatch ? `RPE ${Math.max(5, parseInt(rpeMatch[0]) - 1)}` : exercise.rpe;

  const [dynamicSets, setDynamicSets] = useState(adjustedSets);
  const [completedSets, setCompletedSets] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    setDynamicSets(adjustedSets);
    setCompletedSets(0);
    setIsResting(false);
    setTimeLeft(90);
  }, [exercise.id, easyMode]);

  useEffect(() => {
    let interval: any;
    if (isResting && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isResting && timeLeft <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      pulseScale.value = withSequence(withTiming(1.03, { duration: 150 }), withTiming(1, { duration: 150 }));
      setIsResting(false);
      setTimeLeft(0);
    }
    return () => clearInterval(interval);
  }, [isResting, timeLeft]);

  const handleMainAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isResting) {
      setIsResting(false);
      setTimeLeft(0);
    } else {
      if (completedSets < dynamicSets) {
        const newCompleted = completedSets + 1;
        setCompletedSets(newCompleted);
        if (newCompleted === dynamicSets) {
          setIsResting(false);
          setTimeout(() => onComplete(), 600);
        } else {
          setTimeLeft(90);
          setIsResting(true);
        }
      }
    }
  };

  const formatTime = (secs: number) => `0${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;
  const animatedButtonStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }] }));

  const currentSetDisplay = Math.min(completedSets + 1, dynamicSets);

  return (
    <View style={styles.activeCard}>
      <View style={styles.activeHeader}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <View style={{flex: 1, paddingRight: 16}}>
            <Text style={styles.activeName} numberOfLines={1} adjustsFontSizeToFit>{exercise.name}</Text>
            <Text style={styles.estRemainingText}>{t('timeLeftEst').replace('{min}', estRemaining.toString())}</Text>
          </View>
          <Text style={{textAlign: 'right'}}>
            <Text style={styles.activeRepsValue}>{dynamicSets} × {exercise.reps}</Text>
            <Text style={styles.activeRepsLabel}> {t('reps')}</Text>
          </Text>
        </View>
      </View>
      
      <View style={styles.activeDetails}>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>{t('target')}</Text>
          <Text style={styles.detailValue}>{exercise.target}</Text>
        </View>
        {isAdvanced && (
          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>{t('intensity')}</Text>
            <Text style={styles.detailValue}>{adjustedRpe}</Text>
          </View>
        )}
        <TouchableOpacity onPress={onOpenTechnique} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.techniqueLink}>{t('technique')} →</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.setIndicatorsRow}>
        {Array.from({ length: dynamicSets }).map((_, i) => {
          const isCompleted = i < completedSets;
          const isCurrent = i === completedSets;
          return (
            <View key={i} style={[
              styles.setCircle, 
              isCompleted && styles.setCircleCompleted, 
              isCurrent && styles.setCircleCurrent
            ]} />
          );
        })}
      </View>

      {nextExercise && completedSets < dynamicSets && (
        <View style={{ marginBottom: 24 }}>
          <NextExercisePreview exercise={nextExercise} easyMode={easyMode} />
        </View>
      )}

      {isResting && completedSets < dynamicSets && (
        <View style={styles.restTimerContainer}>
          <View style={styles.restTimerHeader}>
            <Text style={styles.restTimerLabel}>{t('restTimer')}</Text>
            <Text style={styles.restTimeText}>{formatTime(timeLeft)}</Text>
          </View>
          <View style={styles.restTimerControls}>
            <TouchableOpacity style={styles.timerBtn} onPress={() => setTimeLeft(p => Math.max(0, p - 15))} activeOpacity={0.7}><Text style={styles.timerBtnText}>−15s</Text></TouchableOpacity>
            <TouchableOpacity style={styles.timerBtn} onPress={() => { setIsResting(false); setTimeLeft(0); }} activeOpacity={0.7}><Text style={styles.timerBtnText}>{t('skipRest')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.timerBtn} onPress={() => setTimeLeft(p => p + 15)} activeOpacity={0.7}><Text style={styles.timerBtnText}>+15s</Text></TouchableOpacity>
          </View>
          <Text style={styles.restTipText}>{t('restTip')}</Text>
        </View>
      )}

      {completedSets < dynamicSets && (
        <Animated.View style={animatedButtonStyle}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressTextLabel}>
              {t('setsCompleted').replace('{current}', currentSetDisplay.toString()).replace('{total}', dynamicSets.toString())}
            </Text>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={handleMainAction} activeOpacity={0.9}>
            <Text style={styles.primaryButtonText}>{isResting ? t('nextSet') : t('logSet')}</Text>
          </TouchableOpacity>
          {!isResting && (
            <Text style={styles.restHintText}>{t('restTimerHint')}</Text>
          )}
        </Animated.View>
      )}
    </View>
  );
};

export default function TrainingScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTechnique, setActiveTechnique] = useState<any>(null);

  const { data: engine, isLoading, isError, refetch } = useDailyEngine();

  const isBeginner = engine?.userLevel === 'beginner';
  const isAdvanced = engine?.userLevel === 'advanced';

  const defaultDuration = engine?.actionToday.training.duration || 45;
  const workoutType = isBeginner ? t('planFullBody') : (engine?.actionToday.training.type ? t(engine.actionToday.training.type as any) : t('pushDay1'));
  const intensity = isBeginner ? t('lightEffort') : (isAdvanced ? 'RPE 8' : t('moderateEffort'));

  const beginnerExercises = [
    { id: 'sq', name: t('squat'), sets: 3, reps: "10", target: t('bodyweight'), rpe: '', cues: [] },
    { id: 'pu', name: t('pushUp'), sets: 3, reps: "8", target: t('bodyweight'), rpe: '', cues: [] },
    { id: 'rw', name: t('row'), sets: 3, reps: "12", target: `10 ${t('kg')}`, rpe: '', cues: [] },
    { id: 'gb', name: t('gluteBridge'), sets: 3, reps: "15", target: t('bodyweight'), rpe: '', cues: [] },
    { id: 'pl', name: t('plank'), sets: 3, reps: `30 ${t('sec')}`, target: t('bodyweight'), rpe: '', cues: [] }
  ];

  const advancedExercises = [
    { id: 'bench', name: t('benchPress'), sets: 4, reps: "8", target: `80 ${t('kg')}`, rpe: `RPE 8`, cues: [t('bpCue1'), t('bpCue2'), t('bpCue3'), t('bpCue4')] },
    { id: 'ohp', name: t('overheadPress'), sets: 3, reps: "10", target: `50 ${t('kg')}`, rpe: `RPE 7`, cues: [t('ohpCue1'), t('ohpCue2'), t('ohpCue3')] },
    { id: 'idp', name: t('inclineDbPress'), sets: 3, reps: "10", target: `24 ${t('kg')}`, rpe: `RPE 8`, cues: [] },
    { id: 'lr', name: t('lateralRaises'), sets: 4, reps: "15", target: `10 ${t('kg')}`, rpe: `RPE 8`, cues: [] },
    { id: 'tp', name: t('tricepPushdown'), sets: 3, reps: "12", target: `25 ${t('kg')}`, rpe: `RPE 8`, cues: [] }
  ];

  const exercises = isBeginner ? beginnerExercises : advancedExercises;

  const handleCompleteExercise = () => setActiveIndex(prev => prev + 1);
  const isSessionComplete = activeIndex >= exercises.length;
  
  const estRemaining = Math.max(1, Math.round((exercises.length - activeIndex) * (defaultDuration / exercises.length)));

  if (isLoading) return <TrainingSkeleton />;
  
  if (isError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', padding: 16 }]}>
        <ErrorState onRetry={refetch} />
      </View>
    );
  }

  if (engine?.actionToday.training.isRestDay) {
    return (
      <View style={[styles.container, { justifyContent: 'center', padding: 16 }]}>
        <EmptyState 
          icon={Calendar}
          title={t('emptyWorkoutTitle')}
          description={t('emptyWorkoutDesc')}
          actionLabel={t('exerciseLibrary')}
          onAction={() => router.push('/exercise-library')}
        />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        
        <GlobalHeader 
          title={t('tabTrain')}
          leftNode={isWorkoutActive ? (
            <TouchableOpacity onPress={() => setIsWorkoutActive(false)} style={styles.backBtn} activeOpacity={0.7}>
              <ArrowLeft size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ) : undefined}
          rightNode={
            <TouchableOpacity style={styles.planBtn} onPress={() => router.push('/weekly-plan')} activeOpacity={0.8}>
              <Calendar size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          }
        />

        <View style={{ paddingHorizontal: 16 }}>
          {!isWorkoutActive ? (
            // OVERVIEW STATE
            <View>
              <View style={styles.recCard}>
                <Text style={styles.recTitle}>{workoutType}</Text>
                
                <View style={styles.recDetailsRow}>
                  <View style={styles.recDetailItem}>
                    <Text style={styles.recDetailLabel}>{t('intensity')}</Text>
                    <Text style={styles.recDetailValue}>{intensity}</Text>
                  </View>
                  <View style={styles.recDetailItem}>
                    <Text style={styles.recDetailLabel}>{t('duration')}</Text>
                    <Text style={styles.recDetailValue}>{defaultDuration} {t('min')}</Text>
                  </View>
                </View>

                <View style={styles.durationBlock}>
                  <Text style={styles.durationLabel}>{t('durationStructure')}</Text>
                  <View style={styles.durationBarRow}>
                     <View style={[styles.durationSegment, { flex: 1, backgroundColor: COLORS.textSecondary }]} />
                     <View style={[styles.durationSegment, { flex: 6, backgroundColor: COLORS.accent }]} />
                     <View style={[styles.durationSegment, { flex: 1, backgroundColor: COLORS.textSecondary }]} />
                  </View>
                  <View style={styles.durationTextRow}>
                     <Text style={styles.durationMicro}>{t('warmup')} 5'</Text>
                     <Text style={styles.durationMicro}>{t('mainWorkout')} {defaultDuration - 10}'</Text>
                     <Text style={styles.durationMicro}>{t('cooldownSection')} 5'</Text>
                  </View>
                </View>

                <View style={styles.recReasonBox}>
                  <Text style={styles.recReasonLabel}>{t('reasonLabel')}</Text>
                  <Text style={styles.recReasonText}>{t('recReason')}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.primaryButton}
                  activeOpacity={0.9}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setIsWorkoutActive(true);
                  }}
                >
                  <Text style={styles.primaryButtonText}>{t('startTraining')}</Text>
                </TouchableOpacity>
              </View>

              <Label style={styles.sectionTitleTight}>{t('warmupSection')}</Label>
              <View style={styles.simpleCard}>
                <Text style={styles.simpleCardText}>{t('warmupDesc')}</Text>
              </View>

              <Label style={styles.sectionTitleTight}>{t('workoutPlan')}</Label>
              <View style={styles.planCard}>
                {exercises.map((ex, i) => (
                  <React.Fragment key={ex.id}>
                    <TouchableOpacity 
                      style={styles.planRow} 
                      activeOpacity={0.7}
                      onPress={() => router.push({ pathname: '/exercise-technique', params: { name: ex.name } })}
                    >
                      <View>
                        <Text style={styles.planExName}>{ex.name}</Text>
                        <Text style={styles.planExDetails}>{ex.sets} × {ex.reps}</Text>
                      </View>
                      <ChevronRight size={16} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                    {i < exercises.length - 1 && <View style={styles.divider} />}
                  </React.Fragment>
                ))}
              </View>

              <Label style={styles.sectionTitleTight}>{t('cooldownSection')}</Label>
              <View style={styles.simpleCard}>
                <Text style={styles.simpleCardText}>{t('cooldownDesc')}</Text>
              </View>

              <Label style={styles.sectionTitleTight}>{t('alternativeSession')}</Label>
              <View style={styles.altCard}>
                <View style={styles.altInfo}>
                  <Text style={styles.altTitle}>{t('mobility')}</Text>
                  <Text style={styles.altDesc}>{t('altSessionDesc')}</Text>
                </View>
                <TouchableOpacity style={styles.altBtn} activeOpacity={0.7}>
                  <Text style={styles.altBtnText}>{t('selectAlt')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // ACTIVE WORKOUT STATE
            <View>
              {!isSessionComplete ? (
                <ActiveExerciseBlock 
                  key={exercises[activeIndex].id} 
                  exercise={exercises[activeIndex]} 
                  onComplete={handleCompleteExercise} 
                  onOpenTechnique={() => setActiveTechnique(exercises[activeIndex])} 
                  easyMode={false} 
                  isAdvanced={isAdvanced} 
                  nextExercise={activeIndex + 1 < exercises.length ? exercises[activeIndex + 1] : null}
                  estRemaining={estRemaining}
                />
              ) : (
                <View style={styles.completionState}>
                  <Text style={styles.completionMessage}>{t('sessionCompleteMsg')}</Text>
                  <TouchableOpacity 
                    style={styles.primaryButton} 
                    activeOpacity={0.9}
                    onPress={() => router.push('/session-summary')}
                  >
                    <Text style={styles.primaryButtonText}>{t('completeSession')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

      </ScrollView>

      <Modal visible={!!activeTechnique} transparent animationType="slide" onRequestClose={() => setActiveTechnique(null)}>
        <TouchableOpacity style={styles.techniqueOverlay} activeOpacity={1} onPress={() => setActiveTechnique(null)}>
          <TouchableOpacity style={styles.techniqueContent} activeOpacity={1}>
            <View style={styles.modalDragIndicator} />
            <Text style={styles.modalTitle}>{activeTechnique?.name}</Text>
            <View style={styles.cuesList}>
              {activeTechnique?.cues?.map((cue: string, i: number) => (
                <View key={i} style={styles.cueRow}><View style={styles.cueBullet} /><Text style={styles.cueText}>{cue}</Text></View>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 40 },
  backBtn: { padding: 4, marginLeft: -4 },
  planBtn: { padding: 4, marginRight: -4 },
  
  // Overview Styles
  recCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 24, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24 },
  recTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.textPrimary, marginBottom: 20, letterSpacing: -0.5 },
  recDetailsRow: { flexDirection: 'row', gap: 24, marginBottom: 24 },
  recDetailItem: { flex: 1 },
  recDetailLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  recDetailValue: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textPrimary },
  
  durationBlock: { marginBottom: 24 },
  durationLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  durationBarRow: { flexDirection: 'row', height: 4, borderRadius: 2, overflow: 'hidden', gap: 2, marginBottom: 8 },
  durationSegment: { height: '100%', borderRadius: 2 },
  durationTextRow: { flexDirection: 'row', justifyContent: 'space-between' },
  durationMicro: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textSecondary },

  recReasonBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 12, marginBottom: 24 },
  recReasonLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  recReasonText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textPrimary, lineHeight: 20 },
  
  sectionTitleTight: { marginBottom: 12, marginTop: 8 },
  simpleCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24 },
  simpleCardText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary },
  
  planCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, padding: 16, marginBottom: 24 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  planExName: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: COLORS.textPrimary, marginBottom: 2 },
  planExDetails: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textSecondary },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  
  altCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 16, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  altInfo: { flex: 1, paddingRight: 16 },
  altTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: COLORS.textPrimary, marginBottom: 4 },
  altDesc: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textSecondary },
  altBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.textSecondary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  altBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Active Workout Styles
  activeCard: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  activeHeader: { marginBottom: 40 },
  activeName: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.textPrimary, marginBottom: 6 },
  estRemainingText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.accent, marginTop: 4 },
  activeRepsValue: { fontFamily: 'Inter_700Bold', fontSize: 18, color: COLORS.textPrimary },
  activeRepsLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary },
  activeDetails: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  detailBlock: { gap: 4 },
  detailLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textPrimary },
  techniqueLink: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  setIndicatorsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  setCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.textSecondary },
  setCircleCompleted: { backgroundColor: COLORS.textPrimary, borderColor: COLORS.textPrimary },
  setCircleCurrent: { backgroundColor: COLORS.accent, borderColor: COLORS.accent, transform: [{ scale: 1.25 }] },
  progressTextRow: { marginBottom: 12, alignItems: 'center' },
  progressTextLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  primaryButton: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14, width: '100%' },
  primaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 },
  restHintText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', marginTop: 12 },
  restTimerContainer: { backgroundColor: COLORS.background, padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24, gap: 16 },
  restTimerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  restTimerLabel: { fontFamily: 'Inter_700Bold', fontSize: 14, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  restTimeText: { fontFamily: 'Inter_700Bold', fontSize: 28, color: COLORS.textPrimary, letterSpacing: -1 },
  restTimerControls: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  timerBtn: { flex: 1, paddingVertical: 10, backgroundColor: COLORS.card, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  timerBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary },
  restTipText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 },
  nextPreviewCard: { backgroundColor: 'transparent', borderRadius: SIZES.radius, padding: 16, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', opacity: 0.6 },
  nextLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  nextName: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: COLORS.textSecondary, marginBottom: 2 },
  nextReps: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textSecondary },
  completionState: { marginTop: 40, alignItems: 'center', gap: 24 },
  completionMessage: { fontFamily: 'Inter_500Medium', fontSize: 16, color: COLORS.textSecondary },
  
  // Modal Styles
  techniqueOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'flex-end' },
  techniqueContent: { backgroundColor: COLORS.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48, minHeight: 300, borderWidth: 1, borderColor: COLORS.border },
  modalDragIndicator: { width: 36, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 24 },
  modalTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: COLORS.textPrimary, marginBottom: 24 },
  cuesList: { gap: 12 },
  cueRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  cueBullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.accent, marginTop: 8 },
  cueText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary, lineHeight: 20, flex: 1 }
});

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { trackEvent } from '../utils/analytics';
import { useDemo, ExperienceLevel } from '../context/DemoContext';

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { setExperienceLevel } = useDemo();
  
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, string[]>>({});
  const [metrics, setMetrics] = useState({ age: '', gender: '', height: '', weight: '' });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    trackEvent('onboarding_started');
  }, []);

  const STEPS = [
    { title: t('objTitle'), sub: t('objSub'), options: [t('fatRed'), t('muscGain'), t('perf'), t('genFit')] },
    { title: t('expTitle'), sub: t('expSub'), options: [t('beg'), t('int'), t('adv')] },
    { title: t('limTitle'), sub: t('limSub'), options: [t('knee'), t('lowBack'), t('shoulder'), t('asthma'), t('none')], multi: true },
    { title: t('equipTitle'), sub: t('equipSub'), options: [t('fullGym'), t('homeGym'), t('bodyweight')] },
    { title: t('metricsTitle'), sub: t('metricsSub'), type: 'metrics', options: [] },
    { title: t('commitTitle'), sub: t('commitSub'), options: [t('days1'), t('days2'), t('days3'), t('days4'), t('days5'), t('days6')] },
    { title: t('nutrTitle'), sub: t('nutrSub'), options: [t('nutrOpt1'), t('nutrOpt2'), t('nutrOpt3')] }
  ];

  const handleSelect = (option: string) => {
    if (isTransitioning) return;

    const current = STEPS[step];
    if (current.multi) {
      const currentSelections = selections[step] || [];
      if (option === t('none')) {
        const isAlreadySelected = currentSelections.includes(option);
        setSelections({ ...selections, [step]: isAlreadySelected ? [] : [option] });
      } else {
        const newSelections = currentSelections.includes(option)
          ? currentSelections.filter(i => i !== option)
          : [...currentSelections.filter(i => i !== t('none')), option];
        setSelections({ ...selections, [step]: newSelections });
      }
    } else {
      setSelections({ ...selections, [step]: [option] });
      setIsTransitioning(true);
      setTimeout(() => {
        handleNext();
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      trackEvent('onboarding_completed');
      handleFinish();
    }
  };

  const handleFinish = () => {
    const expSelection = selections[1]?.[0];
    let level: ExperienceLevel = 'advanced';
    if (expSelection === t('beg')) level = 'beginner';
    else if (expSelection === t('int')) level = 'intermediate';
    else if (expSelection === t('adv')) level = 'advanced';

    setExperienceLevel(level);
    router.replace('/analysis');
  };

  const isMetricsValid = () => {
    if (!metrics.gender) return false;
    const age = parseInt(metrics.age, 10);
    const height = parseInt(metrics.height, 10);
    const weight = parseFloat(metrics.weight);
    if (!metrics.age || isNaN(age) || age < 12 || age > 90) return false;
    if (!metrics.height || isNaN(height) || height < 120 || height > 220) return false;
    if (!metrics.weight || isNaN(weight) || weight < 35 || weight > 250) return false;
    return true;
  };

  const currentStep = STEPS[step];
  const currentSelections = selections[step] || [];
  const showFooter = currentStep.multi || currentStep.type === 'metrics';
  const isNextDisabled = currentStep.type === 'metrics' ? !isMetricsValid() : currentSelections.length === 0;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.progressHeader, { paddingTop: Math.max(insets.top + 20, 60) }]}>
        <Text style={styles.globalSub}>{t('onboardingGlobalSub')}</Text>
        <Text style={styles.progressText}>{t('phaseLabel')} 0{step + 1} / 0{STEPS.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.stepSub}>{currentStep.sub}</Text>

        {currentStep.type === 'metrics' ? (
          <View style={styles.metricsForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('gender')}</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity style={[styles.genderBtn, metrics.gender === 'male' && styles.genderBtnActive]} onPress={() => setMetrics({...metrics, gender: 'male'})} activeOpacity={0.8}>
                  <Text style={[styles.genderBtnText, metrics.gender === 'male' && styles.genderBtnTextActive]}>{t('male')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.genderBtn, metrics.gender === 'female' && styles.genderBtnActive]} onPress={() => setMetrics({...metrics, gender: 'female'})} activeOpacity={0.8}>
                  <Text style={[styles.genderBtnText, metrics.gender === 'female' && styles.genderBtnTextActive]}>{t('female')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('age')}</Text>
              <View style={styles.inputContainer}>
                <TextInput style={styles.inputInner} keyboardType="numeric" value={metrics.age} onChangeText={(val) => setMetrics({...metrics, age: val})} placeholder="25" placeholderTextColor={COLORS.textSecondary} maxLength={2} />
                <Text style={styles.inputUnit}>{t('years')}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('height')}</Text>
              <View style={styles.inputContainer}>
                <TextInput style={styles.inputInner} keyboardType="numeric" value={metrics.height} onChangeText={(val) => setMetrics({...metrics, height: val})} placeholder="180" placeholderTextColor={COLORS.textSecondary} maxLength={3} />
                <Text style={styles.inputUnit}>{t('cm')}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('weightStr')}</Text>
              <View style={styles.inputContainer}>
                <TextInput style={styles.inputInner} keyboardType="numeric" value={metrics.weight} onChangeText={(val) => setMetrics({...metrics, weight: val})} placeholder="80" placeholderTextColor={COLORS.textSecondary} maxLength={5} />
                <Text style={styles.inputUnit}>{t('kg')}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.optionsGrid}>
            {currentStep.options.map((option) => {
              const isSelected = currentSelections.includes(option);
              return (
                <TouchableOpacity key={option} style={[styles.optionCard, isSelected && styles.optionCardSelected]} activeOpacity={0.9} onPress={() => handleSelect(option)}>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {showFooter && (
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, isNextDisabled && styles.buttonDisabled]} onPress={handleNext} disabled={isNextDisabled}>
            <Text style={styles.buttonText}>{currentStep.type === 'metrics' ? t('continueBtn') : t('confirm')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  progressHeader: { paddingHorizontal: SIZES.paddingLarge, paddingBottom: 24 },
  globalSub: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textSecondary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  progressText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textSecondary, letterSpacing: 1, marginBottom: 12 },
  progressBar: { height: 2, backgroundColor: COLORS.border, width: '100%' },
  progressFill: { height: '100%', backgroundColor: COLORS.accent },
  content: { padding: SIZES.paddingLarge, paddingTop: 24 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: -0.5, marginBottom: 8 },
  stepSub: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary, marginBottom: 32, lineHeight: 20 },
  optionsGrid: { gap: 12 },
  optionCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, padding: 20, borderRadius: SIZES.radius },
  optionCardSelected: { borderColor: COLORS.accent, backgroundColor: 'rgba(255, 84, 44, 0.08)' },
  optionText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: COLORS.textPrimary },
  optionTextSelected: { color: COLORS.accent },
  metricsForm: { gap: 20, paddingBottom: 20 },
  inputGroup: { gap: 8 },
  inputLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  genderRow: { flexDirection: 'row', gap: 12 },
  genderBtn: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 16, borderRadius: SIZES.radius, alignItems: 'center' },
  genderBtnActive: { borderColor: COLORS.accent, backgroundColor: 'rgba(255, 84, 44, 0.08)' },
  genderBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: COLORS.textPrimary },
  genderBtnTextActive: { color: COLORS.accent },
  inputContainer: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, paddingHorizontal: 16, height: 54, flexDirection: 'row', alignItems: 'center' },
  inputInner: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 16, color: COLORS.textPrimary, height: '100%' },
  inputUnit: { fontFamily: 'Inter_500Medium', fontSize: 16, color: COLORS.textSecondary, marginLeft: 8 },
  footer: { padding: SIZES.paddingLarge, paddingBottom: 40 },
  button: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 }
});

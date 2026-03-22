import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { Check } from 'lucide-react-native';

export default function AnalysisScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    t('analysisStep1'),
    t('analysisStep2'),
    t('analysisStep3'),
    t('analysisStep4')
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        setTimeout(() => router.replace('/result'), 600);
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('analysisTitle')}</Text>
        <Text style={styles.description}>{t('analysisDesc')}</Text>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            return (
              <View key={index} style={styles.stepRow}>
                <View style={[styles.iconBox, (isActive || isCompleted) && styles.iconBoxActive]}>
                  {isCompleted ? (
                    <Check size={12} color={COLORS.background} strokeWidth={3} />
                  ) : (
                    <View style={[styles.dot, isActive && styles.dotActive]} />
                  )}
                </View>
                <Text style={[styles.stepText, (isActive || isCompleted) && styles.stepTextActive]}>{step}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
    justifyContent: 'center' 
  },
  content: { 
    paddingHorizontal: SIZES.paddingLarge 
  },
  title: { 
    fontFamily: 'Inter_700Bold', 
    fontSize: 28, 
    color: COLORS.textPrimary, 
    marginBottom: 12, 
    letterSpacing: -1 
  },
  description: { 
    fontFamily: 'Inter_500Medium', 
    fontSize: 15, 
    color: COLORS.textSecondary, 
    lineHeight: 22, 
    marginBottom: 48 
  },
  stepsContainer: { 
    gap: 24 
  },
  stepRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16 
  },
  iconBox: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.card 
  },
  iconBoxActive: { 
    borderColor: COLORS.accent, 
    backgroundColor: COLORS.accent 
  },
  dot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: 'transparent' 
  },
  dotActive: { 
    backgroundColor: COLORS.background 
  },
  stepText: { 
    fontFamily: 'Inter_600SemiBold', 
    fontSize: 15, 
    color: COLORS.textSecondary 
  },
  stepTextActive: { 
    color: COLORS.textPrimary 
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../utils/api';

export default function SessionSummaryScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  
  const [rpeScore, setRpeScore] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!rpeScore) return;
    
    setIsSaving(true);
    try {
      // Real API Call
      await apiClient.post('/v2/mivi/train/session', { rpe: rpeScore, duration: 55, volume: 18 });
      
      // Invalidate dashboard data to reflect the completed session
      await queryClient.invalidateQueries({ queryKey: ['engine.daily'] });
      
      showToast(t('save'), t('adaptRecalc'));
      router.replace('/(tabs)');
    } catch (e) {
      showToast(t('error'), t('somethingWentWrong'));
    } finally {
      setIsSaving(false);
    }
  };

  const RpeButton = ({ score, label }: { score: number, label: string }) => (
    <TouchableOpacity 
      style={[styles.rpeBtn, rpeScore === score && styles.rpeBtnActive]}
      onPress={() => setRpeScore(score)}
      activeOpacity={0.8}
      disabled={isSaving}
    >
      <Text style={[styles.rpeBtnText, rpeScore === score && styles.rpeBtnTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        
        <Text style={styles.title}>{t('sessionSummary')}</Text>
        
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('trainVol')}</Text>
            <Text style={styles.value}>18 {t('sets')}</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.label}>{t('estDuration')}</Text>
            <Text style={styles.value}>55 {t('min')}</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.label}>{t('avgIntensity')}</Text>
            <Text style={styles.value}>RPE 8</Text>
          </View>
        </View>

        <View style={styles.surveyBlock}>
          <Text style={styles.surveyTitle}>{t('howDidItFeel')}</Text>
          <View style={styles.rpeGrid}>
            <RpeButton score={1} label={t('veryEasy')} />
            <RpeButton score={2} label={t('good')} />
            <RpeButton score={3} label={t('hard')} />
            <RpeButton score={4} label={t('veryHard')} />
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, (!rpeScore || isSaving) && styles.buttonDisabled]} 
          activeOpacity={0.9}
          onPress={handleSave}
          disabled={!rpeScore || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>{t('saveSession')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: SIZES.paddingLarge,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 40,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 32,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  value: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  surveyBlock: {
    gap: 16,
  },
  surveyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  rpeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rpeBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  rpeBtnActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  rpeBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  rpeBtnTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    padding: SIZES.paddingLarge,
    paddingBottom: 48,
  },
  button: {
    backgroundColor: COLORS.accent,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});

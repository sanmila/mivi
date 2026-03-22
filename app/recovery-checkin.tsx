import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { useLogAction } from '../hooks/useApi';

export default function RecoveryCheckinScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  
  // Real API Mutation
  const logRecover = useLogAction('/v2/mivi/recover/checkin');

  const [scores, setScores] = useState({
    sleep: 3,
    energy: 3,
    soreness: 3,
    stress: 3,
    motivation: 3
  });

  const handleSubmit = () => {
    logRecover.mutate(scores, {
      onSuccess: () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      }
    });
  };

  const ScaleSelector = ({ label, field }: { label: string, field: keyof typeof scores }) => (
    <View style={styles.scaleBlock}>
      <Text style={styles.scaleLabel}>{label}</Text>
      <View style={styles.scaleRow}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity
            key={val}
            style={[styles.scaleBtn, scores[field] === val && styles.scaleBtnActive]}
            onPress={() => setScores({ ...scores, [field]: val })}
            activeOpacity={0.8}
            disabled={logRecover.isPending}
          >
            <Text style={[styles.scaleBtnText, scores[field] === val && styles.scaleBtnTextActive]}>{val}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('dailyCheckin')}</Text>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <ScaleSelector label={t('sleepQuality')} field="sleep" />
        <ScaleSelector label={t('energy')} field="energy" />
        <ScaleSelector label={t('soreness')} field="soreness" />
        <ScaleSelector label={t('stress')} field="stress" />
        <ScaleSelector label={t('motivation')} field="motivation" />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, logRecover.isPending && styles.buttonDisabled]} 
          activeOpacity={0.9} 
          onPress={handleSubmit}
          disabled={logRecover.isPending}
        >
          {logRecover.isPending ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>{t('submitCheckin')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.paddingLarge, paddingTop: 48, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1 },
  content: { padding: SIZES.paddingLarge, gap: 32, paddingBottom: 40 },
  scaleBlock: { gap: 12 },
  scaleLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  scaleBtn: { flex: 1, height: 48, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  scaleBtnActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  scaleBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: COLORS.textSecondary },
  scaleBtnTextActive: { color: '#FFFFFF' },
  footer: { padding: SIZES.paddingLarge, paddingBottom: 40, borderTopWidth: 1, borderTopColor: COLORS.border },
  button: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 }
});

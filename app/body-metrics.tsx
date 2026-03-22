import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Divider } from '../components/Divider';

export default function BodyMetricsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const [weight, setWeight] = useState('82.0');
  const [bodyFat, setBodyFat] = useState('15.5');
  const [waist, setWaist] = useState('84');
  const [chest, setChest] = useState('102');
  const [arms, setArms] = useState('38');

  const MetricInput = ({ label, value, onChange, unit }: any) => (
    <View style={styles.inputRow}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput 
          style={styles.input} 
          value={value} 
          onChangeText={onChange} 
          keyboardType="numeric"
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>{t('bodyMetrics')}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        
        <Card>
          <MetricInput label={t('weightStr')} value={weight} onChange={setWeight} unit={t('kg')} />
          <Divider />
          <MetricInput label={t('bodyFat')} value={bodyFat} onChange={setBodyFat} unit="%" />
        </Card>

        <Card>
          <MetricInput label={t('waist')} value={waist} onChange={setWaist} unit={t('cm')} />
          <Divider />
          <MetricInput label={t('chest')} value={chest} onChange={setChest} unit={t('cm')} />
          <Divider />
          <MetricInput label={t('arms')} value={arms} onChange={setArms} unit={t('cm')} />
        </Card>

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.9} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <Text style={styles.saveBtnText}>{t('save')}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1.5, flex: 1, textAlign: 'center' },
  content: { padding: SIZES.paddingLarge, gap: 16, paddingBottom: 40 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { fontFamily: 'Inter_700Bold', fontSize: 18, color: COLORS.textPrimary, textAlign: 'right', minWidth: 60 },
  unit: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary, width: 24 },
  saveBtn: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14, marginTop: 16 },
  saveBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 }
});

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trophy } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function PersonalRecordsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const MOCK_PRS = [
    { id: '1', name: t('benchPress'), weight: '100 kg', date: '2023-10-15' },
    { id: '2', name: t('squat'), weight: '140 kg', date: '2023-10-12' },
    { id: '3', name: t('deadlift'), weight: '160 kg', date: '2023-10-10' },
    { id: '4', name: t('overheadPress'), weight: '65 kg', date: '2023-10-18' },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>{t('personalRecords')}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {MOCK_PRS.map(pr => (
          <View key={pr.id} style={styles.prCard}>
            <View style={styles.prIconBox}>
              <Trophy size={20} color={COLORS.accent} />
            </View>
            <View style={styles.prInfo}>
              <Text style={styles.prName}>{pr.name}</Text>
              <Text style={styles.prDate}>{t('dateAchieved')}: {pr.date}</Text>
            </View>
            <Text style={styles.prWeight}>{pr.weight}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1.5, flex: 1, textAlign: 'center' },
  content: { padding: SIZES.paddingLarge, gap: 12, paddingBottom: 40 },
  prCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
  prIconBox: { width: 48, height: 48, backgroundColor: COLORS.background, borderRadius: SIZES.radius, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  prInfo: { flex: 1 },
  prName: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textPrimary, marginBottom: 4 },
  prDate: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textSecondary },
  prWeight: { fontFamily: 'Inter_700Bold', fontSize: 20, color: COLORS.textPrimary }
});

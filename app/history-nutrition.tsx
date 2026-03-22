import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Utensils } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function NutritionHistoryScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const MOCK_HISTORY = [
    { id: '1', date: t('todayLabel'), kcal: '2150', protein: `160${t('g')}`, fat: `70${t('g')}`, carbs: `230${t('g')}`, status: t('statusBalanced') },
    { id: '2', date: t('oct24'), kcal: '2200', protein: `165${t('g')}`, fat: `75${t('g')}`, carbs: `210${t('g')}`, status: t('statusBalanced') },
    { id: '3', date: t('oct23'), kcal: '1800', protein: `120${t('g')}`, fat: `60${t('g')}`, carbs: `180${t('g')}`, status: t('statusUnder') },
    { id: '4', date: t('oct22'), kcal: '2100', protein: `155${t('g')}`, fat: `68${t('g')}`, carbs: `220${t('g')}`, status: t('statusBalanced') },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color={COLORS.textDarkPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>{t('nutritionHistory')}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {MOCK_HISTORY.map(day => (
          <View key={day.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <Utensils size={16} color={day.status === t('statusUnder') ? COLORS.accent : COLORS.textDarkPrimary} />
                <Text style={styles.sessionDate}>{day.date}</Text>
              </View>
              <Text style={styles.kcalText}>{day.kcal} {t('kcal')}</Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>{t('protein')}</Text>
                <Text style={styles.statValue}>{day.protein}</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>{t('fat')}</Text>
                <Text style={styles.statValue}>{day.fat}</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statLabel}>{t('carbs')}</Text>
                <Text style={styles.statValue}>{day.carbs}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkPanel },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textDarkPrimary, textTransform: 'uppercase', letterSpacing: 1.5, flex: 1, textAlign: 'center' },
  content: { padding: SIZES.paddingLarge, gap: 16, paddingBottom: 40 },
  historyCard: { backgroundColor: '#1A1B1E', borderWidth: 1, borderColor: COLORS.darkBorder, borderRadius: SIZES.radius, padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sessionDate: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textDarkPrimary },
  kcalText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textDarkPrimary },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBlock: { gap: 4 },
  statLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textDarkSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textDarkPrimary }
});

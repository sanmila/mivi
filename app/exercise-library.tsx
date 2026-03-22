import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Dumbbell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function ExerciseLibraryScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const MOCK_EXERCISES = [
    { id: '1', name: t('benchPress'), category: 'push', muscle: t('chest') },
    { id: '2', name: t('squat'), category: 'legs', muscle: t('quads') },
    { id: '3', name: t('deadlift'), category: 'pull', muscle: t('hamstrings') },
    { id: '4', name: t('overheadPress'), category: 'push', muscle: t('shoulders') },
    { id: '5', name: t('pullUp'), category: 'pull', muscle: t('lats') },
  ];

  const filters = [
    { id: 'all', label: t('allCategories') },
    { id: 'push', label: t('push') },
    { id: 'pull', label: t('pull') },
    { id: 'legs', label: t('legs') },
    { id: 'core', label: t('core') },
  ];

  const filteredData = MOCK_EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || ex.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>{t('exerciseLibrary')}</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color={COLORS.textSecondary} />
          <TextInput 
            style={styles.searchInput} 
            placeholder={t('searchEx')} 
            placeholderTextColor={COLORS.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {filters.map(f => (
            <TouchableOpacity 
              key={f.id} 
              style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
              onPress={() => setFilter(f.id)}
            >
              <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {filteredData.length > 0 ? filteredData.map(ex => (
          <TouchableOpacity 
            key={ex.id} 
            style={styles.exerciseCard} 
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/exercise-technique', params: { id: ex.id, name: ex.name, muscle: ex.muscle } })}
          >
            <View style={styles.exIconBox}>
              <Dumbbell size={20} color={COLORS.textPrimary} />
            </View>
            <View style={styles.exInfo}>
              <Text style={styles.exName}>{ex.name}</Text>
              <Text style={styles.exMuscle}>{t('primaryMuscle')}: {ex.muscle}</Text>
            </View>
          </TouchableOpacity>
        )) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('noDataYet')}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1.5, flex: 1, textAlign: 'center' },
  searchContainer: { padding: SIZES.paddingLarge, paddingBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, paddingHorizontal: 16, gap: 12 },
  searchInput: { flex: 1, height: 48, fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary },
  filtersWrapper: { borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 16 },
  filtersScroll: { paddingHorizontal: SIZES.paddingLarge, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card },
  filterChipActive: { backgroundColor: COLORS.darkPanel, borderColor: COLORS.darkPanel },
  filterText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.textDarkPrimary },
  listContent: { padding: SIZES.paddingLarge, gap: 12, paddingBottom: 40 },
  exerciseCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
  exIconBox: { width: 48, height: 48, backgroundColor: COLORS.background, borderRadius: SIZES.radius, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  exInfo: { flex: 1 },
  exName: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textPrimary, marginBottom: 4 },
  exMuscle: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textSecondary },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary }
});

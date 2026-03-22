import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Plus } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { useLogAction } from '../hooks/useApi';

export default function FoodSearchScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const logFuel = useLogAction('/v2/mivi/fuel/daily');

  const MOCK_RESULTS = [
    { id: '1', name: t('oatmeal'), protein: 13, fat: 6, carbs: 68, kcal: 389 },
    { id: '2', name: t('chickenBreast'), protein: 31, fat: 3.6, carbs: 0, kcal: 165 },
    { id: '3', name: t('buckwheat'), protein: 12.6, fat: 3.3, carbs: 68, kcal: 334 },
    { id: '4', name: t('cottageCheese'), protein: 16, fat: 5, carbs: 3, kcal: 121 },
  ];

  const [search, setSearch] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [portion, setPortion] = useState('100');

  const mealTypes = [
    { id: 'breakfast', label: t('breakfast') },
    { id: 'lunch', label: t('lunch') },
    { id: 'dinner', label: t('dinner') },
    { id: 'snack', label: t('snack') },
  ];

  const filteredResults = search.length > 0 
    ? MOCK_RESULTS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    : MOCK_RESULTS;

  const handleAdd = () => {
    logFuel.mutate({ item: selectedFood.name, amount: parseFloat(portion), meal: mealType });
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const renderDetailView = () => {
    const p = parseFloat(portion) || 0;
    const scaled = {
      kcal: Math.round((selectedFood.kcal * p) / 100),
      protein: ((selectedFood.protein * p) / 100).toFixed(1),
      fat: ((selectedFood.fat * p) / 100).toFixed(1),
      carbs: ((selectedFood.carbs * p) / 100).toFixed(1),
    };

    return (
      <View style={styles.detailContainer}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setSelectedFood(null)} style={styles.backBtn} activeOpacity={0.7}>
            <ArrowLeft size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('logFood')}</Text>
          <View style={{ width: 20 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
          <Text style={styles.foodNameGiant}>{selectedFood.name}</Text>
          <Text style={styles.per100gText}>{t('per100g')}: {selectedFood.kcal} {t('kcal')} • {selectedFood.protein}{t('g')} P</Text>

          <View style={styles.portionBox}>
            <Text style={styles.portionLabel}>{t('portionGrams')}</Text>
            <TextInput 
              style={styles.portionInput} 
              value={portion} 
              onChangeText={setPortion} 
              keyboardType="numeric" 
              maxLength={4} 
              autoFocus
            />
          </View>

          <View style={styles.macrosBox}>
            <View style={styles.macroRow}><Text style={styles.macroLabel}>{t('kcal')}</Text><Text style={styles.macroValue}>{scaled.kcal}</Text></View>
            <View style={styles.divider} />
            <View style={styles.macroRow}><Text style={styles.macroLabel}>{t('protein')}</Text><Text style={styles.macroValue}>{scaled.protein}{t('g')}</Text></View>
            <View style={styles.divider} />
            <View style={styles.macroRow}><Text style={styles.macroLabel}>{t('fat')}</Text><Text style={styles.macroValue}>{scaled.fat}{t('g')}</Text></View>
            <View style={styles.divider} />
            <View style={styles.macroRow}><Text style={styles.macroLabel}>{t('carbs')}</Text><Text style={styles.macroValue}>{scaled.carbs}{t('g')}</Text></View>
          </View>

          <Text style={styles.mealTypeLabel}>{t('mealType')}</Text>
          <View style={styles.mealTypeGrid}>
            {mealTypes.map(m => (
              <TouchableOpacity 
                key={m.id} 
                style={[styles.mealTypeBtn, mealType === m.id && styles.mealTypeBtnActive]}
                onPress={() => setMealType(m.id)}
              >
                <Text style={[styles.mealTypeText, mealType === m.id && styles.mealTypeTextActive]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.9} onPress={handleAdd}>
            <Text style={styles.addButtonText}>{t('addToMeal')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (selectedFood) return renderDetailView();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('searchFood')}</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color={COLORS.textSecondary} />
          <TextInput 
            style={styles.searchInput} 
            placeholder={t('searchFood')} 
            placeholderTextColor={COLORS.textSecondary}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {filteredResults.map(food => (
          <TouchableOpacity 
            key={food.id} 
            style={styles.resultCard} 
            activeOpacity={0.7}
            onPress={() => setSelectedFood(food)}
          >
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{food.name}</Text>
              <Text style={styles.resultMacros}>{food.kcal} {t('kcal')} • {food.protein}{t('g')} P</Text>
            </View>
            <Plus size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  detailContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1.5 },
  searchContainer: { padding: SIZES.paddingLarge, paddingBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, paddingHorizontal: 16, gap: 12 },
  searchInput: { flex: 1, height: 48, fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary },
  listContent: { padding: SIZES.paddingLarge, gap: 12, paddingBottom: 40 },
  resultCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultInfo: { flex: 1 },
  resultName: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textPrimary, marginBottom: 4 },
  resultMacros: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textSecondary },
  
  content: { padding: SIZES.paddingLarge },
  foodNameGiant: { fontFamily: 'Inter_700Bold', fontSize: 32, color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 8 },
  per100gText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary, marginBottom: 32 },
  portionBox: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  portionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1 },
  portionInput: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.textPrimary, textAlign: 'right', width: 100 },
  macrosBox: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 16, marginBottom: 32 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  macroLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary },
  macroValue: { fontFamily: 'Inter_700Bold', fontSize: 14, color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: COLORS.border },
  mealTypeLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  mealTypeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mealTypeBtn: { flex: 1, minWidth: '45%', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  mealTypeBtnActive: { backgroundColor: 'rgba(255, 84, 44, 0.1)', borderColor: COLORS.accent },
  mealTypeText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary },
  mealTypeTextActive: { color: COLORS.accent },
  footer: { padding: SIZES.paddingLarge, paddingBottom: 40 },
  addButton: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  addButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 }
});

import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, TextInput, TouchableOpacity, Modal, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, ScanBarcode, X, Camera, Utensils, Info, Check, Trash2 } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import { COLORS, SIZES } from '../../constants/theme';
import { MetricMedium, Label, Body, Micro } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Divider } from '../../components/Divider';
import { useLanguage } from '../../context/LanguageContext';
import { useLogAction, useSystemSettings, useFuelDaily, useDailyEngine } from '../../hooks/useApi';
import { Skeleton } from '../../components/Skeleton';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalHeader } from '../../components/GlobalHeader';

const NutritionSkeleton = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={{ paddingTop: Math.max(insets.top + 20, 40), paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Skeleton isDark style={{ width: 80, height: 20 }} />
        </View>
        <Skeleton isDark style={{ width: 120, height: 16, alignSelf: 'center', marginBottom: 36 }} />
        <Skeleton style={{ width: 100, height: 16, marginBottom: 8 }} />
        <Skeleton style={{ width: 140, height: 40, marginBottom: 8 }} />
        <Skeleton style={{ width: 100, height: 14, marginBottom: 24 }} />
        <Skeleton style={{ width: '100%', height: 48, borderRadius: SIZES.radius, marginBottom: 24 }} />
        <Skeleton style={{ width: '100%', height: 180, borderRadius: SIZES.radius, marginBottom: 24 }} />
        <Skeleton style={{ width: '100%', height: 200, borderRadius: SIZES.radius }} />
      </View>
    </View>
  );
};

const AnimatedMacroBar = ({ targetWidth, isCompleted, activeColor = COLORS.accent }: { targetWidth: number, isCompleted: boolean, activeColor?: string }) => {
  const width = useSharedValue(0);
  const bgColor = useSharedValue(COLORS.border);

  useEffect(() => {
    width.value = withTiming(targetWidth, { duration: 1000, easing: Easing.out(Easing.cubic) });
    bgColor.value = withTiming(activeColor, { duration: 500 });
  }, [targetWidth, isCompleted, activeColor]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    backgroundColor: bgColor.value,
  }));

  return (
    <View style={styles.macroTrackSharp}>
      <Animated.View style={[styles.macroFillSharp, animatedStyle]} />
    </View>
  );
};

export default function NutritionScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const logFuel = useLogAction('/v2/mivi/fuel/daily');
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const { data: settingsData, isLoading: isSetLoading, isError: isSetError, refetch: refetchSet } = useSystemSettings();
  const { data: todayFuelData, isLoading: isFuelLoading, isError: isFuelError, refetch: refetchFuel } = useFuelDaily(todayStr);
  const { data: engine } = useDailyEngine();

  const targetKcal = settingsData?.caloriesTarget || 2150;
  const targetProtein = settingsData?.proteinTargetG || 160;
  const targetFat = settingsData?.fatTargetG || 70;
  const targetCarbs = settingsData?.carbsTargetG || 230;

  const actualKcal = todayFuelData?.calories || 1560; 
  const actualProtein = todayFuelData?.proteinG || 160;
  const actualFat = todayFuelData?.fatG || 35;
  const actualCarbs = todayFuelData?.carbsG || 138;

  const proteinPct = Math.round((actualProtein / targetProtein) * 100);
  const fatPct = Math.round((actualFat / targetFat) * 100);
  const carbsPct = Math.round((actualCarbs / targetCarbs) * 100);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanState, setScanState] = useState<'scanning' | 'found' | 'not_found'>('scanning');
  const [portion, setPortion] = useState('100');

  const mockProduct = { name: 'Гречка Макфа', protein: 12.6, fat: 3.3, carbs: 68.0, kcal: 334 };
  const currentPortion = parseFloat(portion) || 0;
  const scaledMacros = {
    protein: ((mockProduct.protein * currentPortion) / 100).toFixed(1),
    fat: ((mockProduct.fat * currentPortion) / 100).toFixed(1),
    carbs: ((mockProduct.carbs * currentPortion) / 100).toFixed(1),
    kcal: Math.round((mockProduct.kcal * currentPortion) / 100)
  };

  const openScanner = (forceNotFound = false) => {
    setIsScannerOpen(true);
    setScanState('scanning');
    setPortion('100');
    setTimeout(() => setScanState(forceNotFound ? 'not_found' : 'found'), 1500);
  };

  const handleRetry = () => {
    refetchSet();
    refetchFuel();
  };

  const handleQuickAdd = (item: string, amount: number) => {
    logFuel.mutate({ item, amount, meal: 'snack' });
  };

  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteAction} activeOpacity={0.8}>
      <Trash2 size={18} color="#FFFFFF" />
    </TouchableOpacity>
  );

  if (isSetLoading || isFuelLoading) return <NutritionSkeleton />;
  if (isSetError || isFuelError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', padding: 16 }]}>
        <ErrorState onRetry={handleRetry} />
      </View>
    );
  }

  const guidedMessage = engine?.actionToday.nutrition.guidedMessage ? t(engine.actionToday.nutrition.guidedMessage as any) : t('nutritionGuidedMsg');

  const QUICK_ADD_ITEMS = [
    { id: 'eggs', label: t('qaEggs'), item: 'Яйца', amount: 100 },
    { id: 'chicken', label: t('qaChicken'), item: 'Куриная грудка', amount: 150 },
    { id: 'oats', label: t('qaOatmeal'), item: 'Овсянка', amount: 50 },
    { id: 'rice', label: t('qaRice'), item: 'Рис', amount: 100 },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        
        <GlobalHeader title={t('tabFuel')} />

        <View style={{ paddingHorizontal: 16 }}>
          {/* 1. Daily calorie goal (main focus) */}
          <View style={styles.dailyTargetBlock}>
            <Label numberOfLines={1} adjustsFontSizeToFit>{t('dailyTarget')}</Label>
            <MetricMedium>{actualKcal} / {targetKcal} <Body>{t('kcal')}</Body></MetricMedium>
            <View style={styles.calProgressBar}>
              <AnimatedMacroBar targetWidth={Math.min(100, (actualKcal/targetKcal)*100)} isCompleted={actualKcal >= targetKcal} activeColor={COLORS.textPrimary} />
            </View>
            <Micro style={styles.remaining} numberOfLines={1} adjustsFontSizeToFit>{t('remaining')}: {Math.max(0, targetKcal - actualKcal)} {t('kcal')}</Micro>
          </View>

          {/* 2. Macronutrients section */}
          <Card>
            <Label style={styles.sectionTitle} numberOfLines={1} adjustsFontSizeToFit>{t('macros')}</Label>
            
            <View style={styles.macroBlock}>
              <View style={styles.macroHeader}>
                <Body style={styles.macroLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{t('protein')}</Body>
                <View style={styles.macroValueContainer}>
                  <Body style={styles.macroValueText} numberOfLines={1}>{actualProtein} / {targetProtein} {t('g')} ({proteinPct}%)</Body>
                  {actualProtein >= targetProtein && <Check size={14} color="#34C759" strokeWidth={3} />}
                </View>
              </View>
              <AnimatedMacroBar targetWidth={Math.min(100, proteinPct)} isCompleted={actualProtein >= targetProtein} activeColor="#34C759" />
            </View>
            
            <View style={styles.macroBlock}>
              <View style={styles.macroHeader}>
                <Body style={styles.macroLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{t('fat')}</Body>
                <View style={styles.macroValueContainer}>
                  <Body style={styles.macroValueText} numberOfLines={1}>{actualFat} / {targetFat} {t('g')} ({fatPct}%)</Body>
                  {actualFat >= targetFat && <Check size={14} color="#F59E0B" strokeWidth={3} />}
                </View>
              </View>
              <AnimatedMacroBar targetWidth={Math.min(100, fatPct)} isCompleted={actualFat >= targetFat} activeColor="#F59E0B" />
            </View>
            
            <View style={styles.macroBlock}>
              <View style={styles.macroHeader}>
                <Body style={styles.macroLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{t('carbs')}</Body>
                <View style={styles.macroValueContainer}>
                  <Body style={styles.macroValueText} numberOfLines={1}>{actualCarbs} / {targetCarbs} {t('g')} ({carbsPct}%)</Body>
                  {actualCarbs >= targetCarbs && <Check size={14} color="#3B82F6" strokeWidth={3} />}
                </View>
              </View>
              <AnimatedMacroBar targetWidth={Math.min(100, carbsPct)} isCompleted={actualCarbs >= targetCarbs} activeColor="#3B82F6" />
            </View>
          </Card>

          {/* 3. Food search section */}
          <View style={styles.searchBlock}>
            <TouchableOpacity style={styles.searchContainer} activeOpacity={0.9} onPress={() => router.push('/food-search')}>
              <View style={styles.searchBox}>
                <Search size={16} color={COLORS.textSecondary} />
                <Text style={styles.searchPlaceholder}>{t('searchFood')}</Text>
              </View>
              <TouchableOpacity style={styles.scanButton} activeOpacity={0.8} onPress={() => openScanner(false)} onLongPress={() => openScanner(true)}>
                <ScanBarcode size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickAddWrapper} contentContainerStyle={styles.quickAddScroll}>
              {QUICK_ADD_ITEMS.map(qa => (
                <TouchableOpacity 
                  key={qa.id} 
                  style={styles.quickAddPill} 
                  activeOpacity={0.7}
                  onPress={() => handleQuickAdd(qa.item, qa.amount)}
                >
                  <Text style={styles.quickAddText}>+ {qa.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 4. Food log */}
          {actualKcal === 0 ? (
            <View style={{ marginBottom: 24 }}>
              <EmptyState 
                icon={Utensils}
                title={t('emptyNutritionTitle')}
                description={t('emptyNutritionDesc')}
              />
            </View>
          ) : (
            <Card>
              <Label style={styles.sectionTitle} numberOfLines={1} adjustsFontSizeToFit>{t('foodLog')}</Label>
              
              <Swipeable renderRightActions={renderRightActions}>
                <TouchableOpacity style={styles.logItem} activeOpacity={0.7}>
                  <View style={styles.logItemLeft}>
                    <Body numberOfLines={1} adjustsFontSizeToFit>{t('buckwheat')}</Body>
                    <Micro>100 {t('g')}</Micro>
                  </View>
                  <Body style={styles.kcalValue} numberOfLines={1}>110 {t('kcal')}</Body>
                </TouchableOpacity>
              </Swipeable>
              <Divider />
              
              <Swipeable renderRightActions={renderRightActions}>
                <TouchableOpacity style={styles.logItem} activeOpacity={0.7}>
                  <View style={styles.logItemLeft}>
                    <Body numberOfLines={1} adjustsFontSizeToFit>{t('cottageCheese')}</Body>
                    <Micro>100 {t('g')}</Micro>
                  </View>
                  <Body style={styles.kcalValue} numberOfLines={1}>120 {t('kcal')}</Body>
                </TouchableOpacity>
              </Swipeable>
              <Divider />
              
              <Swipeable renderRightActions={renderRightActions}>
                <TouchableOpacity style={styles.logItem} activeOpacity={0.7}>
                  <View style={styles.logItemLeft}>
                    <Body numberOfLines={1} adjustsFontSizeToFit>{t('borscht')}</Body>
                    <Micro>250 {t('g')}</Micro>
                  </View>
                  <Body style={styles.kcalValue} numberOfLines={1}>150 {t('kcal')}</Body>
                </TouchableOpacity>
              </Swipeable>
            </Card>
          )}

          {/* 5. Adaptive nutrition insight */}
          <View style={styles.guidanceBanner}>
            <Info size={16} color={COLORS.textPrimary} />
            <Text style={styles.guidanceText}>{guidedMessage}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Scanner Modal */}
      <Modal visible={isScannerOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setIsScannerOpen(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('scanBarcodeLabel')}</Text>
            <TouchableOpacity onPress={() => setIsScannerOpen(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><X size={24} color={COLORS.textDarkPrimary} /></TouchableOpacity>
          </View>

          {scanState === 'scanning' && (
            <View style={styles.scanningView}>
              <View style={styles.cameraPlaceholder}><View style={styles.scanLine} /></View>
              <Text style={styles.scanningText}>Scanning...</Text>
            </View>
          )}

          {scanState === 'found' && (
            <ScrollView contentContainerStyle={styles.modalContent} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
              <View style={styles.productHeader}>
                <Text style={styles.productName}>{mockProduct.name}</Text>
                <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>{t('verified')}</Text></View>
              </View>
              <Text style={styles.per100gText}>{t('per100g')}: {mockProduct.kcal} {t('kcal')} • {mockProduct.protein}{t('g')} P • {mockProduct.fat}{t('g')} F • {mockProduct.carbs}{t('g')} C</Text>
              
              <View style={styles.portionInputBox}>
                <Text style={styles.portionLabel}>{t('portionGrams')}</Text>
                <TextInput style={styles.portionInput} value={portion} onChangeText={setPortion} keyboardType="numeric" maxLength={4} />
              </View>

              <View style={styles.scaledMacrosBox}>
                <View style={styles.scaledRow}><Text style={styles.scaledLabel}>{t('kcal')}</Text><Text style={styles.scaledValue}>{scaledMacros.kcal}</Text></View>
                <View style={styles.scaledDivider} />
                <View style={styles.scaledRow}><Text style={styles.scaledLabel}>{t('protein')}</Text><Text style={styles.scaledValue}>{scaledMacros.protein}{t('g')}</Text></View>
                <View style={styles.scaledDivider} />
                <View style={styles.scaledRow}><Text style={styles.scaledLabel}>{t('fat')}</Text><Text style={styles.scaledValue}>{scaledMacros.fat}{t('g')}</Text></View>
              </View>

              <TouchableOpacity 
                style={styles.logButton} 
                onPress={() => {
                  setIsScannerOpen(false);
                  logFuel.mutate({ item: mockProduct.name, amount: currentPortion });
                }} 
                activeOpacity={0.9}
              >
                <Text style={styles.logButtonText}>{t('logFood')}</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {scanState === 'not_found' && (
            <View style={styles.modalContent}>
              <View style={styles.notFoundBox}><Text style={styles.notFoundTitle}>{t('productNotFound')}</Text><View style={styles.userSubmittedBadge}><Text style={styles.userSubmittedText}>{t('userSubmitted')}</Text></View></View>
              <TouchableOpacity style={styles.addPhotoBtn} activeOpacity={0.8}><Camera size={20} color={COLORS.textDarkPrimary} /><Text style={styles.addPhotoText}>{t('addPhoto')}</Text></TouchableOpacity>
              <TouchableOpacity style={styles.manualEntryBtn} activeOpacity={0.8}><Text style={styles.manualEntryText}>{t('manualEntry')}</Text></TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  detailContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1.5 },
  searchContainer: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, paddingHorizontal: 16, gap: 12 },
  searchInput: { flex: 1, height: 48, fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary },
  scanButton: { width: 48, height: 48, backgroundColor: COLORS.card, borderRadius: SIZES.radius, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  quickAddWrapper: { width: '100%' },
  quickAddScroll: { gap: 8, paddingRight: 16 },
  quickAddPill: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  quickAddText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: COLORS.textPrimary },
  listContent: { padding: SIZES.paddingLarge, gap: 12, paddingBottom: 40 },
  resultCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  resultInfo: { flex: 1 },
  resultName: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textPrimary, marginBottom: 4 },
  resultMacros: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textSecondary },
  
  content: { paddingBottom: 28 },
  dailyTargetBlock: { marginBottom: 24 },
  searchBlock: { marginBottom: 24 },
  sectionTitle: { marginBottom: 24 },
  logItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, paddingVertical: 4 },
  logItemLeft: { flex: 1, paddingRight: 16 },
  kcalValue: { fontFamily: 'Inter_600SemiBold', flexShrink: 0, width: 70, textAlign: 'right' },
  deleteAction: { backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', width: 72, height: '100%' },
  macroBlock: { marginBottom: 20 },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  macroLabel: { flex: 1, paddingRight: 12, letterSpacing: 0 },
  macroValueContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6, minWidth: 120 },
  macroValueText: { fontFamily: 'Inter_600SemiBold', textAlign: 'right' },
  macroTrackSharp: { height: 8, backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border, borderRadius: 0, overflow: 'hidden' },
  macroFillSharp: { height: '100%', borderRadius: 0 },
  
  guidanceBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, padding: 16, borderRadius: SIZES.radius, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  guidanceText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textPrimary, flex: 1, lineHeight: 20 },
  calProgressBar: { marginTop: 12, marginBottom: 8 },
  remaining: { color: COLORS.textPrimary, fontFamily: 'Inter_500Medium' },
  
  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: '#0B0F14' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.paddingLarge, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  modalTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textDarkPrimary, textTransform: 'uppercase', letterSpacing: 1 },
  modalContent: { padding: SIZES.paddingLarge },
  scanningView: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.paddingLarge },
  cameraPlaceholder: { width: '100%', height: 200, backgroundColor: '#1A1B1E', borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.darkBorder, justifyContent: 'center', overflow: 'hidden', marginBottom: 24 },
  scanLine: { height: 2, width: '100%', backgroundColor: COLORS.accent, shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 5 },
  scanningText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textDarkSecondary },
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  productName: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.textDarkPrimary, flex: 1, paddingRight: 16 },
  verifiedBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 4 },
  verifiedText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: 0.5 },
  per100gText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textDarkSecondary, marginBottom: 32 },
  portionInputBox: { backgroundColor: '#1A1B1E', borderWidth: 1, borderColor: COLORS.darkBorder, borderRadius: SIZES.radius, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  portionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textDarkPrimary, textTransform: 'uppercase', letterSpacing: 1 },
  portionInput: { fontFamily: 'Inter_700Bold', fontSize: 24, color: COLORS.textDarkPrimary, textAlign: 'right', width: 100 },
  scaledMacrosBox: { backgroundColor: '#1A1B1E', borderWidth: 1, borderColor: COLORS.darkBorder, borderRadius: SIZES.radius, padding: 16, marginBottom: 32 },
  scaledRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  scaledLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textDarkSecondary },
  scaledValue: { fontFamily: 'Inter_700Bold', fontSize: 14, color: COLORS.textDarkPrimary },
  scaledDivider: { height: 1, backgroundColor: COLORS.darkBorder },
  logButton: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  logButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 },
  notFoundBox: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  notFoundTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: COLORS.textDarkPrimary, marginBottom: 12 },
  userSubmittedBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  userSubmittedText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textDarkSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  addPhotoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1B1E', borderWidth: 1, borderColor: COLORS.darkBorder, paddingVertical: 16, borderRadius: SIZES.radius, marginBottom: 16, gap: 12 },
  addPhotoText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textDarkPrimary },
  manualEntryBtn: { paddingVertical: 16, alignItems: 'center' },
  manualEntryText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textDarkSecondary },
  foodNameGiant: { fontFamily: 'Inter_700Bold', fontSize: 32, color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 8 },
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

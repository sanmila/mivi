import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, ArrowLeft, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { Card } from '../components/Card';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useDemo, DemoLevel } from '../context/DemoContext';
import { clearTokens } from '../utils/auth';
import { useProfile } from '../hooks/useApi';

export default function SettingsScreen() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const { subscription } = useSubscription();
  const { demoLevel, setDemoLevel, hasCompletedMinimumSetup } = useDemo();
  const { data: profile } = useProfile();

  const getPlanName = () => {
    if (subscription === 'ELITE') return t('planElite');
    if (subscription === 'PRO') return t('planPro');
    return t('planFree');
  };

  const handleLogout = async () => {
    await clearTokens();
    router.replace('/');
  };

  const handleDemoSwitch = (level: DemoLevel) => {
    if (!hasCompletedMinimumSetup && level !== 'calibration') {
      Alert.alert(t('lockedAdaptation') || 'Locked', t('calibNotEnoughData') || 'Please complete minimum setup first.');
      return;
    }
    setDemoLevel(level);
  };

  const SettingRow = ({ label, value, showChevron = false, isDestructive = false, rightElement, onPress, isSelected = false, compact = false }: any) => (
    <TouchableOpacity 
      style={[styles.row, compact && styles.rowCompact]} 
      activeOpacity={0.7} 
      disabled={!onPress && !showChevron && !isDestructive && !rightElement && !value}
      onPress={onPress}
    >
      <View style={styles.rowLabelContainer}>
        <Text style={[styles.rowLabel, isDestructive && { color: COLORS.accent }, isSelected && styles.rowLabelSelected]} numberOfLines={1}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        {rightElement}
        {showChevron && <ChevronRight size={16} color={COLORS.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>{t('profSys')}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('demoModeTitle')}</Text>
          <Card style={styles.card}>
            <SettingRow 
              label={t('demoCalibration')} 
              rightElement={demoLevel === 'calibration' && <Check size={18} color={COLORS.textPrimary} strokeWidth={2.5} />} 
              onPress={() => handleDemoSwitch('calibration')}
              isSelected={demoLevel === 'calibration'}
              compact
            />
            <View style={styles.divider} />
            <SettingRow 
              label={t('demoBeginner')} 
              rightElement={demoLevel === 'beginner' && <Check size={18} color={COLORS.textPrimary} strokeWidth={2.5} />} 
              onPress={() => handleDemoSwitch('beginner')}
              isSelected={demoLevel === 'beginner'}
              compact
            />
            <View style={styles.divider} />
            <SettingRow 
              label={t('demoIntermediate')} 
              rightElement={demoLevel === 'intermediate' && <Check size={18} color={COLORS.textPrimary} strokeWidth={2.5} />} 
              onPress={() => handleDemoSwitch('intermediate')}
              isSelected={demoLevel === 'intermediate'}
              compact
            />
            <View style={styles.divider} />
            <SettingRow 
              label={t('demoAdvanced')} 
              rightElement={demoLevel === 'advanced' && <Check size={18} color={COLORS.textPrimary} strokeWidth={2.5} />} 
              onPress={() => handleDemoSwitch('advanced')}
              isSelected={demoLevel === 'advanced'}
              compact
            />
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>1. {t('profile')}</Text>
            <Text style={styles.completenessText}>{t('profileCompleteness')} 80%</Text>
          </View>
          <Card style={styles.card}>
            <SettingRow label={t('height')} value={profile?.height ? `${profile.height} ${t('cm')}` : t('noDataYet')} showChevron onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow label={t('weightStr')} value={profile?.weight ? `${profile.weight} ${t('kg')}` : t('noDataYet')} showChevron onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow label={t('age')} value={profile?.age ? `${profile.age}` : t('noDataYet')} showChevron onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow label={t('gender')} value={profile?.gender === 'male' ? t('male') : t('noDataYet')} showChevron onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow label={t('progStyle')} value={profile?.programStyle ? t('styleStrength') : t('noDataYet')} showChevron onPress={() => {}} />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. {t('lang')}</Text>
          <Card style={styles.card}>
            <SettingRow 
              label="Русский" 
              rightElement={language === 'ru' && <Check size={18} color={COLORS.textPrimary} strokeWidth={2.5} />} 
              onPress={() => setLanguage('ru')}
              isSelected={language === 'ru'}
              compact
            />
            <View style={styles.divider} />
            <SettingRow 
              label="Беларуская" 
              rightElement={language === 'be' && <Check size={18} color={COLORS.textPrimary} strokeWidth={2.5} />} 
              onPress={() => setLanguage('be')}
              isSelected={language === 'be'}
              compact
            />
            <View style={styles.divider} />
            <SettingRow 
              label="Қазақша" 
              rightElement={language === 'kk' && <Check size={18} color={COLORS.textPrimary} strokeWidth={2.5} />} 
              onPress={() => setLanguage('kk')}
              isSelected={language === 'kk'}
              compact
            />
            <View style={styles.divider} />
            <SettingRow 
              label="English" 
              rightElement={language === 'en' && <Check size={18} color={COLORS.textPrimary} strokeWidth={2.5} />} 
              onPress={() => setLanguage('en')}
              isSelected={language === 'en'}
              compact
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. {t('sub')}</Text>
          <Card style={styles.card}>
            <SettingRow label={t('curPlan')} value={getPlanName()} />
            <View style={styles.divider} />
            <SettingRow label={t('manSub')} showChevron onPress={() => router.push('/subscription')} />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. {t('integ')}</Text>
          <Card style={styles.card}>
            <SettingRow 
              label="Apple Health" 
              rightElement={<Text style={styles.soonText}>{t('soon')}</Text>} 
            />
            <View style={styles.divider} />
            <SettingRow 
              label="Google Fit" 
              rightElement={<Text style={styles.soonText}>{t('soon')}</Text>} 
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. {t('sys')}</Text>
          <Card style={styles.card}>
            <SettingRow label={t('expData')} showChevron onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow label={t('logout')} isDestructive onPress={handleLogout} />
            <View style={styles.divider} />
            <SettingRow label={t('deleteData')} isDestructive onPress={() => Alert.alert(t('deleteDataPrompt'), t('areYouSure'))} />
          </Card>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1.5, flex: 1, textAlign: 'center' },
  content: { padding: SIZES.paddingLarge, paddingBottom: 40, gap: 28 },
  section: { gap: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginBottom: 4 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 9, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  completenessText: { fontFamily: 'Inter_600SemiBold', fontSize: 9, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 1 },
  card: { padding: 0, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 16 },
  rowCompact: { paddingVertical: 14 },
  rowLabelContainer: { flex: 1, paddingRight: 16 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  rowLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textPrimary },
  rowLabelSelected: { fontFamily: 'Inter_700Bold', color: COLORS.textPrimary },
  rowValue: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textSecondary },
  divider: { height: 1, backgroundColor: COLORS.border, marginLeft: 16 },
  soonText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textSecondary, textTransform: 'uppercase' }
});

import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';

// Import all main screens
import WelcomeScreen from './welcome';
import OnboardingScreen from './onboarding';
import DashboardScreen from './(tabs)/index';
import TrainingScreen from './(tabs)/training';
import RecoveryScreen from './(tabs)/recovery';
import NutritionScreen from './(tabs)/nutrition';
import InsightsScreen from './(tabs)/insights';
import WeeklyPlanScreen from './weekly-plan';
import WeeklyReportScreen from './weekly-report';
import BodyControlScreen from './body-control';
import SubscriptionScreen from './subscription';
import SettingsScreen from './settings';

const ScreenWrapper = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <View style={styles.wrapper}>
    <View style={styles.wrapperHeader}>
      <Text style={styles.wrapperTitle}>{title}</Text>
    </View>
    <View style={styles.screenContainer}>
      {children}
    </View>
  </View>
);

export default function ScreenshotModeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SCREENSHOT MODE</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} bounces={false}>
        <ScreenWrapper title="1. Welcome"><WelcomeScreen /></ScreenWrapper>
        <ScreenWrapper title="2. Onboarding"><OnboardingScreen /></ScreenWrapper>
        <ScreenWrapper title="3. Dashboard (System)"><DashboardScreen /></ScreenWrapper>
        <ScreenWrapper title="4. Training"><TrainingScreen /></ScreenWrapper>
        <ScreenWrapper title="5. Recovery"><RecoveryScreen /></ScreenWrapper>
        <ScreenWrapper title="6. Nutrition"><NutritionScreen /></ScreenWrapper>
        <ScreenWrapper title="7. Insights"><InsightsScreen /></ScreenWrapper>
        <ScreenWrapper title="8. Body Control Panel"><BodyControlScreen /></ScreenWrapper>
        <ScreenWrapper title="9. Weekly Plan"><WeeklyPlanScreen /></ScreenWrapper>
        <ScreenWrapper title="10. Weekly Report"><WeeklyReportScreen /></ScreenWrapper>
        <ScreenWrapper title="11. Subscription (Paywall)"><SubscriptionScreen /></ScreenWrapper>
        <ScreenWrapper title="12. Settings"><SettingsScreen /></ScreenWrapper>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingTop: 60, 
    paddingBottom: 20, 
    paddingHorizontal: SIZES.paddingLarge, 
    backgroundColor: COLORS.darkPanel,
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.border 
  },
  backBtn: { 
    padding: 4, 
    marginLeft: -4 
  },
  headerTitle: { 
    fontFamily: 'Inter_700Bold', 
    fontSize: 12, 
    color: COLORS.accent, 
    textTransform: 'uppercase', 
    letterSpacing: 1.5 
  },
  content: { 
    padding: 20, 
    gap: 40, 
    paddingBottom: 100 
  },
  wrapper: {
    backgroundColor: COLORS.darkPanel,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  wrapperHeader: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  wrapperTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  screenContainer: {
    height: 844, // Standard iPhone height to ensure screens render exactly as they would on a device
    width: '100%',
    backgroundColor: COLORS.background,
    position: 'relative',
  }
});

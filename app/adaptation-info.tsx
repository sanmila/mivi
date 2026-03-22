import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import Svg, { Polygon, Circle } from 'react-native-svg';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function AdaptationInfoScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X size={24} color={COLORS.textDarkPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false}>
        
        <View style={styles.textBlock}>
          <Text style={styles.title}>{t('whatIsAdaptation')}</Text>
          <Text style={styles.description}>{t('adaptDesc1')}</Text>
          <Text style={styles.description}>{t('adaptDesc2')}</Text>
        </View>

        {/* Triangle Diagram */}
        <View style={styles.diagramContainer}>
          <Svg height="160" width="220" viewBox="0 0 220 160">
            <Polygon
              points="110,20 30,130 190,130"
              fill="none"
              stroke={COLORS.textDarkSecondary}
              strokeWidth="1.5"
            />
            <Circle cx="110" cy="20" r="5" fill={COLORS.accent} />
            <Circle cx="30" cy="130" r="5" fill={COLORS.accent} />
            <Circle cx="190" cy="130" r="5" fill={COLORS.accent} />
          </Svg>
          
          <Text style={styles.nodeLabelTop}>{t('pillarTraining')}</Text>
          <Text style={styles.nodeLabelLeft}>{t('pillarNutrition')}</Text>
          <Text style={styles.nodeLabelRight}>{t('pillarRecovery')}</Text>
        </View>

        {/* Pillars Cards */}
        <View style={styles.pillarsList}>
          
          <View style={styles.lightCard}>
            <Text style={styles.cardTitle}>{t('pillarTraining')}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardItem}>• {t('trainVol')}</Text>
              <Text style={styles.cardItem}>• {t('trainInt')}</Text>
              <Text style={styles.cardItem}>• {t('trainProg')}</Text>
            </View>
          </View>

          <View style={styles.lightCard}>
            <Text style={styles.cardTitle}>{t('pillarRecovery')}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardItem}>• {t('recSleep')}</Text>
              <Text style={styles.cardItem}>• {t('recHrv')}</Text>
              <Text style={styles.cardItem}>• {t('recRhr')}</Text>
            </View>
          </View>

          <View style={styles.lightCard}>
            <Text style={styles.cardTitle}>{t('pillarNutrition')}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardItem}>• {t('nutrProtein')}</Text>
              <Text style={styles.cardItem}>• {t('nutrCal')}</Text>
              <Text style={styles.cardItem}>• {t('nutrHydration')}</Text>
            </View>
          </View>

        </View>

        {/* Adaptation Balance */}
        <View style={styles.balanceBlock}>
          <Text style={styles.balanceTitle}>{t('adaptBalance')}</Text>
          <Text style={styles.balanceText}>{t('adaptBalanceDesc1')}</Text>
          <Text style={styles.balanceText}>{t('adaptBalanceDesc2')}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkPanel,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SIZES.paddingLarge,
    paddingTop: 48,
  },
  content: {
    paddingHorizontal: SIZES.paddingLarge,
    paddingBottom: 60,
  },
  textBlock: {
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: COLORS.textDarkPrimary,
    letterSpacing: -1,
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: COLORS.textDarkSecondary,
    lineHeight: 24,
    marginBottom: 8,
  },
  diagramContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    marginBottom: 40,
    position: 'relative',
  },
  nodeLabelTop: {
    position: 'absolute',
    top: 0,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: COLORS.textDarkPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nodeLabelLeft: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: COLORS.textDarkPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nodeLabelRight: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: COLORS.textDarkPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pillarsList: {
    gap: 16,
    marginBottom: 48,
  },
  lightCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  cardContent: {
    gap: 8,
  },
  cardItem: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  balanceBlock: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkBorder,
  },
  balanceTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  balanceText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textDarkPrimary,
    lineHeight: 22,
    marginBottom: 8,
  }
});

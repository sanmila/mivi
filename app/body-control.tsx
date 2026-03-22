import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function BodyControlScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleNavigate = (path: any) => {
    router.navigate(path);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('bodyControlPanel')}</Text>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X size={24} color={COLORS.textDarkPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {/* SVG Network Connections */}
        <Svg style={StyleSheet.absoluteFill}>
          <Line x1="50%" y1="15%" x2="50%" y2="50%" stroke={COLORS.darkBorder} strokeWidth="1.5" />
          <Line x1="25%" y1="82%" x2="50%" y2="50%" stroke={COLORS.darkBorder} strokeWidth="1.5" />
          <Line x1="75%" y1="82%" x2="50%" y2="50%" stroke={COLORS.darkBorder} strokeWidth="1.5" />
          
          {/* Core System Rings */}
          <Circle cx="50%" cy="50%" r="70" stroke={COLORS.darkBorder} strokeWidth="1" strokeDasharray="4 4" fill="none" />
        </Svg>

        {/* Top Node: TRAIN */}
        <View style={[styles.nodeWrapper, { top: '15%', left: 0, right: 0, alignItems: 'center', marginTop: -45 }]}>
          <TouchableOpacity style={styles.nodeCard} activeOpacity={0.8} onPress={() => handleNavigate('/training')}>
            <Text style={styles.nodeTitle}>{t('tabTrain').toUpperCase()}</Text>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel} numberOfLines={1} adjustsFontSizeToFit>{t('load')}</Text>
              <Text style={styles.nodeValue}>+6</Text>
            </View>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel} numberOfLines={1} adjustsFontSizeToFit>{t('volume')}</Text>
              <Text style={styles.nodeValue}>18 {t('sets')}</Text>
            </View>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel} numberOfLines={1} adjustsFontSizeToFit>{t('intensity')}</Text>
              <Text style={styles.nodeValue}>RPE 8</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Center Node: ADAPTATION */}
        <View style={[styles.nodeWrapper, { top: '50%', left: 0, right: 0, alignItems: 'center', marginTop: -55 }]}>
          <View style={styles.centerNode}>
            <Text style={styles.centerLabel}>{t('adaptation')}</Text>
            <Text style={styles.centerValue}>82</Text>
          </View>
        </View>

        {/* Bottom Left Node: RECOVER */}
        <View style={[styles.nodeWrapper, { top: '82%', left: 0, width: '50%', alignItems: 'center', marginTop: -45 }]}>
          <TouchableOpacity style={styles.nodeCard} activeOpacity={0.8} onPress={() => handleNavigate('/recovery')}>
            <Text style={styles.nodeTitle}>{t('tabRecover').toUpperCase()}</Text>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel} numberOfLines={1} adjustsFontSizeToFit>{t('sleep')}</Text>
              <Text style={styles.nodeValue}>6{t('h')} 42{t('m')}</Text>
            </View>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel} numberOfLines={1} adjustsFontSizeToFit>{t('hrv')}</Text>
              <Text style={styles.nodeValue}>58 {t('ms')}</Text>
            </View>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel} numberOfLines={1} adjustsFontSizeToFit>{t('restingHr')}</Text>
              <Text style={styles.nodeValue}>61 {t('bpm')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Right Node: FUEL */}
        <View style={[styles.nodeWrapper, { top: '82%', left: '50%', width: '50%', alignItems: 'center', marginTop: -45 }]}>
          <TouchableOpacity style={styles.nodeCard} activeOpacity={0.8} onPress={() => handleNavigate('/nutrition')}>
            <Text style={styles.nodeTitle}>{t('tabFuel').toUpperCase()}</Text>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel} numberOfLines={1} adjustsFontSizeToFit>{t('nutrCal')}</Text>
              <Text style={styles.nodeValue}>2150</Text>
            </View>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel} numberOfLines={1} adjustsFontSizeToFit>{t('protein')}</Text>
              <Text style={styles.nodeValue}>160{t('g')}</Text>
            </View>
            <View style={styles.nodeRow}>
              <Text style={styles.nodeLabel} numberOfLines={1} adjustsFontSizeToFit>{t('macros')}</Text>
              <Text style={styles.nodeValue}>{t('macrosBalanced')}</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.paddingLarge,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkBorder,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.textDarkSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  nodeWrapper: {
    position: 'absolute',
  },
  nodeCard: {
    backgroundColor: '#1A1B1E',
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    borderRadius: SIZES.radius,
    padding: 12,
    width: '90%',
    maxWidth: 150,
    height: 90,
    justifyContent: 'center',
  },
  nodeTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: COLORS.textDarkPrimary,
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  nodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  nodeLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: COLORS.textDarkSecondary,
    flex: 1,
    paddingRight: 4,
  },
  nodeValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: COLORS.textDarkPrimary,
  },
  centerNode: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.darkPanel,
    borderWidth: 2,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  centerLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: COLORS.textDarkSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: -4,
  },
  centerValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 48,
    color: COLORS.textDarkPrimary,
    letterSpacing: -2,
  }
});

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../constants/theme';
import { X } from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';

export default function RecalibrationScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('weekRecal')}</Text>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <X size={24} color={COLORS.textDarkPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{t('lastWeekSum')}</Text>
          <View style={styles.row}>
            <Text style={styles.body}>{t('completion')}</Text>
            <Text style={styles.value}>92%</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.body}>{t('recovery')}</Text>
            <Text style={styles.value}>{t('stable')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.body}>{t('load')}</Text>
            <Text style={styles.value}>+4%</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>{t('adjBlock')}</Text>
          <View style={styles.comparisonBlock}>
            <View style={styles.compItem}>
              <Text style={styles.micro}>{t('newLoad')}</Text>
              <Text style={styles.metricAccent}>+6%</Text>
            </View>
            <View style={styles.compItem}>
              <Text style={styles.micro}>{t('volume')}</Text>
              <Text style={styles.metricAccent}>+8%</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.maintained}>{t('intMaint')}</Text>
        </View>

        <View style={styles.explanationBox}>
          <Text style={styles.explanationText}>
            {t('sysRecal')}
          </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.paddingLarge,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkBorder,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: COLORS.textDarkPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    padding: SIZES.paddingLarge,
    gap: 16,
  },
  card: {
    backgroundColor: '#1A1B1E',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: COLORS.textDarkSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  body: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textDarkPrimary,
  },
  value: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textDarkPrimary,
  },
  comparisonBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  compItem: {
    flex: 1,
  },
  micro: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textDarkSecondary,
  },
  metricAccent: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: COLORS.accent,
    letterSpacing: -1,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.darkBorder,
    marginVertical: 16,
  },
  maintained: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.textDarkSecondary,
  },
  explanationBox: {
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    borderRadius: SIZES.radius,
    marginTop: 8,
  },
  explanationText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: COLORS.textDarkPrimary,
    lineHeight: 20,
    textAlign: 'center',
  }
});

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Play } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function ExerciseTechniqueScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const name = params.name || t('benchPress');
  const muscle = params.muscle || t('chest');

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 48) }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X size={24} color={COLORS.textDarkPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        
        {/* Premium Video Player Placeholder */}
        <TouchableOpacity style={styles.videoPlaceholder} activeOpacity={0.9}>
          <View style={styles.playBtn}>
            <Play size={24} color={COLORS.darkPanel} fill={COLORS.darkPanel} />
          </View>
          <Text style={styles.watchText}>{t('watchTechnique')}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{name}</Text>
        
        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaLabel}>{t('primaryMuscle')}</Text>
            <Text style={styles.metaValue}>{muscle}</Text>
          </View>
          <View style={styles.metaBadge}>
            <Text style={styles.metaLabel}>{t('movementType')}</Text>
            <Text style={styles.metaValue}>{t('push')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('cues')}</Text>
          <View style={styles.bulletRow}><View style={styles.bulletDot} /><Text style={styles.bulletText}>{t('cue1')}</Text></View>
          <View style={styles.bulletRow}><View style={styles.bulletDot} /><Text style={styles.bulletText}>{t('cue2')}</Text></View>
          <View style={styles.bulletRow}><View style={styles.bulletDot} /><Text style={styles.bulletText}>{t('cue3')}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('commonMistakes')}</Text>
          <View style={styles.bulletRow}><View style={[styles.bulletDot, { backgroundColor: COLORS.accent }]} /><Text style={styles.bulletText}>{t('mistake1')}</Text></View>
          <View style={styles.bulletRow}><View style={[styles.bulletDot, { backgroundColor: COLORS.accent }]} /><Text style={styles.bulletText}>{t('mistake2')}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('tips')}</Text>
          <Text style={styles.tipsText}>{t('tip1')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('alternatives')}</Text>
          <View style={styles.altCard}>
            <Text style={styles.altName}>{t('alt1')}</Text>
          </View>
          <View style={styles.altCard}>
            <Text style={styles.altName}>{t('alt2')}</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <Text style={styles.buttonText}>{t('useInWorkout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkPanel },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: SIZES.paddingLarge },
  content: { paddingHorizontal: SIZES.paddingLarge, paddingBottom: 40 },
  videoPlaceholder: { height: 220, backgroundColor: '#1A1B1E', borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.darkBorder, justifyContent: 'center', alignItems: 'center', marginBottom: 24, gap: 16 },
  playBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.textDarkPrimary, justifyContent: 'center', alignItems: 'center', paddingLeft: 4 },
  watchText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textDarkPrimary, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 28, color: COLORS.textDarkPrimary, marginBottom: 16 },
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  metaBadge: { flex: 1, backgroundColor: '#1A1B1E', padding: 12, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.darkBorder },
  metaLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textDarkSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  metaValue: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textDarkPrimary },
  section: { marginBottom: 32 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textDarkSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  bulletDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.textDarkPrimary, marginTop: 8 },
  bulletText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: COLORS.textDarkPrimary, lineHeight: 22, flex: 1 },
  tipsText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: COLORS.textDarkPrimary, lineHeight: 22 },
  altCard: { backgroundColor: '#1A1B1E', padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.darkBorder, marginBottom: 8 },
  altName: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textDarkPrimary },
  footer: { padding: SIZES.paddingLarge, paddingBottom: 40, borderTopWidth: 1, borderTopColor: COLORS.darkBorder },
  button: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  buttonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 }
});

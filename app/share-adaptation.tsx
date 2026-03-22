import React, { useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../constants/theme';
import { X, Share } from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const LOGO_URL = 'https://images.dualite.app/67a2899f-ad42-4385-b6ae-15305675cef2/asset-8c28501a-01ca-4936-9832-9dd015f13f13.webp';

export default function ShareAdaptationScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const viewRef = useRef(null);

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Supported', 'Image sharing is not supported on the web version.');
      return;
    }

    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X size={24} color={COLORS.textDarkPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        
        <ViewShot ref={viewRef} options={{ format: 'png', quality: 1 }} style={styles.shareCardWrapper}>
          <View style={styles.shareCard}>
            <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
            
            <View style={styles.metricBlock}>
              <Text style={styles.metricLabel}>{t('adaptation')}</Text>
              <Text style={styles.giantMetric}>82</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.microLabel}>{t('trendLabel')}</Text>
                <Text style={styles.accentValue}>{t('plusWeek')}</Text>
              </View>
              <View style={styles.columnRight}>
                <Text style={styles.microLabel}>{t('statusLabel')}</Text>
                <Text style={styles.primaryValue}>{t('optimalLoad')}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.recommendationBlock}>
              <Text style={styles.microLabel}>{t('sysRecLabel')}</Text>
              <Text style={styles.recommendationText}>{t('recIncreaseLoad')}</Text>
            </View>

            <Text style={styles.footerBrand}>{t('bodyPerfSystem')}</Text>
          </View>
        </ViewShot>

      </View>

      <View style={styles.footerAction}>
        <TouchableOpacity 
          style={styles.shareButton} 
          activeOpacity={0.9}
          onPress={handleShare}
        >
          <Share size={18} color={COLORS.darkPanel} />
          <Text style={styles.shareButtonText}>{t('share')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkPanel },
  header: { flexDirection: 'row', justifyContent: 'flex-end', padding: SIZES.paddingLarge, paddingTop: 48 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: SIZES.paddingLarge },
  shareCardWrapper: { backgroundColor: COLORS.darkPanel }, // Prevents transparent background in screenshot
  shareCard: { backgroundColor: '#1A1B1E', borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.darkBorder, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 16 },
  logo: { width: 120, height: 36, alignSelf: 'center', marginBottom: 40 },
  metricBlock: { alignItems: 'center', marginBottom: 24 },
  metricLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textDarkSecondary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: -8 },
  giantMetric: { fontFamily: 'Inter_700Bold', fontSize: 100, color: COLORS.textDarkPrimary, letterSpacing: -5, lineHeight: 110 },
  divider: { height: 1, backgroundColor: COLORS.darkBorder, marginVertical: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1, gap: 4 },
  columnRight: { flex: 1, gap: 4, alignItems: 'flex-end' },
  microLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textDarkSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  accentValue: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.accent },
  primaryValue: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textDarkPrimary },
  recommendationBlock: { gap: 8, marginBottom: 48 },
  recommendationText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: COLORS.textDarkPrimary, lineHeight: 22 },
  footerBrand: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textDarkMuted, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' },
  footerAction: { padding: SIZES.paddingLarge, paddingBottom: 40 },
  shareButton: { backgroundColor: COLORS.textDarkPrimary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18, borderRadius: SIZES.radius, gap: 12 },
  shareButtonText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: COLORS.darkPanel, textTransform: 'uppercase', letterSpacing: 1 }
});

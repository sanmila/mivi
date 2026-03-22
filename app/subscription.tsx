import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Check } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription, SubscriptionLevel } from '../context/SubscriptionContext';
import { trackEvent } from '../utils/analytics';
import { apiClient } from '../utils/api';
import { useToast } from '../context/ToastContext';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { subscription, setSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState<SubscriptionLevel | null>(null);

  const handleUpgrade = async (level: SubscriptionLevel) => {
    trackEvent('subscription_upgrade_clicked', { level });
    setIsProcessing(level);
    
    try {
      // Real API Call
      await apiClient.post('/v2/mivi/subscription/upgrade', { level });
      await setSubscription(level);
      trackEvent('subscription_success', { level });
      
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (e) {
      showToast(t('error'), t('somethingWentWrong'));
    } finally {
      setIsProcessing(null);
    }
  };

  const PlanCard = ({ title, price, features, level, isHighlighted = false }: any) => {
    const isCurrent = subscription === level;
    const isLoading = isProcessing === level;

    return (
      <View style={[styles.planCard, isHighlighted && styles.planCardHighlighted]}>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>{title}</Text>
          {isCurrent && <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>{t('currentBadge')}</Text></View>}
        </View>
        <Text style={styles.planPrice}>{price}</Text>

        <View style={styles.featuresList}>
          {features.map((feat: string, idx: number) => (
            <View key={idx} style={styles.featureRow}>
              <Check size={16} color={isHighlighted ? COLORS.accent : COLORS.textDarkSecondary} strokeWidth={3} />
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}
        </View>

        {!isCurrent && (
          <TouchableOpacity 
            style={[styles.upgradeBtn, isHighlighted ? styles.upgradeBtnPrimary : styles.upgradeBtnSecondary, isProcessing && styles.upgradeBtnDisabled]}
            activeOpacity={0.9}
            onPress={() => handleUpgrade(level)}
            disabled={!!isProcessing}
          >
            {isLoading ? (
              <ActivityIndicator color={isHighlighted ? COLORS.darkPanel : COLORS.textPrimary} size="small" />
            ) : (
              <Text style={[styles.upgradeBtnText, isHighlighted ? styles.upgradeBtnTextPrimary : styles.upgradeBtnTextSecondary]}>
                {level === 'PRO' ? t('upgradeToPro') : t('upgradeToElite')}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X size={24} color={COLORS.textDarkPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} bounces={false} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        
        <View style={styles.heroBlock}>
          <Text style={styles.heroTitle}>{t('miviProTitle')}</Text>
          <Text style={styles.heroSub}>{t('miviProSub')}</Text>
        </View>

        {subscription === 'FREE' && (
          <View style={styles.trialBanner}>
            <Text style={styles.trialText}>{t('startTrial')}</Text>
          </View>
        )}

        <View style={styles.plansContainer}>
          <PlanCard 
            title={t('planPro')} 
            price="$9.99 / mo" 
            level="PRO"
            isHighlighted={true}
            features={[
              t('featPro1'),
              t('featPro2'),
              t('featPro3'),
              t('featPro4')
            ]} 
          />

          <PlanCard 
            title={t('planElite')} 
            price="$19.99 / mo" 
            level="ELITE"
            features={[
              t('featElite1'),
              t('featElite2'),
              t('featElite3')
            ]} 
          />

          <PlanCard 
            title={t('planFree')} 
            price="$0" 
            level="FREE"
            features={[
              t('featFree1'),
              t('featFree2'),
              t('featFree3')
            ]} 
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkPanel },
  header: { flexDirection: 'row', justifyContent: 'flex-end', padding: SIZES.paddingLarge, paddingTop: 48 },
  content: { paddingHorizontal: SIZES.paddingLarge, paddingBottom: 60 },
  heroBlock: { alignItems: 'center', marginBottom: 32 },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 32, color: COLORS.textDarkPrimary, letterSpacing: -1, marginBottom: 8 },
  heroSub: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textDarkSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  trialBanner: { backgroundColor: '#1A1B1E', padding: 16, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.accent, alignItems: 'center', marginBottom: 32 },
  trialText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: 0.5 },
  plansContainer: { gap: 16 },
  planCard: { backgroundColor: '#1A1B1E', borderRadius: SIZES.radius, padding: 24, borderWidth: 1, borderColor: COLORS.darkBorder },
  planCardHighlighted: { borderColor: COLORS.accent, shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  planTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: COLORS.textDarkPrimary, textTransform: 'uppercase' },
  currentBadge: { backgroundColor: COLORS.darkBorder, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  currentBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: COLORS.textDarkSecondary, textTransform: 'uppercase' },
  planPrice: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textDarkSecondary, marginBottom: 24 },
  featuresList: { gap: 12, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textDarkPrimary },
  upgradeBtn: { paddingVertical: 16, borderRadius: SIZES.radius, alignItems: 'center', borderWidth: 1 },
  upgradeBtnPrimary: { backgroundColor: COLORS.textDarkPrimary, borderColor: COLORS.textDarkPrimary },
  upgradeBtnSecondary: { backgroundColor: 'transparent', borderColor: COLORS.darkBorder },
  upgradeBtnDisabled: { opacity: 0.7 },
  upgradeBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
  upgradeBtnTextPrimary: { color: COLORS.darkPanel },
  upgradeBtnTextSecondary: { color: COLORS.textDarkPrimary },
});

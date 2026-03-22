import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function AuthEntryScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 20, 60) }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{t('authEntryTitle')}</Text>
        <Text style={styles.description}>{t('authEntryText')}</Text>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => router.push('/signup')} 
          activeOpacity={0.9}
        >
          <Text style={styles.primaryButtonText}>{t('createAccount')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => router.push('/login')} 
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>{t('alreadyHaveAccount')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'space-between' },
  header: { paddingHorizontal: SIZES.paddingLarge },
  backBtn: { width: 40, height: 40, justifyContent: 'center', marginLeft: -8 },
  content: { paddingHorizontal: SIZES.paddingLarge, flex: 1, justifyContent: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 32, color: COLORS.textPrimary, marginBottom: 16, letterSpacing: -1 },
  description: { fontFamily: 'Inter_500Medium', fontSize: 16, color: COLORS.textSecondary, lineHeight: 24 },
  footer: { padding: SIZES.paddingLarge, paddingBottom: 48, gap: 16 },
  primaryButton: { backgroundColor: COLORS.accent, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  primaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 },
  secondaryButton: { backgroundColor: 'transparent', height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  secondaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1 },
});

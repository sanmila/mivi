import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { setTokens } from '../utils/auth';
import { trackEvent } from '../utils/analytics';
import { useDemo } from '../context/DemoContext';
import { apiClient } from '../utils/api';
import { useToast } from '../context/ToastContext';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { hasCompletedMinimumSetup, experienceLevel, setDemoLevel } = useDemo();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast(t('error'), t('authReq'));
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { identifier: email, password });
      
      if (res.accessToken && res.refreshToken) {
        await setTokens(res.accessToken, res.refreshToken);
        trackEvent('login_success');
        
        if (hasCompletedMinimumSetup) {
          setDemoLevel(experienceLevel);
        } else {
          setDemoLevel('calibration');
        }
        
        router.replace('/(tabs)');
      } else {
        throw new Error('Invalid response');
      }
    } catch (e) {
      showToast(t('error'), t('authFail'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Backend social auth endpoints are not ready yet
    showToast(t('soon'), t('socialLoginSoon'));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 20, 60) }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('login')}</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('emailOrId')}</Text>
          <TextInput 
            style={styles.input} 
            placeholder="name@example.com" 
            placeholderTextColor={COLORS.textSecondary} 
            autoCapitalize="none" 
            value={email} 
            onChangeText={setEmail} 
            editable={!isLoading}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('password')}</Text>
          <TextInput 
            style={styles.input} 
            placeholder="••••••••" 
            placeholderTextColor={COLORS.textSecondary} 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword} 
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin} 
          disabled={isLoading} 
          activeOpacity={0.9}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>{t('login')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('orContinueWith')}</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialGroup}>
          <TouchableOpacity 
            style={[styles.socialButton, isLoading && styles.buttonDisabled]} 
            onPress={() => handleSocialLogin('vk')} 
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <View style={styles.socialIconWrapper}>
              <Text style={[styles.socialIconText, { color: '#0077FF', letterSpacing: -0.5 }]}>VK</Text>
            </View>
            <Text style={styles.socialButtonText}>{t('loginWithVK')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.socialButton, isLoading && styles.buttonDisabled]} 
            onPress={() => handleSocialLogin('yandex')} 
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <View style={styles.socialIconWrapper}>
              <Text style={[styles.socialIconText, { color: '#FC3F1D' }]}>Я</Text>
            </View>
            <Text style={styles.socialButtonText}>{t('loginWithYandex')}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingHorizontal: SIZES.paddingLarge, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 1.5 },
  form: { padding: SIZES.paddingLarge, gap: 24, marginTop: 8 },
  inputGroup: { gap: 8 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: 16, fontFamily: 'Inter_500Medium', fontSize: 16, color: COLORS.textPrimary },
  button: { backgroundColor: COLORS.accent, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 14, marginTop: 8 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textSecondary, paddingHorizontal: 16 },
  socialGroup: { gap: 12 },
  socialButton: { backgroundColor: COLORS.card, height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, position: 'relative' },
  socialIconWrapper: { position: 'absolute', left: 20, justifyContent: 'center', alignItems: 'center' },
  socialIconText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  socialButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textPrimary },
});

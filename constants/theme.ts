export const COLORS = {
  background: '#0B0F14', 
  darkPanel: '#0B0F14',
  
  card: '#1A1B1E',
  border: 'rgba(255,255,255,0.06)',
  darkBorder: 'rgba(255,255,255,0.06)',
  
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  textDarkPrimary: '#FFFFFF',
  textDarkSecondary: 'rgba(255,255,255,0.65)',
  textDarkMuted: 'rgba(255,255,255,0.4)',
  
  accent: '#FF542C',
  
  chartLine: '#FFFFFF',
  chartGrid: 'rgba(255,255,255,0.06)',
};

export const SIZES = {
  radius: 16,
  padding: 16,
  paddingLarge: 20,
  paddingSmall: 8,
};

export const FONTS = {
  metric: {
    fontFamily: 'Inter_700Bold',
    fontSize: 48,
    color: COLORS.textPrimary,
    letterSpacing: -2,
  },
  metricMedium: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: COLORS.textPrimary,
    letterSpacing: -1.5,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    textTransform: 'uppercase' as const,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  body: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  micro: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
};

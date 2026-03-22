import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

interface GlobalHeaderProps {
  title: string;
  rightNode?: React.ReactNode;
  leftNode?: React.ReactNode;
}

const LOGO_URL = 'https://images.dualite.app/67a2899f-ad42-4385-b6ae-15305675cef2/white-e69d1f36-45dc-422a-a5ec-d2116b76e24b.webp';

export const GlobalHeader = ({ title, rightNode, leftNode }: GlobalHeaderProps) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top + 20, 40) }]}>
      <View style={styles.topRow}>
        <View style={styles.sideBoxLeft}>
          {leftNode ? leftNode : (
            <Image source={{ uri: LOGO_URL }} style={styles.logoImage} resizeMode="contain" />
          )}
        </View>
        <View style={styles.sideBoxRight}>
          {rightNode}
        </View>
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sideBoxLeft: {
    width: 80,
    height: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  sideBoxRight: {
    width: 80,
    height: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
  },
  logoImage: {
    width: 72,
    height: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 32,
  }
});

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { COLORS } from '../constants/theme';

interface SkeletonProps {
  style?: ViewStyle | ViewStyle[];
  isDark?: boolean;
}

export const Skeleton = ({ style, isDark = false }: SkeletonProps) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        styles.skeleton, 
        isDark ? styles.darkBg : styles.lightBg,
        style, 
        animatedStyle
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  lightBg: {
    backgroundColor: COLORS.border,
  },
  darkBg: {
    backgroundColor: COLORS.darkBorder,
  }
});

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { FONTS, COLORS } from '../constants/theme';

export const Metric = ({ style, ...props }: TextProps) => (
  <Text style={[FONTS.metric, style]} {...props} />
);

export const MetricMedium = ({ style, ...props }: TextProps) => (
  <Text style={[FONTS.metricMedium, style]} {...props} />
);

export const Label = ({ style, ...props }: TextProps) => (
  <Text style={[FONTS.label, style]} {...props} />
);

export const Body = ({ style, ...props }: TextProps) => (
  <Text style={[FONTS.body, style]} {...props} />
);

export const Micro = ({ style, ...props }: TextProps) => (
  <Text style={[FONTS.micro, style]} {...props} />
);

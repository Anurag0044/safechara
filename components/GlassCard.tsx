import React from 'react';
import { StyleSheet, ViewStyle, View, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}

export const GlassCard = ({ children, style, intensity = 20 }: GlassCardProps) => {
  return (
    <BlurView intensity={intensity} tint="dark" style={[styles.card, style]}>
      <View style={styles.borderOverlay} />
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.glassBackground,
    padding: 16,
  },
  borderOverlay: {
    ...StyleSheet.absoluteFill as any,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
});

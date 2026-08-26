import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export const GradientMeshBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.surfaceContainerLowest]}
        style={StyleSheet.absoluteFill as any}
      />
      {/* Decorative Blob 1 */}
      <View style={[styles.blob, styles.blob1]} />
      {/* Decorative Blob 2 */}
      <View style={[styles.blob, styles.blob2]} />
      
      <View style={StyleSheet.absoluteFill as any}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.3,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: colors.primaryContainer,
    top: -50,
    left: -100,
    transform: [{ scaleX: 1.5 }, { rotate: '45deg' }],
  },
  blob2: {
    width: 400,
    height: 400,
    backgroundColor: colors.secondaryContainer,
    bottom: -100,
    right: -150,
    transform: [{ scaleY: 1.2 }, { rotate: '-20deg' }],
  },
});

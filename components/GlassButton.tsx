import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';

interface GlassButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const GlassButton = ({ onPress, title, variant = 'primary', style, textStyle, icon }: GlassButtonProps) => {
  const isPrimary = variant === 'primary';
  const backgroundColor = isPrimary ? 'rgba(104, 219, 169, 0.2)' : colors.glassBackground;
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.touchable, style]}>
      <BlurView intensity={isPrimary ? 40 : 20} tint={isPrimary ? "default" : "dark"} style={[styles.button, { backgroundColor }]}>
        {/* Inner top highlight */}
        <View style={styles.highlight} />
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.text, { color: isPrimary ? colors.primaryFixed : colors.onSurface }, textStyle]}>
          {title}
        </Text>
      </BlurView>
    </TouchableOpacity>
  );
};

import { View } from 'react-native';

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 9999,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 9999,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

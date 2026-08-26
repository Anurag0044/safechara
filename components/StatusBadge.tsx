import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../theme/colors';

interface StatusBadgeProps {
  status: 'good' | 'caution' | 'alert';
  label: string;
}

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  let color = colors.statusGood;
  if (status === 'caution') color = colors.statusCaution;
  if (status === 'alert') color = colors.statusAlert;

  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: `${color}20` }]}>
      <View style={[styles.dot, { backgroundColor: color, shadowColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

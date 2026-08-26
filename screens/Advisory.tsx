import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { GradientMeshBackground } from '../components/GradientMeshBackground';
import { GlassCard } from '../components/GlassCard';
import { GlassHeader } from '../components/GlassHeader';
import { colors } from '../theme/colors';

const advisories = [
  { id: '1', title: 'High Moisture Warning', text: 'Recent silage tests indicate moisture > 65%. Risk of clostridial fermentation. Ensure proper compaction.', severity: 'alert' },
  { id: '2', title: 'Protein Supplementation', text: 'Feed batch 432 is low in protein. Consider adding soybean meal to meet dietary requirements.', severity: 'caution' },
  { id: '3', title: 'Optimal Harvest Time', text: 'Current weather conditions are ideal for harvesting alfalfa. Target moisture is 50-60%.', severity: 'good' },
];

export const AdvisoryScreen = ({ navigation }: any) => {
  return (
    <GradientMeshBackground>
      <GlassHeader title="Advisory" navigation={navigation} />
      
      <ScrollView contentContainerStyle={styles.scroll}>
        {advisories.map(item => {
          let borderColor = colors.statusGood;
          if (item.severity === 'caution') borderColor = colors.statusCaution;
          if (item.severity === 'alert') borderColor = colors.statusAlert;

          return (
            <GlassCard key={item.id} style={[styles.card, { borderLeftColor: borderColor, borderLeftWidth: 4 }]}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.text}>{item.text}</Text>
            </GlassCard>
          );
        })}
      </ScrollView>
    </GradientMeshBackground>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 100,
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    padding: 20,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: 8,
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
  },
});

import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { GradientMeshBackground } from '../components/GradientMeshBackground';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { StatusBadge } from '../components/StatusBadge';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { saveTestRecord } from '../services/testRecordService';

export const ResultsScreen = ({ route, navigation }: any) => {
  const { result, sampleType, cattleType, cattleCondition, imageUri } = route.params || {};
  const [saving, setSaving] = useState(false);

  const getOverallStatus = () => {
    if (result.mouldDetected || result.ureaFlag || result.sandFlag) return 'alert';
    if (result.proteinPct < 12 || result.moisturePct > 55) return 'caution';
    return 'good';
  };

  const status = getOverallStatus();
  const statusLabel = status === 'good' ? 'Excellent' : status === 'caution' ? 'Fair' : 'Poor Quality';
  const advisoryText = status === 'alert'
    ? 'Warning: Contaminants detected. Do not feed this batch. Check for mould or adulteration.'
    : status === 'caution'
      ? 'Nutritional value is below optimal. Consider supplementing protein.'
      : 'Batch is of high quality. Safe to feed.';

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await saveTestRecord({
        sampleType,
        cattleType,
        cattleCondition,
        imageUri,
        result,
        advisoryText: { en: advisoryText, hi: advisoryText },
      });
      navigation.navigate('DrawerNavigator');
    } catch (err: any) {
      Alert.alert('Save failed', err?.message || 'Could not save this test report. Please check your Firebase and Cloudinary setup.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <GradientMeshBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('DrawerNavigator')} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Result</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <GlassCard style={styles.heroCard}>
          <StatusBadge status={status} label={statusLabel} />
          <Text style={styles.heroType}>{sampleType} Batch</Text>
          <Text style={styles.heroDate}>{new Date().toLocaleString()}</Text>
        </GlassCard>

        <View style={styles.grid}>
          <MetricCard title="Protein" value={`${result.proteinPct}%`} icon="activity" color={colors.primary} />
          <MetricCard title="Moisture" value={`${result.moisturePct}%`} icon="droplet" color={colors.secondary} />
          <MetricCard title="Fiber" value={`${result.fiberPct}%`} icon="menu" color={colors.tertiary} />
          <MetricCard title="pH Level" value={result.phValue} icon="thermometer" color={colors.primary} />
        </View>

        <GlassCard style={styles.advisoryCard}>
          <View style={styles.advisoryHeader}>
            <Feather name="alert-circle" size={20} color={colors.statusCaution} />
            <Text style={styles.advisoryTitle}>Advisory</Text>
          </View>
          <Text style={styles.advisoryText}>{advisoryText}</Text>
        </GlassCard>

        <View style={styles.actions}>
          <GlassButton 
            title={saving ? 'Saving...' : 'Save & Sync'} 
            icon={saving ? <ActivityIndicator size="small" color={colors.primaryFixed} /> : <Feather name="cloud" size={20} color={colors.onSurface} />}
            disabled={saving}
            onPress={handleSave} 
            style={styles.actionBtn} 
          />
          <GlassButton 
            title="Share Report" 
            variant="secondary"
            icon={<Feather name="share-2" size={20} color={colors.onSurface} />}
            onPress={() => {}} 
            style={styles.actionBtn} 
          />
        </View>
      </ScrollView>
    </GradientMeshBackground>
  );
};

const MetricCard = ({ title, value, icon, color }: any) => (
  <View style={styles.metricWrapper}>
    <GlassCard style={styles.metricCard}>
      <View style={[styles.iconBg, { backgroundColor: `${color}20` }]}>
        <Feather name={icon} size={20} color={color} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </GlassCard>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: colors.onSurface,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  heroType: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: colors.onSurface,
    marginTop: 16,
  },
  heroDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  metricCard: {
    padding: 16,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.onSurface,
    marginBottom: 4,
  },
  metricTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  advisoryCard: {
    padding: 24,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: colors.statusCaution,
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  advisoryTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.onSurface,
    marginLeft: 8,
  },
  advisoryText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
  },
  actions: {
    gap: 16,
  },
  actionBtn: {
    width: '100%',
  },
});

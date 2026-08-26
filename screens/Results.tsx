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
  const [showSimulated, setShowSimulated] = useState(false);

  // Derive overall status from the backend's real visual screening data
  const getOverallStatus = () => {
    if (result.mouldDetected || result.sandDetected) return 'alert';
    if (result.qualityScore != null && result.qualityScore < 70) return 'caution';
    if (result.qualityScore != null && result.qualityScore >= 80) return 'good';
    return 'caution';
  };

  const status = getOverallStatus();
  const statusLabel = status === 'good' ? 'Low Visual Risk' : status === 'caution' ? 'Caution' : 'High Risk';

  // Use the backend's recommendation message if available, otherwise fall back
  const advisoryText = result.recommendationMessage
    || (status === 'alert'
      ? 'Warning: Contaminants detected. Inspect the batch before use.'
      : status === 'caution'
        ? 'Visual quality is below optimal. Inspect the feed manually.'
        : 'Feed passes the prototype visual screening.');

  // Advisory border color from backend (RED → error, YELLOW → caution, GREEN → primary)
  const advisoryBorderColor = result.recommendationColor === 'RED'
    ? colors.error
    : result.recommendationColor === 'GREEN'
      ? colors.primary
      : colors.statusCaution;

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
      Alert.alert('Save failed', err?.message || 'Could not save this test report.');
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
        {/* Hero Card — Quality Score */}
        <GlassCard style={styles.heroCard}>
          <StatusBadge status={status} label={statusLabel} />
          <Text style={styles.heroScore}>{result.qualityScore ?? '—'}</Text>
          <Text style={styles.heroScoreLabel}>Visual Quality Score</Text>
          <Text style={styles.heroType}>{sampleType} Batch</Text>
          <Text style={styles.heroDate}>{new Date().toLocaleString()}</Text>
        </GlassCard>

        {/* Visual Detection Cards */}
        <Text style={styles.sectionTitle}>Visual Screening</Text>
        <View style={styles.grid}>
          <DetectionCard
            title="Mould"
            detected={result.mouldDetected}
            riskScore={result.mouldRiskScore}
            icon="alert-triangle"
            detectedColor={colors.error}
          />
          <DetectionCard
            title="Sand / Foreign"
            detected={result.sandDetected}
            riskScore={result.sandRiskScore}
            icon="layers"
            detectedColor={colors.statusCaution}
          />
          <DetectionCard
            title="Insect / Pest"
            detected={result.insectDetected}
            riskScore={result.insectRiskScore}
            icon="bug" // Feather doesn't have bug, using 'eye' fallback
            detectedColor={colors.statusCaution}
          />
          <DetectionCard
            title="Overall Risk"
            detected={result.qualityScore != null && result.qualityScore < 60}
            riskScore={result.qualityScore != null ? (100 - result.qualityScore) / 100 : 0}
            icon="shield"
            detectedColor={colors.error}
            customLabel={result.recommendationStatus || 'UNKNOWN'}
          />
        </View>

        {/* Advisory Card — from backend recommendation */}
        <GlassCard style={[styles.advisoryCard, { borderLeftColor: advisoryBorderColor }]}>
          <View style={styles.advisoryHeader}>
            <Feather
              name={status === 'alert' ? 'alert-octagon' : status === 'caution' ? 'alert-circle' : 'check-circle'}
              size={20}
              color={advisoryBorderColor}
            />
            <Text style={styles.advisoryTitle}>
              {result.recommendationStatus || 'Advisory'}
            </Text>
          </View>
          <Text style={styles.advisoryText}>{advisoryText}</Text>
        </GlassCard>

        {/* Collapsible Simulated Sensor Data */}
        <TouchableOpacity
          style={styles.simulatedToggle}
          onPress={() => setShowSimulated(!showSimulated)}
          activeOpacity={0.7}
        >
          <Text style={styles.simulatedToggleText}>Sensor Data (Simulated)</Text>
          <Feather name={showSimulated ? 'chevron-up' : 'chevron-down'} size={18} color={colors.onSurfaceVariant} />
        </TouchableOpacity>

        {showSimulated && (
          <GlassCard style={styles.simulatedCard}>
            <Text style={styles.simulatedNote}>
              These values are simulated. Real sensor data will be available once hardware is integrated.
            </Text>
            <View style={styles.simulatedGrid}>
              <SimulatedRow label="Protein" value={`${result.proteinPct}%`} />
              <SimulatedRow label="Moisture" value={`${result.moisturePct}%`} />
              <SimulatedRow label="Fiber" value={`${result.fiberPct}%`} />
              <SimulatedRow label="pH Level" value={result.phValue} />
              <SimulatedRow label="Conductivity" value={`${result.conductivityValue} μS`} />
            </View>
          </GlassCard>
        )}

        {/* Actions */}
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

// --- Detection Card Component ---
const DetectionCard = ({ title, detected, riskScore, icon, detectedColor, customLabel }: any) => {
  const displayScore = riskScore != null ? Math.round(riskScore * 100) : 0;
  const iconName = icon === 'bug' ? 'eye' : icon; // Feather fallback

  return (
    <View style={styles.metricWrapper}>
      <GlassCard style={[styles.metricCard, detected && { borderWidth: 1, borderColor: detectedColor }]}>
        <View style={styles.metricTop}>
          <View style={[styles.iconBg, { backgroundColor: detected ? `${detectedColor}20` : 'rgba(104, 219, 169, 0.1)' }]}>
            <Feather name={iconName} size={18} color={detected ? detectedColor : colors.primary} />
          </View>
          <View style={[styles.detectedBadge, { backgroundColor: detected ? `${detectedColor}20` : 'rgba(104, 219, 169, 0.15)' }]}>
            <Text style={[styles.detectedBadgeText, { color: detected ? detectedColor : colors.primary }]}>
              {customLabel || (detected ? 'DETECTED' : 'CLEAR')}
            </Text>
          </View>
        </View>
        <Text style={styles.metricTitle}>{title}</Text>
        <View style={styles.riskBarBg}>
          <View style={[styles.riskBarFill, { width: `${displayScore}%`, backgroundColor: detected ? detectedColor : colors.primary }]} />
        </View>
        <Text style={styles.riskScoreText}>Risk: {displayScore}%</Text>
      </GlassCard>
    </View>
  );
};

// --- Simulated Sensor Row ---
const SimulatedRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.simulatedRow}>
    <Text style={styles.simulatedLabel}>{label}</Text>
    <Text style={styles.simulatedValue}>{value}</Text>
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
    paddingVertical: 28,
    marginBottom: 24,
  },
  heroScore: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 56,
    color: colors.onSurface,
    marginTop: 12,
  },
  heroScoreLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  heroType: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: colors.onSurface,
    marginTop: 12,
  },
  heroDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricWrapper: {
    width: '48%',
    marginBottom: 14,
  },
  metricCard: {
    padding: 14,
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  detectedBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  metricTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: colors.onSurface,
    marginBottom: 8,
  },
  riskBarBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 6,
  },
  riskBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  riskScoreText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  metricValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.onSurface,
    marginBottom: 4,
  },
  advisoryCard: {
    padding: 24,
    marginBottom: 24,
    borderLeftWidth: 4,
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  advisoryTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.onSurface,
    marginLeft: 8,
  },
  advisoryText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: colors.onSurfaceVariant,
  },
  simulatedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  simulatedToggleText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  simulatedCard: {
    padding: 16,
    marginBottom: 24,
  },
  simulatedNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 18,
  },
  simulatedGrid: {
    gap: 8,
  },
  simulatedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  simulatedLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  simulatedValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.onSurface,
  },
  actions: {
    gap: 16,
  },
  actionBtn: {
    width: '100%',
  },
});

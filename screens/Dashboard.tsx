import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientMeshBackground } from '../components/GradientMeshBackground';
import { GlassCard } from '../components/GlassCard';
import { GlassHeader } from '../components/GlassHeader';
import { StatusBadge } from '../components/StatusBadge';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { scale } from '../utils/responsive';

const recentTests = [
  { id: '1', type: 'Feed', status: 'good', date: '2 hrs ago', score: 92 },
  { id: '2', type: 'Silage', status: 'caution', date: 'Yesterday', score: 75 },
  { id: '3', type: 'Feed', status: 'alert', date: '2 days ago', score: 40 },
];

export const DashboardScreen = ({ navigation }: any) => {
  return (
    <GradientMeshBackground>
      <GlassHeader title="Dashboard" navigation={navigation} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Hello, Farmer</Text>
          <Text style={styles.subGreeting}>Ready to test your batches?</Text>
        </View>

        <GlassCard style={styles.deviceCard}>
          <View style={styles.deviceInfo}>
            <View style={styles.deviceIconBg}>
              <Feather name="cpu" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.deviceTitle}>SafeChara Sensor</Text>
              <Text style={styles.deviceStatus}>Not Connected</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.connectBtn}
            onPress={() => navigation.navigate('TestFeed')} // Connect flow unchanged for now
          >
            <Text style={styles.connectBtnText}>Connect</Text>
          </TouchableOpacity>
        </GlassCard>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('CattleTypeSelection')}>
            <GlassCard style={styles.actionCard}>
              <Feather name="activity" size={32} color={colors.primary} style={styles.actionIcon} />
              <Text style={styles.actionTitle}>Test Feed</Text>
            </GlassCard>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('TestSilage')}>
            <GlassCard style={styles.actionCard}>
              <Feather name="droplet" size={32} color={colors.secondary} style={styles.actionIcon} />
              <Text style={styles.actionTitle}>Test Silage</Text>
            </GlassCard>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Tests</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={recentTests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <GlassCard style={styles.testCard}>
              <View style={styles.testCardHeader}>
                <Text style={styles.testType}>{item.type}</Text>
                <StatusBadge status={item.status as any} label={item.status} />
              </View>
              <Text style={styles.testScore}>{item.score}/100</Text>
              <Text style={styles.testDate}>{item.date}</Text>
            </GlassCard>
          )}
        />
      </ScrollView>
    </GradientMeshBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 100, // accommodate header
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  greeting: {
    marginBottom: 24,
  },
  greetingText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: colors.onSurface,
  },
  subGreeting: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIconBg: {
    backgroundColor: 'rgba(104, 219, 169, 0.1)',
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
  },
  deviceTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.onSurface,
  },
  deviceStatus: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.error,
    marginTop: 2,
  },
  connectBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  connectBtnText: {
    fontFamily: 'Inter_500Medium',
    color: colors.onSurface,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionItem: {
    width: '48%',
  },
  actionCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  actionIcon: {
    marginBottom: 16,
  },
  actionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.onSurface,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: colors.onSurface,
  },
  seeAll: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.primary,
  },
  listContent: {
    paddingRight: 16,
  },
  testCard: {
    width: scale(200),
    marginRight: 16,
  },
  testCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  testType: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.onSurface,
  },
  testScore: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: colors.onSurface,
    marginBottom: 4,
  },
  testDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
});

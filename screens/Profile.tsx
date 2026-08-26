import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { GradientMeshBackground } from '../components/GradientMeshBackground';
import { GlassCard } from '../components/GlassCard';
import { GlassHeader } from '../components/GlassHeader';
import { GlassButton } from '../components/GlassButton';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { scale } from '../utils/responsive';

export const ProfileScreen = ({ navigation }: any) => {
  return (
    <GradientMeshBackground>
      <GlassHeader title="Profile & Settings" navigation={navigation} />
      
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarContainer}>
          <GlassCard style={styles.avatarCard} intensity={40}>
            <Feather name="user" size={48} color={colors.primary} />
          </GlassCard>
          <Text style={styles.name}>Ramesh Kumar</Text>
          <Text style={styles.farm}>Green Valley Dairy Farm</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <GlassCard style={styles.settingsList}>
            <SettingRow icon="globe" title="Language" value="English" />
            <SettingRow icon="cpu" title="Connected Devices" value="1 Device" />
            <SettingRow icon="cloud" title="Sync Status" value="Pending (3)" />
            <SettingRow icon="database" title="Offline Data" value="45 Records" />
            <SettingRow icon="help-circle" title="Help & Support" isLast />
          </GlassCard>
        </View>

        <GlassButton 
          title="Sync Now" 
          icon={<Feather name="refresh-cw" size={20} color={colors.primaryFixed} />}
          onPress={() => {}} 
          style={styles.syncBtn} 
        />
      </ScrollView>
    </GradientMeshBackground>
  );
};

const SettingRow = ({ icon, title, value, isLast }: any) => (
  <View style={[styles.row, !isLast && styles.rowBorder]}>
    <View style={styles.rowLeft}>
      <Feather name={icon} size={20} color={colors.onSurfaceVariant} style={styles.rowIcon} />
      <Text style={styles.rowTitle}>{title}</Text>
    </View>
    <View style={styles.rowRight}>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      <Feather name="chevron-right" size={20} color={colors.onSurfaceVariant} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 100,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarCard: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.onSurface,
    marginBottom: 4,
  },
  farm: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: 16,
  },
  settingsList: {
    padding: 0, // override default padding
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 16,
  },
  rowTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: colors.onSurface,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginRight: 8,
  },
  syncBtn: {
    width: '100%',
  },
});

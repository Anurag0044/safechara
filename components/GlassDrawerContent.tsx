import React from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import i18n from '../utils/i18n';

const menuItems = [
  { name: 'Dashboard', route: 'Dashboard', icon: 'home' },
  { name: 'Test Feed', route: 'CattleTypeSelection', icon: 'activity' },
  { name: 'Test Silage', route: 'TestSilage', icon: 'droplet' },
  { name: 'History/Traceability', route: 'History', icon: 'clock' },
  { name: 'Advisory', route: 'Advisory', icon: 'book-open' },
  { name: 'Connected Devices', route: 'ConnectedDevices', icon: 'cpu' },
  { name: 'Profile/Settings', route: 'Profile', icon: 'settings' },
  { name: 'Help & Support', route: 'HelpSupport', icon: 'help-circle' },
  { name: 'Language Selector', route: 'LanguageSelector', icon: 'globe' },
];

export const GlassDrawerContent = (props: any) => {
  const { state, navigation } = props;
  const { userProfile, logout } = useAuth();

  return (
    <BlurView intensity={50} tint="dark" style={styles.container}>
      <View style={styles.borderOverlay} />
      <DrawerContentScrollView {...props} style={styles.scroll}>
        <View style={styles.header}>
          {userProfile?.profileImageUrl ? (
            <Image source={{ uri: userProfile.profileImageUrl }} style={styles.headerAvatar} />
          ) : (
            <Feather name="shield" size={32} color={colors.primary} />
          )}
          <View style={styles.headerTextGroup}>
            <Text style={styles.headerTitle}>SafeChara</Text>
            {!!userProfile?.username && <Text style={styles.headerUser}>{userProfile.username}</Text>}
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => {
            const isActive = state.routeNames[state.index] === item.route;
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
                onPress={() => navigation.navigate(item.route)}
              >
                <Feather
                  name={item.icon as any}
                  size={20}
                  color={isActive ? colors.primary : colors.onSurfaceVariant}
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                  {item.name}
                </Text>
                {isActive && <View style={styles.activeGlow} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>
      
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Feather name="log-out" size={20} color={colors.error} style={styles.menuIcon} />
        <Text style={styles.logoutText}>{i18n.t('logout')}</Text>
      </TouchableOpacity>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(11, 19, 38, 0.7)',
  },
  borderOverlay: {
    ...StyleSheet.absoluteFill as any,
    borderRightWidth: 1,
    borderRightColor: colors.glassBorder,
  },
  scroll: {
    flex: 1,
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.onSurface,
  },
  headerTextGroup: {
    marginLeft: 12,
  },
  headerUser: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemActive: {
    backgroundColor: 'rgba(104, 219, 169, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
  menuTextActive: {
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  activeGlow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  logoutText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: colors.error,
  },
});

import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GradientMeshBackground } from '../components/GradientMeshBackground';
import { GlassCard } from '../components/GlassCard';
import { GlassHeader } from '../components/GlassHeader';
import { GlassButton } from '../components/GlassButton';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { scale } from '../utils/responsive';
import { useAuth } from '../context/AuthContext';
import i18n from '../utils/i18n';

export const ProfileScreen = ({ navigation }: any) => {
  const { userProfile, logout, uploadProfilePicture, authActionLoading } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pickImage = async (source: 'camera' | 'gallery') => {
    setSheetOpen(false);
    const permission = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(i18n.t('permission_required'), i18n.t(source === 'camera' ? 'camera_permission_message' : 'gallery_permission_message'));
      return;
    }

    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.85 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.85 });

    if (!result.canceled) {
      setUploading(true);
      try {
        await uploadProfilePicture(result.assets[0].uri);
      } catch {
        Alert.alert(i18n.t('auth_error_generic'), i18n.t('profile_image_update_failed'));
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <GradientMeshBackground>
      <GlassHeader title={i18n.t('profile_settings')} navigation={navigation} />
      
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity activeOpacity={0.82} onPress={() => setSheetOpen(true)}>
            <GlassCard style={styles.avatarCard} intensity={40}>
              {userProfile?.profileImageUrl ? (
                <Image source={{ uri: userProfile.profileImageUrl }} style={styles.avatarImage} />
              ) : (
                <Feather name="user" size={48} color={colors.primary} />
              )}
              {uploading && (
                <View style={styles.avatarLoading}>
                  <ActivityIndicator size="small" color={colors.primaryFixed} />
                </View>
              )}
            </GlassCard>
          </TouchableOpacity>
          <Text style={styles.name}>{userProfile?.username || i18n.t('username')}</Text>
          <Text style={styles.farm}>{userProfile?.email || i18n.t('email')}</Text>
          <TouchableOpacity onPress={() => setSheetOpen(true)}>
            <Text style={styles.editAvatar}>{i18n.t('edit_profile_picture')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('settings')}</Text>
          
          <GlassCard style={styles.settingsList}>
            <SettingRow icon="globe" title={i18n.t('language')} value="English" />
            <SettingRow icon="cpu" title={i18n.t('connected_devices')} value="1 Device" />
            <SettingRow icon="cloud" title={i18n.t('sync_status')} value="Pending (3)" />
            <SettingRow icon="database" title={i18n.t('offline_data')} value="45 Records" />
            <SettingRow icon="help-circle" title={i18n.t('help_support')} isLast />
          </GlassCard>
        </View>

        <GlassButton 
          title={i18n.t('sync_now')} 
          icon={<Feather name="refresh-cw" size={20} color={colors.primaryFixed} />}
          onPress={() => {}} 
          style={styles.syncBtn} 
        />
        <GlassButton
          title={authActionLoading ? i18n.t('logging_in') : i18n.t('logout')}
          variant="secondary"
          icon={authActionLoading ? <ActivityIndicator size="small" color={colors.error} /> : <Feather name="log-out" size={20} color={colors.error} />}
          onPress={logout}
          style={styles.logoutBtn}
          textStyle={styles.logoutText}
          disabled={authActionLoading}
        />
      </ScrollView>

      <Modal visible={sheetOpen} transparent animationType="fade" onRequestClose={() => setSheetOpen(false)}>
        <Pressable style={styles.modalScrim} onPress={() => setSheetOpen(false)}>
          <Pressable style={styles.sheet}>
            <GlassCard style={styles.sheetCard} intensity={48}>
              <TouchableOpacity style={styles.sheetAction} onPress={() => pickImage('camera')}>
                <Feather name="camera" size={22} color={colors.primaryFixed} />
                <Text style={styles.sheetText}>{i18n.t('take_photo')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetAction} onPress={() => pickImage('gallery')}>
                <Feather name="image" size={22} color={colors.secondary} />
                <Text style={styles.sheetText}>{i18n.t('choose_gallery')}</Text>
              </TouchableOpacity>
            </GlassCard>
          </Pressable>
        </Pressable>
      </Modal>
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(50),
  },
  avatarLoading: {
    ...StyleSheet.absoluteFill as any,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11, 19, 38, 0.68)',
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
  editAvatar: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.primaryFixed,
    marginTop: 12,
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
  logoutBtn: {
    width: '100%',
    marginTop: 14,
  },
  logoutText: {
    color: colors.error,
  },
  modalScrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    padding: 16,
  },
  sheet: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  sheetCard: {
    gap: 12,
    padding: 14,
  },
  sheetAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  sheetText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: colors.onSurface,
  },
});

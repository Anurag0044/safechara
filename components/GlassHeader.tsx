import React from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GlassHeaderProps {
  title: string;
  navigation: DrawerNavigationProp<DrawerParamList, any> | any;
  rightIcon?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  showMenuRight?: boolean;
}

export const GlassHeader = ({ title, navigation, rightIcon, showBack = false, onBack, showMenuRight = false }: GlassHeaderProps) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 32 : 12);
  const openMenu = () => {
    if (navigation.dispatch) {
      navigation.dispatch(DrawerActions.openDrawer());
    } else if (navigation.openDrawer) {
      navigation.openDrawer();
    }
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
        <View style={[styles.headerContent, { paddingTop: topInset }]}>
          <TouchableOpacity
              onPress={showBack ? onBack || navigation.goBack : openMenu}
              style={styles.iconButton}
            >
              <Feather name={showBack ? "arrow-left" : "menu"} size={24} color={colors.onSurface} />
            </TouchableOpacity>
            
            <Text style={styles.title}>{title}</Text>
            
            {showMenuRight ? (
              <TouchableOpacity onPress={openMenu} style={styles.iconButton}>
                <Feather name="menu" size={24} color={colors.onSurface} />
              </TouchableOpacity>
            ) : (
              <View style={styles.rightContainer}>
                {rightIcon || <View style={{ width: 24 }} />}
              </View>
            )}
          </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  blurContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
    backgroundColor: 'rgba(11, 19, 38, 0.4)', // Slightly darken the blur
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: colors.onSurface,
  },
  rightContainer: {
    padding: 8,
  },
});

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../types';

interface GlassHeaderProps {
  title: string;
  navigation: DrawerNavigationProp<DrawerParamList, any>;
  rightIcon?: React.ReactNode;
}

export const GlassHeader = ({ title, navigation, rightIcon }: GlassHeaderProps) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={styles.iconButton}
            >
              <Feather name="menu" size={24} color={colors.onSurface} />
            </TouchableOpacity>
            
            <Text style={styles.title}>{title}</Text>
            
            <View style={styles.rightContainer}>
              {rightIcon || <View style={{ width: 24 }} />}
            </View>
          </View>
        </SafeAreaView>
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

import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { GradientMeshBackground } from '../components/GradientMeshBackground';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const SplashScreen = ({ navigation }: any) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withTiming(1, { duration: 1000 });
    
    setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <GradientMeshBackground>
      <View style={styles.container}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/logo.png')} 
              style={{ width: 120, height: 120, resizeMode: 'contain' }} 
            />
          </View>
          <Text style={styles.title}>SafeChara</Text>
          <Text style={styles.tagline}>Every batch. Verified.</Text>
        </Animated.View>
      </View>
    </GradientMeshBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  grainIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 12,
    padding: 4,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 48,
    color: colors.onSurface,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    color: colors.onSurfaceVariant,
    letterSpacing: 1,
  },
});

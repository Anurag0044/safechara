import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence, withDelay } from 'react-native-reanimated';
import { GradientMeshBackground } from '../components/GradientMeshBackground';
import { GlassCard } from '../components/GlassCard';
import { GlassHeader } from '../components/GlassHeader';
import { GlassButton } from '../components/GlassButton';
import { colors } from '../theme/colors';
import { bleManager } from '../services/bleService';
import { analyzeSample } from '../services/aiService';

export const SampleTestingScreen = ({ route, navigation }: any) => {
  const { sampleType = 'Feed' } = route.params || {};
  
  const [step, setStep] = useState<'scanning' | 'connected' | 'analyzing' | 'done'>('scanning');
  
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Mock flow
    bleManager.startDeviceScan(null, {}, (error, device) => {
      setStep('connected');
      
      setTimeout(() => {
        setStep('analyzing');
        
        analyzeSample(sampleType, {}).then((result) => {
          setStep('done');
          setTimeout(() => {
            navigation.replace('TestResults', { result, sampleType });
          }, 1000);
        });
      }, 1500);
    });

    return () => bleManager.stopDeviceScan();
  }, []);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
      opacity: 1.5 - pulse.value,
    };
  });

  return (
    <GradientMeshBackground>
      <GlassHeader title={`Test ${sampleType}`} navigation={navigation} />
      
      <View style={styles.container}>
        <View style={styles.radarContainer}>
          <Animated.View style={[styles.radarRing, pulseStyle]} />
          <Animated.View style={[styles.radarRing, styles.radarRing2, pulseStyle]} />
          
          <GlassCard style={styles.centerCircle} intensity={40}>
            <Text style={styles.centerText}>
              {step === 'scanning' ? 'Scanning...' : 
               step === 'connected' ? 'Connected' : 
               step === 'analyzing' ? 'Analyzing...' : 'Done'}
            </Text>
          </GlassCard>
        </View>

        <View style={styles.statusContainer}>
          {step === 'analyzing' && (
            <>
              <GlassCard style={styles.statusChip}>
                <Text style={styles.statusText}>Spectral ✓</Text>
              </GlassCard>
              <GlassCard style={styles.statusChip}>
                <Text style={styles.statusText}>pH ✓</Text>
              </GlassCard>
              <GlassCard style={styles.statusChip}>
                <Text style={styles.statusText}>Image ✓</Text>
              </GlassCard>
            </>
          )}
        </View>
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
  radarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
  },
  radarRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'rgba(104, 219, 169, 0.1)',
  },
  radarRing2: {
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.5,
  },
  centerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(104, 219, 169, 0.2)',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  centerText: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.onSurface,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 12,
  },
  statusChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  statusText: {
    fontFamily: 'Inter_500Medium',
    color: colors.primary,
  },
});

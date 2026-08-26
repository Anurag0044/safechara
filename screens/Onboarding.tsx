import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientMeshBackground } from '../components/GradientMeshBackground';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { colors } from '../theme/colors';

const languages = [
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const [selectedLang, setSelectedLang] = useState('en');

  return (
    <GradientMeshBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to SafeChara</Text>
          <Text style={styles.subtitle}>Choose your preferred language</Text>
        </View>

        <View style={styles.grid}>
          {languages.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                style={styles.cardContainer}
                activeOpacity={0.8}
                onPress={() => setSelectedLang(lang.id)}
              >
                <GlassCard
                  style={[
                    styles.card,
                    isSelected ? styles.cardSelected : null,
                  ]}
                  intensity={isSelected ? 40 : 20}
                >
                  <Text style={[styles.langNative, isSelected && { color: colors.primary }]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={[styles.langName, isSelected && { color: colors.onSurface }]}>
                    {lang.name}
                  </Text>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <GlassButton
            title="Continue"
            onPress={() => navigation.replace('DrawerNavigator')}
          />
        </View>
      </SafeAreaView>
    </GradientMeshBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: colors.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    alignItems: 'center',
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(104, 219, 169, 0.15)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  langNative: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  langName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
});

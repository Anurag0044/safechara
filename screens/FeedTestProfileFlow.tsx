import React, { useMemo, useRef, useState } from 'react';
import { Alert, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientMeshBackground } from '../components/GradientMeshBackground';
import { GlassButton } from '../components/GlassButton';
import { GlassCard } from '../components/GlassCard';
import { GlassHeader } from '../components/GlassHeader';
import { colors } from '../theme/colors';
import i18n from '../utils/i18n';

type CattleType = 'cow' | 'buffalo';
type CattleCondition = 'lactating' | 'pregnant' | 'normal';

const cattleOptions: Array<{ id: CattleType; labelKey: string; icon?: keyof typeof MaterialCommunityIcons.glyphMap; emoji?: string }> = [
  { id: 'cow', labelKey: 'cattle_type_cow', emoji: '🐄' },
  { id: 'buffalo', labelKey: 'cattle_type_buffalo', emoji: '🐃' },
];

const conditionOptions: Array<{ id: CattleCondition; labelKey: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = [
  { id: 'lactating', labelKey: 'cattle_condition_lactating', icon: 'water' },
  { id: 'pregnant', labelKey: 'cattle_condition_pregnant', icon: 'heart-pulse' },
  { id: 'normal', labelKey: 'cattle_condition_normal', icon: 'shield-check-outline' },
];

const translateType = (value: CattleType) => i18n.t(value === 'cow' ? 'cattle_type_cow' : 'cattle_type_buffalo');
const translateCondition = (value: CattleCondition) => i18n.t(`cattle_condition_${value}`);

const StepProgress = ({ step }: { step: number }) => (
  <View style={styles.progressWrap}>
    <Text style={styles.stepText}>{i18n.t('feed_flow_step', { step })}</Text>
    <View style={styles.progressTrack}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={[styles.progressDot, item <= step && styles.progressDotActive]} />
      ))}
    </View>
  </View>
);

const OptionCard = ({
  selected,
  title,
  icon,
  emoji,
  onPress,
  compact = false,
}: {
  selected: boolean;
  title: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  emoji?: string;
  onPress: () => void;
  compact?: boolean;
}) => (
  <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.optionTouch}>
    <GlassCard style={[styles.optionCard, compact && styles.optionCardCompact, selected && styles.optionSelected]} intensity={selected ? 45 : 24}>
      <View style={[styles.optionIconShell, compact && styles.optionIconShellCompact, selected && styles.optionIconShellSelected]}>
        {emoji ? (
          <Text style={[styles.optionEmoji, compact && styles.optionEmojiCompact]}>{emoji}</Text>
        ) : (
          <MaterialCommunityIcons name={icon!} size={compact ? 31 : 38} color={selected ? colors.primaryFixed : colors.primary} />
        )}
      </View>
      <Text style={[styles.optionTitle, compact && styles.optionTitleCompact, selected && styles.optionTitleSelected]}>{title}</Text>
    </GlassCard>
  </TouchableOpacity>
);

const Chip = ({ icon, label }: { icon: string; label: string }) => (
  <GlassCard style={styles.chip} intensity={24}>
    <Text style={styles.chipText}>{icon} {label}</Text>
  </GlassCard>
);

const useFlowLayout = () => {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isCompact = height < 720 || width < 360;
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 32 : 12);
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 48 : 16);
  const headerHeight = topInset + 64;
  const footerHeight = bottomInset + 72;

  return {
    isCompact,
    screenHeight: height,
    scrollViewStyle: [
      styles.scrollView,
      {
        marginTop: headerHeight,
        marginBottom: footerHeight,
      },
    ],
    scrollContentStyle: [
      styles.scrollContent,
      {
        paddingTop: isCompact ? 14 : 22,
        paddingBottom: isCompact ? 20 : 28,
      },
    ],
    footerStyle: [styles.footer, { bottom: bottomInset }],
  };
};

export const CattleTypeSelectionScreen = ({ route, navigation }: any) => {
  const [selectedType, setSelectedType] = useState<CattleType | undefined>(route.params?.cattleType);
  const layout = useFlowLayout();

  return (
    <GradientMeshBackground>
      <GlassHeader
        title={i18n.t('test_feed')}
        navigation={navigation}
        showBack
        showMenuRight
        onBack={() => navigation.navigate('Dashboard')}
      />
      <ScrollView style={layout.scrollViewStyle} contentContainerStyle={layout.scrollContentStyle} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(450)} style={[styles.hero, layout.isCompact && styles.heroCompact]}>
          <StepProgress step={1} />
          <Text style={styles.title}>{i18n.t('cattle_type_title')}</Text>
          <Text style={styles.subtitle}>{i18n.t('cattle_type_subtitle')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.typeGrid}>
          {cattleOptions.map((option) => (
            <View key={option.id} style={styles.typeOption}>
              <OptionCard
                selected={selectedType === option.id}
                title={i18n.t(option.labelKey)}
                icon={option.icon}
                emoji={option.emoji}
                onPress={() => setSelectedType(option.id)}
                compact={layout.isCompact}
              />
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      <View style={layout.footerStyle}>
        <GlassButton
          title={i18n.t('next')}
          disabled={!selectedType}
          icon={<Feather name="arrow-right" size={20} color={selectedType ? colors.primaryFixed : colors.onSurfaceVariant} />}
          onPress={() => navigation.navigate('CattleConditionSelection', { cattleType: selectedType })}
        />
      </View>
    </GradientMeshBackground>
  );
};

export const CattleConditionSelectionScreen = ({ route, navigation }: any) => {
  const cattleType = route.params?.cattleType as CattleType;
  const [selectedCondition, setSelectedCondition] = useState<CattleCondition | undefined>(route.params?.cattleCondition);
  const layout = useFlowLayout();

  return (
    <GradientMeshBackground>
      <GlassHeader
        title={i18n.t('test_feed')}
        navigation={navigation}
        showBack
        showMenuRight
        onBack={() => navigation.navigate('CattleTypeSelection', { cattleType })}
      />
      <ScrollView style={layout.scrollViewStyle} contentContainerStyle={layout.scrollContentStyle} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(450)} style={[styles.hero, layout.isCompact && styles.heroCompact]}>
          <StepProgress step={2} />
          <View style={styles.summaryRow}>
            <Chip icon={cattleType === 'cow' ? '🐄' : '🐃'} label={i18n.t('selected_summary', { value: translateType(cattleType) })} />
          </View>
          <Text style={styles.title}>{i18n.t('cattle_condition_title')}</Text>
          <Text style={styles.subtitle}>{i18n.t('cattle_condition_subtitle')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.conditionGrid}>
          {conditionOptions.map((option) => (
            <OptionCard
              key={option.id}
              selected={selectedCondition === option.id}
              title={i18n.t(option.labelKey)}
              icon={option.icon}
              onPress={() => setSelectedCondition(option.id)}
              compact={layout.isCompact}
            />
          ))}
        </Animated.View>
      </ScrollView>

      <View style={layout.footerStyle}>
        <GlassButton
          title={i18n.t('next')}
          disabled={!selectedCondition}
          icon={<Feather name="arrow-right" size={20} color={selectedCondition ? colors.primaryFixed : colors.onSurfaceVariant} />}
          onPress={() => navigation.navigate('FeedSampleUpload', { cattleType, cattleCondition: selectedCondition })}
        />
      </View>
    </GradientMeshBackground>
  );
};

export const FeedSampleUploadScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const layout = useFlowLayout();
  const cattleType = route.params?.cattleType as CattleType;
  const cattleCondition = route.params?.cattleCondition as CattleCondition;
  const [imageUri, setImageUri] = useState<string | undefined>(route.params?.imageUri);
  const [showPickerSheet, setShowPickerSheet] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const glow = useSharedValue(1);

  React.useEffect(() => {
    glow.value = withRepeat(withSequence(withTiming(1.04, { duration: 900 }), withTiming(1, { duration: 900 })), -1, true);
  }, [glow]);

  const startStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageUri ? glow.value : 1 }],
  }));

  const selectGalleryImage = async () => {
    setShowPickerSheet(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(i18n.t('permission_required'), i18n.t('gallery_permission_message'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    setShowPickerSheet(false);
    const permission = cameraPermission?.granted ? cameraPermission : await requestCameraPermission();
    if (!permission?.granted) {
      Alert.alert(i18n.t('permission_required'), i18n.t('camera_permission_message'));
      return;
    }
    setCameraOpen(true);
  };

  const capturePhoto = async () => {
    if (!cameraReady) return;
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.85 });
    if (photo?.uri) {
      setImageUri(photo.uri);
      setCameraOpen(false);
    }
  };

  const handleUploadPress = () => {
    if (Platform.OS === 'web') {
      selectGalleryImage();
      return;
    }
    setShowPickerSheet(true);
  };

  const webDropHandlers = useMemo(() => {
    if (Platform.OS !== 'web') return {};
    return {
      onDragOver: (event: any) => {
        event.preventDefault();
      },
      onDrop: (event: any) => {
        event.preventDefault();
        const file = event.dataTransfer?.files?.[0];
        if (file?.type?.startsWith('image/')) {
          setImageUri(URL.createObjectURL(file));
        }
      },
    };
  }, []);

  if (cameraOpen) {
    return (
      <View style={styles.cameraScreen}>
        <CameraView ref={cameraRef} style={styles.cameraPreview} facing="back" mode="picture" onCameraReady={() => setCameraReady(true)} />
        <View style={[styles.cameraOverlay, { paddingTop: Math.max(insets.top, 16) + 12, paddingBottom: Math.max(insets.bottom, 20) + 16 }]}>
          <TouchableOpacity style={styles.cameraIconButton} onPress={() => setCameraOpen(false)}>
            <Feather name="x" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shutterButton} onPress={capturePhoto}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <GradientMeshBackground>
      <GlassHeader
        title={i18n.t('test_feed')}
        navigation={navigation}
        showBack
        showMenuRight
        onBack={() => navigation.navigate('CattleConditionSelection', { cattleType, cattleCondition })}
      />
      <ScrollView style={layout.scrollViewStyle} contentContainerStyle={layout.scrollContentStyle} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(450)} style={[styles.hero, layout.isCompact && styles.heroCompact]}>
          <StepProgress step={3} />
          <View style={[styles.summaryRow, styles.uploadSummary]}>
            <Chip icon={cattleType === 'cow' ? '🐄' : '🐃'} label={translateType(cattleType)} />
            <Chip icon={cattleCondition === 'lactating' ? '🥛' : cattleCondition === 'pregnant' ? '♡' : '✓'} label={translateCondition(cattleCondition)} />
            <TouchableOpacity onPress={() => navigation.navigate('CattleTypeSelection', { cattleType, cattleCondition })}>
              <Text style={styles.editText}>{i18n.t('edit')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{i18n.t('sample_upload_title')}</Text>
          <Text style={styles.subtitle}>{i18n.t('sample_upload_subtitle')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(450)}>
          <Pressable onPress={handleUploadPress} style={styles.uploadPressable} {...webDropHandlers}>
            <GlassCard
              style={[
                styles.uploadZone,
                { minHeight: layout.isCompact ? Math.max(210, layout.screenHeight * 0.3) : Math.max(260, layout.screenHeight * 0.34) },
                imageUri && styles.uploadZoneReady,
              ]}
              intensity={32}
            >
              {imageUri ? (
                <>
                  <Image source={{ uri: imageUri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.changeButton} onPress={handleUploadPress}>
                    <Feather name="refresh-cw" size={16} color={colors.primaryFixed} />
                    <Text style={styles.changeText}>{i18n.t('retake_change')}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.uploadIconShell}>
                    <Feather name={Platform.OS === 'web' ? 'upload-cloud' : 'camera'} size={42} color={colors.primaryFixed} />
                  </View>
                  <Text style={styles.uploadText}>{i18n.t('upload_zone_text')}</Text>
                </>
              )}
            </GlassCard>
          </Pressable>
        </Animated.View>
      </ScrollView>

      <Animated.View style={[layout.footerStyle, startStyle]}>
        <GlassButton
          title={i18n.t('start_test')}
          disabled={!imageUri}
          icon={<Feather name="zap" size={20} color={imageUri ? colors.primaryFixed : colors.onSurfaceVariant} />}
          onPress={() => navigation.navigate('TestFeed', { sampleType: 'Feed', cattleType, cattleCondition, imageUri })}
        />
      </Animated.View>

      <Modal visible={showPickerSheet} transparent animationType="fade" onRequestClose={() => setShowPickerSheet(false)}>
        <Pressable style={[styles.modalScrim, { paddingBottom: Math.max(insets.bottom, 16) }]} onPress={() => setShowPickerSheet(false)}>
          <Pressable style={styles.sheet}>
            <GlassCard style={styles.sheetCard} intensity={48}>
              <TouchableOpacity style={styles.sheetAction} onPress={openCamera}>
                <Feather name="camera" size={22} color={colors.primaryFixed} />
                <Text style={styles.sheetText}>{i18n.t('take_photo')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetAction} onPress={selectGalleryImage}>
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

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  hero: {
    marginBottom: 24,
  },
  heroCompact: {
    marginBottom: 16,
  },
  progressWrap: {
    marginBottom: 24,
  },
  stepText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: colors.primary,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    flex: 1,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  progressDotActive: {
    backgroundColor: 'rgba(104, 219, 169, 0.85)',
    shadowColor: colors.primary,
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 31,
    color: colors.onSurface,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurfaceVariant,
    lineHeight: 23,
    marginTop: 10,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  typeOption: {
    flex: 1,
  },
  optionTouch: {
    borderRadius: 24,
  },
  optionCard: {
    minHeight: 166,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  optionCardCompact: {
    minHeight: 132,
    paddingVertical: 14,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(104, 219, 169, 0.15)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 16,
    elevation: 8,
  },
  optionIconShell: {
    width: 78,
    height: 78,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(104, 219, 169, 0.1)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: 18,
  },
  optionIconShellCompact: {
    width: 62,
    height: 62,
    borderRadius: 20,
    marginBottom: 12,
  },
  optionIconShellSelected: {
    backgroundColor: 'rgba(104, 219, 169, 0.22)',
    borderColor: colors.primary,
  },
  optionEmoji: {
    fontSize: 38,
    lineHeight: 42,
  },
  optionEmojiCompact: {
    fontSize: 31,
    lineHeight: 35,
  },
  optionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 19,
    color: colors.onSurface,
  },
  optionTitleCompact: {
    fontSize: 17,
  },
  optionTitleSelected: {
    color: colors.primaryFixed,
  },
  conditionGrid: {
    gap: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  uploadSummary: {
    marginBottom: 18,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: colors.onSurface,
  },
  editText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.primaryFixed,
    paddingHorizontal: 6,
  },
  uploadPressable: {
    borderRadius: 28,
  },
  uploadZone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(104, 219, 169, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  uploadZoneReady: {
    borderStyle: 'solid',
    borderColor: colors.primary,
    backgroundColor: 'rgba(104, 219, 169, 0.08)',
  },
  uploadIconShell: {
    width: 92,
    height: 92,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(104, 219, 169, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(104, 219, 169, 0.4)',
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 18,
  },
  uploadText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 23,
    color: colors.onSurface,
    textAlign: 'center',
    marginTop: 22,
    maxWidth: 260,
  },
  previewImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  changeButton: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(11, 19, 38, 0.78)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  changeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: colors.primaryFixed,
  },
  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
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
  cameraScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cameraPreview: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraIconButton: {
    alignSelf: 'flex-start',
    marginLeft: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11, 19, 38, 0.72)',
  },
  shutterButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.onSurface,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.onSurface,
  },
});

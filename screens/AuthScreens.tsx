import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientMeshBackground } from '../components/GradientMeshBackground';
import { GlassButton } from '../components/GlassButton';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';
import { mapFirebaseAuthError, useAuth } from '../context/AuthContext';
import i18n from '../utils/i18n';
import { validateConfirmPassword, validateEmail, validatePassword, validateUsername } from '../utils/validation';

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  icon: keyof typeof Feather.glyphMap;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  showToggle?: boolean;
  visible?: boolean;
  onToggleVisible?: () => void;
};

const AuthField = ({
  label,
  value,
  onChangeText,
  error,
  icon,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  showToggle,
  visible,
  onToggleVisible,
}: AuthFieldProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldBlock}>
      <GlassCard style={[styles.inputShell, focused && styles.inputFocused, error && styles.inputError]} intensity={focused ? 42 : 24}>
        <Feather name={icon} size={19} color={focused ? colors.primaryFixed : colors.onSurfaceVariant} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor={colors.onSurfaceVariant}
          style={styles.input}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry && !visible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {showToggle && (
          <TouchableOpacity onPress={onToggleVisible} style={styles.eyeButton}>
            <Feather name={visible ? 'eye-off' : 'eye'} size={19} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </GlassCard>
      {!!error && <Text style={styles.errorText}>{i18n.t(error)}</Text>}
    </View>
  );
};

const AuthLink = ({ prefix, action, onPress }: { prefix: string; action: string; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.authLink}>
    <Text style={styles.authLinkText}>
      {prefix} <Text style={styles.authLinkAction}>{action}</Text>
    </Text>
  </TouchableOpacity>
);

const LoadingIcon = () => <ActivityIndicator size="small" color={colors.primaryFixed} />;

export const LoginScreen = ({ navigation }: any) => {
  const { login, authActionLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const canSubmit = email.trim().length > 0 && password.length > 0 && !authActionLoading;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setSubmitError('');
    try {
      await login(email, password);
    } catch (error) {
      setSubmitError(mapFirebaseAuthError(error));
    }
  };

  return (
    <GradientMeshBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={[styles.authScroll, { paddingTop: Math.max(insets.top, 24) + 26, paddingBottom: Math.max(insets.bottom, 18) + 24 }]} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(450)} style={styles.logoBlock}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.authTitle}>{i18n.t('login_title')}</Text>
            <Text style={styles.authSubtitle}>{i18n.t('login_subtitle')}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.form}>
            <AuthField
              label={i18n.t('email')}
              value={email}
              onChangeText={setEmail}
              icon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AuthField
              label={i18n.t('password')}
              value={password}
              onChangeText={setPassword}
              icon="lock"
              secureTextEntry
              showToggle
              visible={passwordVisible}
              onToggleVisible={() => setPasswordVisible((value) => !value)}
            />
            {!!submitError && <Text style={styles.submitError}>{i18n.t(submitError)}</Text>}
            <GlassButton
              title={authActionLoading ? i18n.t('logging_in') : i18n.t('login')}
              disabled={!canSubmit}
              icon={authActionLoading ? <LoadingIcon /> : <Feather name="log-in" size={20} color={canSubmit ? colors.primaryFixed : colors.onSurfaceVariant} />}
              onPress={handleLogin}
              style={styles.submitButton}
            />
            <AuthLink prefix={i18n.t('dont_have_account')} action={i18n.t('register')} onPress={() => navigation.navigate('Register')} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientMeshBackground>
  );
};

export const RegisterScreen = ({ navigation }: any) => {
  const { register, authActionLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState('');

  const errors = useMemo(() => ({
    username: validateUsername(username),
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  }), [username, email, password, confirmPassword]);

  const isValid = !errors.username && !errors.email && !errors.password && !errors.confirmPassword;
  const canSubmit = isValid && !authActionLoading;

  const showAllErrors = () => setTouched({ username: true, email: true, password: true, confirmPassword: true });

  const handleRegister = async () => {
    showAllErrors();
    if (!canSubmit) return;
    setSubmitError('');
    try {
      await register(username, email, password);
    } catch (error) {
      setSubmitError(mapFirebaseAuthError(error));
    }
  };

  return (
    <GradientMeshBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={[styles.authScroll, { paddingTop: Math.max(insets.top, 24) + 28, paddingBottom: Math.max(insets.bottom, 18) + 24 }]} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(450)} style={styles.headerBlock}>
            <Text style={styles.authTitle}>{i18n.t('register_title')}</Text>
            <Text style={styles.authSubtitle}>{i18n.t('register_subtitle')}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.form}>
            <AuthField label={i18n.t('username')} value={username} onChangeText={setUsername} icon="user" error={touched.username ? errors.username : ''} />
            <AuthField label={i18n.t('email')} value={email} onChangeText={setEmail} icon="mail" keyboardType="email-address" autoCapitalize="none" error={touched.email ? errors.email : ''} />
            <AuthField
              label={i18n.t('password')}
              value={password}
              onChangeText={setPassword}
              icon="lock"
              secureTextEntry
              showToggle
              visible={passwordVisible}
              onToggleVisible={() => setPasswordVisible((value) => !value)}
              error={touched.password ? errors.password : ''}
            />
            <AuthField
              label={i18n.t('confirm_password')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon="check-circle"
              secureTextEntry
              showToggle
              visible={confirmVisible}
              onToggleVisible={() => setConfirmVisible((value) => !value)}
              error={touched.confirmPassword ? errors.confirmPassword : ''}
            />
            {!!submitError && <Text style={styles.submitError}>{i18n.t(submitError)}</Text>}
            <GlassButton
              title={authActionLoading ? i18n.t('registering') : i18n.t('register')}
              disabled={!canSubmit}
              icon={authActionLoading ? <LoadingIcon /> : <Feather name="user-plus" size={20} color={canSubmit ? colors.primaryFixed : colors.onSurfaceVariant} />}
              onPress={handleRegister}
              style={styles.submitButton}
            />
            <AuthLink prefix={i18n.t('already_have_account')} action={i18n.t('login')} onPress={() => navigation.navigate('Login')} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientMeshBackground>
  );
};

export const ProfilePictureSetupScreen = () => {
  const { uploadProfilePicture, finishProfileSetup, authActionLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [imageUri, setImageUri] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1.04, { duration: 850 }), withTiming(1, { duration: 850 })), -1, true);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: uploading ? pulse.value : 1 }],
  }));

  const pickImage = async (source: 'camera' | 'gallery') => {
    setSheetOpen(false);
    setError('');
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
      setImageUri(result.assets[0].uri);
    }
  };

  const saveAndContinue = async () => {
    if (!imageUri || uploading) return;
    setUploading(true);
    setError('');
    try {
      await uploadProfilePicture(imageUri);
      finishProfileSetup();
    } catch (err: any) {
      console.error('Cloudinary Upload Error:', err);
      setError(err?.message || 'Profile picture upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <GradientMeshBackground>
      <ScrollView contentContainerStyle={[styles.setupScroll, { paddingTop: Math.max(insets.top, 24) + 34, paddingBottom: Math.max(insets.bottom, 18) + 26 }]} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(450)} style={styles.headerBlock}>
          <Text style={styles.authTitle}>{i18n.t('profile_picture_title')}</Text>
          <Text style={styles.authSubtitle}>{i18n.t('profile_picture_subtitle')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.avatarSetupBlock}>
          <TouchableOpacity activeOpacity={0.86} onPress={() => setSheetOpen(true)} style={styles.avatarPress}>
            <GlassCard style={styles.profileAvatarShell} intensity={44}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.profileAvatarImage} />
              ) : (
                <Feather name="user" size={58} color={colors.primaryFixed} />
              )}
              <View style={styles.avatarAddBadge}>
                <Feather name="camera" size={20} color={colors.onPrimary} />
              </View>
            </GlassCard>
          </TouchableOpacity>
          {!!imageUri && (
            <TouchableOpacity onPress={() => setSheetOpen(true)}>
              <Text style={styles.changeProfileText}>{i18n.t('change')}</Text>
            </TouchableOpacity>
          )}
          {!!error && <Text style={styles.submitError}>{i18n.t(error)}</Text>}
        </Animated.View>

        <Animated.View style={[styles.setupActions, pulseStyle]}>
          <GlassButton
            title={uploading ? i18n.t('uploading') : i18n.t('save_continue')}
            disabled={!imageUri || uploading}
            icon={uploading ? <LoadingIcon /> : <Feather name="check" size={20} color={imageUri ? colors.primaryFixed : colors.onSurfaceVariant} />}
            onPress={saveAndContinue}
          />
          <GlassButton
            title={i18n.t('skip_for_now')}
            variant="secondary"
            disabled={uploading || authActionLoading}
            icon={<Feather name="arrow-right" size={20} color={colors.onSurface} />}
            onPress={finishProfileSetup}
          />
        </Animated.View>
      </ScrollView>

      <Modal visible={sheetOpen} transparent animationType="fade" onRequestClose={() => setSheetOpen(false)}>
        <Pressable style={[styles.modalScrim, { paddingBottom: Math.max(insets.bottom, 16) }]} onPress={() => setSheetOpen(false)}>
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

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  authScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  setupScroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  logoBlock: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
    marginBottom: 18,
  },
  headerBlock: {
    marginBottom: 28,
  },
  authTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    lineHeight: 39,
    color: colors.onSurface,
    textAlign: 'center',
  },
  authSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 23,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 9,
  },
  form: {
    gap: 14,
  },
  fieldBlock: {
    gap: 7,
  },
  inputShell: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: 0,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(104, 219, 169, 0.09)',
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  inputError: {
    borderColor: 'rgba(255, 180, 171, 0.65)',
  },
  input: {
    flex: 1,
    minHeight: 46,
    marginLeft: 12,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: colors.onSurface,
  },
  eyeButton: {
    padding: 8,
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.error,
    paddingHorizontal: 12,
  },
  submitError: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
    lineHeight: 19,
  },
  submitButton: {
    marginTop: 6,
  },
  authLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  authLinkText: {
    fontFamily: 'Inter_500Medium',
    color: colors.onSurfaceVariant,
    fontSize: 14,
  },
  authLinkAction: {
    color: colors.primaryFixed,
    fontFamily: 'Inter_700Bold',
  },
  avatarSetupBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  avatarPress: {
    borderRadius: 999,
  },
  profileAvatarShell: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'rgba(104, 219, 169, 0.1)',
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    marginBottom: 18,
  },
  profileAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
  },
  avatarAddBadge: {
    position: 'absolute',
    right: 12,
    bottom: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  changeProfileText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: colors.primaryFixed,
  },
  setupActions: {
    gap: 12,
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

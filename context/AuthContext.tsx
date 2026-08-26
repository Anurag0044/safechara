import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth/react-native';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { auth, db } from '../config/firebaseConfig';
import { uploadImageToCloudinary } from '../config/cloudinaryConfig';

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  profileImageUrl: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authActionLoading: boolean;
  pendingProfileSetup: boolean;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  uploadProfilePicture: (imageUri: string) => Promise<string>;
  finishProfileSetup: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const userProfileFromDoc = (uid: string, data: any): UserProfile => ({
  uid,
  username: data.username || '',
  email: data.email || '',
  profileImageUrl: data.profileImageUrl || '',
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

export const mapFirebaseAuthError = (error: unknown) => {
  const code = (error as { code?: string })?.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'auth_error_email_in_use';
    case 'auth/invalid-email':
      return 'auth_error_email_invalid';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'auth_error_wrong_password';
    case 'auth/user-not-found':
      return 'auth_error_user_not_found';
    case 'auth/weak-password':
      return 'auth_error_password_short';
    case 'auth/network-request-failed':
      return 'auth_error_network';
    default:
      return 'auth_error_generic';
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [pendingProfileSetup, setPendingProfileSetup] = useState(false);

  const fetchUserProfile = async (activeUser: User) => {
    const snapshot = await getDoc(doc(db, 'users', activeUser.uid));
    if (snapshot.exists()) {
      setUserProfile(userProfileFromDoc(activeUser.uid, snapshot.data()));
    } else {
      setUserProfile(null);
    }
  };

  const refreshUserProfile = async () => {
    if (auth.currentUser) {
      await fetchUserProfile(auth.currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        await fetchUserProfile(nextUser);
      } else {
        setUserProfile(null);
        setPendingProfileSetup(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (username: string, email: string, password: string) => {
    setAuthActionLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const profile: UserProfile = {
        uid: credential.user.uid,
        username: username.trim(),
        email: credential.user.email || email.trim(),
        profileImageUrl: '',
      };

      await setDoc(doc(db, 'users', credential.user.uid), {
        username: profile.username,
        email: profile.email,
        profileImageUrl: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setUserProfile(profile);
      setPendingProfileSetup(true);
    } finally {
      setAuthActionLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setAuthActionLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPendingProfileSetup(false);
    } finally {
      setAuthActionLoading(false);
    }
  };

  const logout = async () => {
    setAuthActionLoading(true);
    try {
      await signOut(auth);
    } finally {
      setAuthActionLoading(false);
    }
  };

  const uploadProfilePicture = async (imageUri: string) => {
    if (!auth.currentUser) {
      throw new Error('No authenticated user.');
    }

    const secureUrl = await uploadImageToCloudinary(imageUri);
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      profileImageUrl: secureUrl,
      updatedAt: serverTimestamp(),
    });
    await refreshUserProfile();
    return secureUrl;
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      userProfile,
      loading,
      authActionLoading,
      pendingProfileSetup,
      register,
      login,
      logout,
      refreshUserProfile,
      uploadProfilePicture,
      finishProfileSetup: () => setPendingProfileSetup(false),
    }),
    [user, userProfile, loading, authActionLoading, pendingProfileSetup]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

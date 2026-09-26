import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getActiveFirebaseConfig,
  saveFirebaseConfig,
  resetFirebaseConfig,
  FirebaseConfigType,
  DEFAULT_FIREBASE_CONFIG
} from "../firebase/config";
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  loginAnonymously,
  logoutUser,
  sendPasswordReset,
  updateProfileData,
  sendVerificationEmail,
  changePassword,
  RegisterParams
} from "../firebase/authService";
import { parseFirebaseAuthError, ParsedAuthError } from "../firebase/errors";

export interface AuthNotification {
  type: "success" | "info" | "warning";
  title?: string;
  message: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authError: ParsedAuthError | null;
  clearError: () => void;
  notification: AuthNotification | null;
  clearNotification: () => void;
  showNotification: (notif: AuthNotification) => void;
  config: FirebaseConfigType;
  updateConfig: (newConfig: FirebaseConfigType) => void;
  resetConfig: () => void;
  
  // Auth Operations
  register: (params: RegisterParams) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogleProvider: () => Promise<boolean>;
  loginGuest: () => Promise<boolean>;
  logout: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<boolean>;
  updateProfile: (displayName: string, photoURL?: string) => Promise<boolean>;
  sendEmailVerificationLink: () => Promise<boolean>;
  updateUserPassword: (newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<ParsedAuthError | null>(null);
  const [notification, setNotification] = useState<AuthNotification | null>(null);
  const [config, setConfig] = useState<FirebaseConfigType>(getActiveFirebaseConfig());

  // Listen to Firebase Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (error) => {
        const parsed = parseFirebaseAuthError(error, config.projectId);
        setAuthError(parsed);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [config.projectId]);

  // Auto clear notification after 6 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const clearError = () => setAuthError(null);
  const clearNotification = () => setNotification(null);
  const showNotification = (notif: AuthNotification) => setNotification(notif);

  const updateConfig = (newConfig: FirebaseConfigType) => {
    saveFirebaseConfig(newConfig);
    setConfig(newConfig);
    showNotification({
      type: "info",
      title: "Config Updated",
      message: "Firebase configuration updated. Please refresh the page if changing active project credentials."
    });
  };

  const resetConfig = () => {
    resetFirebaseConfig();
    setConfig(DEFAULT_FIREBASE_CONFIG);
    showNotification({
      type: "info",
      title: "Config Reset",
      message: "Reset configuration back to smart-robotics-e788b defaults."
    });
  };

  const register = async (params: RegisterParams): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await registerWithEmail(params);
      setCurrentUser(user);
      showNotification({
        type: "success",
        title: "Account Created!",
        message: `Welcome, ${params.displayName || user.email}! Registration successful.`
      });
      return true;
    } catch (err) {
      const parsed = parseFirebaseAuthError(err, config.projectId);
      setAuthError(parsed);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await loginWithEmail(email, password);
      setCurrentUser(user);
      showNotification({
        type: "success",
        title: "Signed In Successfully",
        message: `Welcome back, ${user.displayName || user.email}!`
      });
      return true;
    } catch (err) {
      const parsed = parseFirebaseAuthError(err, config.projectId);
      setAuthError(parsed);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleProvider = async (): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await loginWithGoogle();
      setCurrentUser(user);
      showNotification({
        type: "success",
        title: "Google Sign-In Successful",
        message: `Authenticated as ${user.displayName || user.email} via Google.`
      });
      return true;
    } catch (err) {
      const parsed = parseFirebaseAuthError(err, config.projectId);
      setAuthError(parsed);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginGuest = async (): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await loginAnonymously();
      setCurrentUser(user);
      showNotification({
        type: "info",
        title: "Guest Session Started",
        message: "Signed in as an anonymous guest user."
      });
      return true;
    } catch (err) {
      const parsed = parseFirebaseAuthError(err, config.projectId);
      setAuthError(parsed);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await logoutUser();
      setCurrentUser(null);
      showNotification({
        type: "info",
        title: "Signed Out",
        message: "You have been successfully logged out."
      });
    } catch (err) {
      const parsed = parseFirebaseAuthError(err, config.projectId);
      setAuthError(parsed);
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      await sendPasswordReset(email);
      showNotification({
        type: "success",
        title: "Reset Link Sent",
        message: `A password reset link has been dispatched to ${email}. Check your inbox!`
      });
      return true;
    } catch (err) {
      const parsed = parseFirebaseAuthError(err, config.projectId);
      setAuthError(parsed);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (displayName: string, photoURL?: string): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      await updateProfileData(displayName, photoURL);
      // Trigger user state reload
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setCurrentUser({ ...auth.currentUser });
      }
      showNotification({
        type: "success",
        title: "Profile Updated",
        message: "Your profile details have been saved."
      });
      return true;
    } catch (err) {
      const parsed = parseFirebaseAuthError(err, config.projectId);
      setAuthError(parsed);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendEmailVerificationLink = async (): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      await sendVerificationEmail();
      showNotification({
        type: "success",
        title: "Verification Email Sent",
        message: "Verification link sent to your email address."
      });
      return true;
    } catch (err) {
      const parsed = parseFirebaseAuthError(err, config.projectId);
      setAuthError(parsed);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserPassword = async (newPassword: string): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      await changePassword(newPassword);
      showNotification({
        type: "success",
        title: "Password Changed",
        message: "Your password was updated successfully."
      });
      return true;
    } catch (err) {
      const parsed = parseFirebaseAuthError(err, config.projectId);
      setAuthError(parsed);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    currentUser,
    loading,
    authError,
    clearError,
    notification,
    clearNotification,
    showNotification,
    config,
    updateConfig,
    resetConfig,
    register,
    login,
    loginWithGoogleProvider,
    loginGuest,
    logout,
    resetUserPassword,
    updateProfile,
    sendEmailVerificationLink,
    updateUserPassword
  }), [currentUser, loading, authError, notification, config]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

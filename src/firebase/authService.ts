import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword as fbUpdatePassword,
  User
} from "firebase/auth";
import { auth, googleProvider } from "./config";

export interface RegisterParams {
  email: string;
  password: string;
  displayName: string;
}

/**
 * Register a new user with Email and Password and set their display name
 */
export async function registerWithEmail({ email, password, displayName }: RegisterParams): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  
  if (displayName.trim()) {
    try {
      await updateProfile(credential.user, {
        displayName: displayName.trim()
      });
    } catch {
      // Non-fatal if profile update fails immediately after creation
    }
  }

  // Attempt to send email verification
  try {
    await sendEmailVerification(credential.user);
  } catch {
    // Non-fatal; user can trigger it manually from dashboard
  }

  return credential.user;
}

/**
 * Sign in existing user with Email and Password
 */
export async function loginWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

/**
 * Sign in or sign up with Google popup
 */
export async function loginWithGoogle(): Promise<User> {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

/**
 * Sign in as anonymous guest user for testing
 */
export async function loginAnonymously(): Promise<User> {
  const credential = await signInAnonymously(auth);
  return credential.user;
}

/**
 * Sign out the currently active user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Update current user's profile details
 */
export async function updateProfileData(displayName: string, photoURL?: string): Promise<void> {
  if (!auth.currentUser) throw new Error("No active user authenticated.");
  await updateProfile(auth.currentUser, {
    displayName: displayName.trim(),
    photoURL: photoURL?.trim() || undefined
  });
}

/**
 * Resend email verification link
 */
export async function sendVerificationEmail(): Promise<void> {
  if (!auth.currentUser) throw new Error("No active user authenticated.");
  await sendEmailVerification(auth.currentUser);
}

/**
 * Update password for currently signed-in user
 */
export async function changePassword(newPassword: string): Promise<void> {
  if (!auth.currentUser) throw new Error("No active user authenticated.");
  await fbUpdatePassword(auth.currentUser, newPassword);
}

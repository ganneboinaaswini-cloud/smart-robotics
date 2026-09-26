import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

export interface FirebaseConfigType {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfigType = {
  apiKey: "AIzaSyA929e6EG5zVHxOsWKoR-p5pvGW4MBjiJE",
  authDomain: "smart-robotics-e788b.firebaseapp.com",
  projectId: "smart-robotics-e788b",
  storageBucket: "smart-robotics-e788b.firebasestorage.app",
  messagingSenderId: "359679096757",
  appId: "1:359679096757:web:858fb034d03fc70afc0bfc",
  measurementId: "G-EQKJ3YDKH0"
};

const STORAGE_KEY = "smart_robotics_firebase_config";

export function getActiveFirebaseConfig(): FirebaseConfigType {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.apiKey && parsed.projectId) {
          return parsed;
        }
      }
    } catch {
      // Fallback to default
    }
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config: FirebaseConfigType) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
}

export function resetFirebaseConfig() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Initialize Firebase App
let appInstance: FirebaseApp;
let authInstance: Auth;
let googleProviderInstance: GoogleAuthProvider;
let analyticsInstance: Analytics | null = null;

export function initFirebase(customConfig?: FirebaseConfigType) {
  const config = customConfig || getActiveFirebaseConfig();
  
  if (getApps().length > 0) {
    appInstance = getApp();
  } else {
    appInstance = initializeApp(config);
  }

  authInstance = getAuth(appInstance);
  googleProviderInstance = new GoogleAuthProvider();
  googleProviderInstance.setCustomParameters({
    prompt: 'select_account'
  });

  if (typeof window !== "undefined" && config.measurementId) {
    isSupported().then((supported) => {
      if (supported) {
        analyticsInstance = getAnalytics(appInstance);
      }
    }).catch(() => {
      // Analytics may be blocked by ad-blockers or unsupported environments
    });
  }

  return {
    app: appInstance,
    auth: authInstance,
    googleProvider: googleProviderInstance,
    analytics: analyticsInstance
  };
}

// Default export instances initialized on load
const initialized = initFirebase();
export const app = initialized.app;
export const auth = initialized.auth;
export const googleProvider = initialized.googleProvider;
export const analytics = initialized.analytics;

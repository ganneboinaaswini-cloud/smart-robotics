import React, { useState } from "react";
import { Check, Copy, Code2, BookOpen, Terminal, Sparkles, Download } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const CodeExplorer: React.FC = () => {
  const { config } = useAuth();
  const [activeSnippet, setActiveSnippet] = useState<string>("init");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const snippets = [
    {
      id: "init",
      title: "1. Firebase Config & Init",
      desc: "Initialize Firebase App, Authentication, and Google Provider",
      filename: "firebase.js",
      code: `// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket}",
  messagingSenderId: "${config.messagingSenderId}",
  appId: "${config.appId}",
  measurementId: "${config.measurementId || "G-EQKJ3YDKH0"}"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Optional: Analytics (browser only)
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}`
    },
    {
      id: "register",
      title: "2. User Registration",
      desc: "Create new user with email & password, display name, and verification link",
      filename: "registerUser.js",
      code: `import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification 
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Register a new user
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 */
export async function registerUser(email, password, displayName) {
  try {
    // 1. Create account in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Registered user UID:", user.uid);

    // 2. Set user display name (optional)
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName
      });
    }

    // 3. Send email verification (optional)
    await sendEmailVerification(user);
    console.log("Verification email dispatched!");

    return user;
  } catch (error) {
    console.error("Firebase Registration Error:", error.code, error.message);
    throw error;
  }
}`
    },
    {
      id: "login",
      title: "3. User Login",
      desc: "Sign in an existing user with email and password",
      filename: "loginUser.js",
      code: `import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Sign in existing user with Email & Password
 * @param {string} email
 * @param {string} password
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("Signed in successfully:", user.email);
    return user;
  } catch (error) {
    // Common error codes:
    // 'auth/user-not-found'
    // 'auth/wrong-password'
    // 'auth/invalid-credential'
    // 'auth/too-many-requests'
    console.error("Firebase Login Error:", error.code, error.message);
    throw error;
  }
}`
    },
    {
      id: "google",
      title: "4. Google Sign-In",
      desc: "Authenticate users with Google OAuth popup window",
      filename: "googleAuth.js",
      code: `import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

/**
 * Authenticate with Google Popup
 */
export async function signInWithGoogle() {
  try {
    googleProvider.setCustomParameters({
      prompt: "select_account"
    });

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log("Google user signed in:", user.displayName, user.email);
    return user;
  } catch (error) {
    // Note: Make sure Google provider is enabled in Firebase Console!
    // Firebase Console > Authentication > Sign-in method > Google
    console.error("Google Auth Error:", error.code, error.message);
    throw error;
  }
}`
    },
    {
      id: "listener",
      title: "5. Auth State Listener",
      desc: "Detect user login / logout state changes in real-time",
      filename: "authObserver.js",
      code: `import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Subscribe to authentication state changes across page refreshes
export function subscribeToAuthState(callback) {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      console.log("Active user session:", user.uid, user.email);
      callback(user);
    } else {
      // User is signed out
      console.log("No active user session.");
      callback(null);
    }
  });

  // Call unsubscribe() when component unmounts
  return unsubscribe;
}`
    },
    {
      id: "reset",
      title: "6. Password Reset",
      desc: "Send password reset link to user's registered email",
      filename: "resetPassword.js",
      code: `import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Send password reset email
 * @param {string} email
 */
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully to:", email);
  } catch (error) {
    console.error("Password reset error:", error.code, error.message);
    throw error;
  }
}`
    },
    {
      id: "logout",
      title: "7. Sign Out",
      desc: "Terminate the current session and sign out",
      filename: "logout.js",
      code: `import { signOut } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Sign out the current user
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log("User successfully signed out.");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}`
    }
  ];

  const current = snippets.find((s) => s.id === activeSnippet) || snippets[0];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadAll = () => {
    const combined = snippets.map(s => `// ==========================================\n// File: ${s.filename} (${s.title})\n// Description: ${s.desc}\n// ==========================================\n${s.code}\n`).join("\n\n");
    const blob = new Blob([combined], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `firebase-auth-${config.projectId}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Intro banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Firebase Authentication Code Hub
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Production-ready JavaScript / TypeScript snippets tailored directly for your project{" "}
            <span className="font-mono text-cyan-400 font-semibold">{config.projectId}</span>.
            Copy individual modules or download the full auth suite.
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="self-start md:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          Download All Snippets (.js)
        </button>
      </div>

      {/* Code Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Modules & SDK Snippets
          </p>
          {snippets.map((snip) => (
            <button
              key={snip.id}
              onClick={() => setActiveSnippet(snip.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-0.5 ${
                activeSnippet === snip.id
                  ? "bg-cyan-950/80 border-cyan-500/50 shadow-md shadow-cyan-500/10 text-white"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{snip.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
                  {snip.filename}
                </span>
              </div>
              <p className="text-[11px] opacity-75 line-clamp-1">{snip.desc}</p>
            </button>
          ))}
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="font-mono text-xs text-slate-300 font-semibold pl-2">
                {current.filename}
              </span>
            </div>

            <button
              onClick={() => handleCopy(current.id, current.code)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all"
            >
              {copiedKey === current.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Description banner */}
          <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{current.desc}</span>
          </div>

          {/* Code pre block */}
          <div className="p-4 overflow-x-auto flex-1 font-mono text-xs leading-relaxed text-slate-200 select-all">
            <pre>
              <code>{current.code}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Integration Guide Box */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Quick Installation & Setup Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-1">Step 1: Install Firebase</span>
            <p className="text-slate-400 mb-2">Run npm in your terminal to install the official SDK:</p>
            <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-200">
              npm install firebase
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-1">Step 2: Enable Providers</span>
            <p className="text-slate-400 leading-relaxed">
              Open your Firebase Console, navigate to <strong>Authentication &gt; Sign-in method</strong>, and enable
              &quot;Email/Password&quot; and &quot;Google&quot;.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-1">Step 3: Authorized Domains</span>
            <p className="text-slate-400 leading-relaxed">
              Under <strong>Authentication &gt; Settings &gt; Authorized Domains</strong>, make sure your app host is added.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

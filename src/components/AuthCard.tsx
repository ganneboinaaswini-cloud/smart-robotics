import React, { useState, useId } from "react";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ExternalLink,
  AlertCircle,
  X,
  CheckCircle,
  KeyRound,
  Shield,
  HelpCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

type AuthMode = "login" | "register" | "forgot";

export const AuthCard: React.FC = () => {
  const {
    register,
    login,
    loginWithGoogleProvider,
    loginGuest,
    resetUserPassword,
    loading,
    authError,
    clearError,
    config
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [clientValidationMsg, setClientValidationMsg] = useState<string | null>(null);

  const emailInputId = useId();
  const passwordInputId = useId();
  const confirmPasswordInputId = useId();
  const nameInputId = useId();

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-slate-700" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak (Min 6 chars)", color: "bg-red-500" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
    if (score === 3 || score === 4) return { score: 3, label: "Good", color: "bg-cyan-500" };
    return { score: 4, label: "Strong & Secure", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  const handleModeChange = (newMode: AuthMode) => {
    clearError();
    setClientValidationMsg(null);
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setClientValidationMsg(null);

    // Basic client validation
    if (!email.trim()) {
      setClientValidationMsg("Please enter an email address.");
      return;
    }

    if (mode === "forgot") {
      const success = await resetUserPassword(email.trim());
      if (success) {
        setEmail("");
        setMode("login");
      }
      return;
    }

    if (!password) {
      setClientValidationMsg("Please enter a password.");
      return;
    }

    if (mode === "register") {
      if (password.length < 6) {
        setClientValidationMsg("Firebase passwords must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setClientValidationMsg("Passwords do not match. Please verify.");
        return;
      }
      if (!acceptTerms) {
        setClientValidationMsg("Please accept the terms and privacy conditions to proceed.");
        return;
      }

      await register({
        email: email.trim(),
        password,
        displayName: displayName.trim() || email.split("@")[0]
      });
    } else {
      // Login
      await login(email.trim(), password);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Decorative Glow */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-60" />

        <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800/50 mb-3 shadow-inner shadow-cyan-500/20">
              {mode === "login" && <KeyRound className="w-6 h-6 text-cyan-400" />}
              {mode === "register" && <Shield className="w-6 h-6 text-cyan-400" />}
              {mode === "forgot" && <HelpCircle className="w-6 h-6 text-amber-400" />}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {mode === "login" && "Sign In to Your Account"}
              {mode === "register" && "Create an Account"}
              {mode === "forgot" && "Reset Password"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {mode === "login" && "Enter your credentials to access the Smart Robotics platform."}
              {mode === "register" && "Get started with full Firebase Authentication in seconds."}
              {mode === "forgot" && "We'll send a secure reset link to your registered email."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== "forgot" ? (
            <div className="grid grid-cols-2 p-1 bg-slate-950/70 border border-slate-800 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => handleModeChange("login")}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  mode === "login"
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("register")}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  mode === "register"
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Register
              </button>
            </div>
          ) : (
            <div className="mb-6 flex justify-start">
              <button
                type="button"
                onClick={() => handleModeChange("login")}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* Firebase Error Alert Banner */}
          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 text-xs animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError.title}</span>
                </div>
                <button
                  type="button"
                  onClick={clearError}
                  className="text-red-400/70 hover:text-red-300 p-0.5"
                  aria-label="Dismiss error"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="leading-relaxed text-red-300/90 mb-2">{authError.message}</p>
              
              {authError.actionHint && (
                <div className="p-2 rounded bg-black/40 border border-red-900/50 text-[11px] text-red-200/90 mb-1">
                  💡 <strong className="text-white">Tip:</strong> {authError.actionHint}
                </div>
              )}

              {authError.consoleLink && (
                <a
                  href={authError.consoleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 underline mt-1.5"
                >
                  Open Firebase Console to Enable <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Client Validation Alert */}
          {clientValidationMsg && (
            <div className="mb-5 p-3 rounded-xl bg-amber-950/70 border border-amber-800/80 text-amber-200 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{clientValidationMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setClientValidationMsg(null)}
                className="text-amber-400 hover:text-amber-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name for Registration */}
            {mode === "register" && (
              <div>
                <label htmlFor={nameInputId} className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name or Robotics Handle
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id={nameInputId}
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Dr. Alex Rivera"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-white placeholder-slate-500 text-sm transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor={emailInputId} className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id={emailInputId}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@smart-robotics.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-white placeholder-slate-500 text-sm transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field (only for login or register) */}
            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor={passwordInputId} className="block text-xs font-medium text-slate-300">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => handleModeChange("forgot")}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id={passwordInputId}
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-white placeholder-slate-500 text-sm transition-all outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator for Registration */}
                {mode === "register" && password && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Strength:</span>
                      <span className="font-semibold text-slate-300">{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full transition-all duration-300 ${
                            step <= strength.score ? strength.color : "bg-slate-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Password Field (for register) */}
            {mode === "register" && (
              <div>
                <label htmlFor={confirmPasswordInputId} className="block text-xs font-medium text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id={confirmPasswordInputId}
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-white placeholder-slate-500 text-sm transition-all outline-none font-mono"
                  />
                  {confirmPassword && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                      {confirmPassword === password ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Checkbox Options */}
            {mode === "login" && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0 w-3.5 h-3.5"
                  />
                  Remember my session
                </label>
              </div>
            )}

            {mode === "register" && (
              <div className="flex items-start gap-2 text-xs pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0 w-3.5 h-3.5 mt-0.5"
                />
                <label htmlFor="terms" className="text-slate-400 leading-snug cursor-pointer select-none">
                  I agree to the <span className="text-slate-300 underline">Terms of Service</span> and acknowledge Firebase will handle authentication records.
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" && "Sign In with Email"}
                  {mode === "register" && "Register Account"}
                  {mode === "forgot" && "Send Password Reset Link"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins & Alternate Access */}
          {mode !== "forgot" && (
            <div className="mt-6">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[11px] uppercase tracking-wider text-slate-500">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={loginWithGoogleProvider}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all disabled:opacity-50"
                  title="Sign in with Google OAuth Popup"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google
                </button>

                {/* Anonymous Guest Login */}
                <button
                  type="button"
                  onClick={loginGuest}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-all disabled:opacity-50"
                  title="Test login as anonymous Firebase guest user"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Guest Demo
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Connected to Firebase Project: <span className="font-mono text-slate-400">{config.projectId}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

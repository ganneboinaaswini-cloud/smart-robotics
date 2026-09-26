import React, { useState } from "react";
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  LogOut,
  KeyRound,
  Calendar,
  Clock,
  Cpu,
  RefreshCw,
  Edit2,
  ExternalLink,
  Code
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const UserProfile: React.FC = () => {
  const {
    currentUser,
    logout,
    updateProfile,
    sendEmailVerificationLink,
    updateUserPassword,
    loading,
    authError
  } = useAuth();

  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.displayName || "");
  const [editPhoto, setEditPhoto] = useState(currentUser?.photoURL || "");

  // Change password state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // Token inspector
  const [showTokenInspector, setShowTokenInspector] = useState(false);
  const [rawToken, setRawToken] = useState<string>("");
  const [tokenLoading, setTokenLoading] = useState(false);

  if (!currentUser) return null;

  const handleCopyUid = () => {
    navigator.clipboard.writeText(currentUser.uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleInspectToken = async () => {
    setShowTokenInspector(true);
    setTokenLoading(true);
    try {
      const token = await currentUser.getIdToken(true);
      setRawToken(token);
    } catch {
      setRawToken("Failed to retrieve Firebase ID token.");
    } finally {
      setTokenLoading(false);
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(rawToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(editName, editPhoto);
    if (success) {
      setIsEditingProfile(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword.length < 6) {
      setPasswordMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg("Passwords do not match.");
      return;
    }

    const success = await updateUserPassword(newPassword);
    if (success) {
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPasswordChange(false);
    }
  };

  const creationTime = currentUser.metadata.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleString()
    : "N/A";
  const lastSignInTime = currentUser.metadata.lastSignInTime
    ? new Date(currentUser.metadata.lastSignInTime).toLocaleString()
    : "N/A";

  const providers = currentUser.providerData.map((p) => p.providerId);
  if (currentUser.isAnonymous) providers.push("anonymous");

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cyan-600/20 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-2xl overflow-hidden shadow-lg shadow-cyan-500/20">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  currentUser.displayName ? currentUser.displayName[0].toUpperCase() : <UserIcon className="w-8 h-8 text-cyan-400" />
                )}
              </div>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg shadow-md transition-colors"
                title="Edit Profile"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentUser.displayName || "Smart Robotics Operator"}
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Authenticated
                </span>
              </div>
              <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {currentUser.email || "Anonymous Guest Session"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            <button
              onClick={logout}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-red-300 hover:text-red-100 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 rounded-xl transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Drawer / Panel */}
      {isEditingProfile && (
        <div className="bg-slate-900 border border-cyan-800/60 rounded-2xl p-5 shadow-xl animate-in fade-in duration-200">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-cyan-400" />
            Update Firebase Profile Information
          </h2>
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Dr. Alex Rivera"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                value={editPhoto}
                onChange={(e) => setEditPhoto(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:border-cyan-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid: Account Details & Security Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Firebase Account Details */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Firebase Credentials
            </h2>
            <span className="text-[11px] font-mono text-slate-500">Firebase v11.x</span>
          </div>

          {/* User ID */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Unique Firebase User ID (UID):</span>
            <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <span className="truncate">{currentUser.uid}</span>
              <button
                onClick={handleCopyUid}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors shrink-0"
                title="Copy UID"
              >
                {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Email Verification */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Email Verification Status:</span>
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                {currentUser.emailVerified ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Verified</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 font-semibold">Unverified</span>
                  </>
                )}
              </div>
              {!currentUser.emailVerified && !currentUser.isAnonymous && (
                <button
                  onClick={sendEmailVerificationLink}
                  disabled={loading}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
                >
                  Send Verification Link
                </button>
              )}
            </div>
          </div>

          {/* Providers */}
          <div>
            <span className="text-xs text-slate-400 block mb-1.5">Sign-in Providers:</span>
            <div className="flex flex-wrap gap-2">
              {providers.map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-1 text-[11px] font-mono bg-slate-950 border border-slate-800 text-slate-300 rounded-lg flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800/80">
            <div>
              <span className="text-slate-500 flex items-center gap-1 mb-0.5">
                <Calendar className="w-3 h-3" /> Created
              </span>
              <p className="text-slate-300 text-[11px] font-mono">{creationTime}</p>
            </div>
            <div>
              <span className="text-slate-500 flex items-center gap-1 mb-0.5">
                <Clock className="w-3 h-3" /> Last Sign In
              </span>
              <p className="text-slate-300 text-[11px] font-mono">{lastSignInTime}</p>
            </div>
          </div>
        </div>

        {/* Security & Token Inspector */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              Security & Credentials
            </h2>
            <span className="text-[11px] text-emerald-400 font-semibold">Active Session</span>
          </div>

          {/* Change Password Trigger */}
          {!currentUser.isAnonymous && (
            <div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <p className="text-xs font-semibold text-white">Account Password</p>
                  <p className="text-[11px] text-slate-400">Update your Firebase password</p>
                </div>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  {showPasswordChange ? "Hide Form" : "Change Password"}
                </button>
              </div>

              {/* Password change form */}
              {showPasswordChange && (
                <form onSubmit={handleChangePasswordSubmit} className="mt-3 p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3">
                  {passwordMsg && (
                    <p className="text-xs text-amber-400">{passwordMsg}</p>
                  )}
                  {authError && (
                    <p className="text-xs text-red-400">{authError.message}</p>
                  )}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs font-mono outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs font-mono outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                  >
                    Confirm & Update Password
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Firebase ID Token Inspector */}
          <div>
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <p className="text-xs font-semibold text-white">JWT / ID Token Inspector</p>
                <p className="text-[11px] text-slate-400">Generate fresh Bearer token for API calls</p>
              </div>
              <button
                onClick={handleInspectToken}
                disabled={tokenLoading}
                className="px-3 py-1.5 text-xs font-semibold bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {tokenLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Code className="w-3.5 h-3.5" />}
                Get Token
              </button>
            </div>

            {showTokenInspector && (
              <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Authorization: Bearer &lt;token&gt;</span>
                  <button
                    onClick={handleCopyToken}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedToken ? "Copied!" : "Copy Token"}
                  </button>
                </div>
                <div className="max-h-24 overflow-y-auto p-2 bg-slate-900 rounded font-mono text-[10px] text-slate-400 break-all select-all">
                  {rawToken}
                </div>
              </div>
            )}
          </div>

          {/* Simulated Robotics Gateway Access */}
          <div className="p-3.5 bg-gradient-to-br from-slate-950 to-cyan-950/30 border border-cyan-900/40 rounded-xl">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Robotics Fleet Access Gateway
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded">
                AUTHORIZED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Identity validated via Firebase. Security context established for Smart Robotics telemetry and controller endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

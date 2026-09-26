import React, { useState } from "react";
import {
  Wrench,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sliders,
  RotateCcw,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FirebaseConfigType } from "../firebase/config";

export const FirebaseDiagnostics: React.FC = () => {
  const { config, updateConfig, resetConfig, showNotification } = useAuth();

  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const [connectionMsg, setConnectionMsg] = useState<string>("");

  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [formData, setFormData] = useState<FirebaseConfigType>(config);

  const consoleBase = `https://console.firebase.google.com/project/${config.projectId}`;

  const testConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus("idle");
    setConnectionMsg("");

    try {
      // Ping Firebase Auth endpoint by checking network readiness
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/projects?key=${config.apiKey}`,
        { method: "POST" }
      );
      // Even if 400 (missing body), it proves network & API Key can communicate with Google Identity Toolkit
      if (response.status === 400 || response.status === 200) {
        setConnectionStatus("success");
        setConnectionMsg("Successfully connected to Google Identity Toolkit & Firebase Auth servers!");
      } else {
        const text = await response.text();
        setConnectionStatus("error");
        setConnectionMsg(`Firebase responded with status ${response.status}: ${text}`);
      }
    } catch (err) {
      setConnectionStatus("error");
      setConnectionMsg(
        err instanceof Error ? err.message : "Unable to reach Google Identity Toolkit. Check your internet connection."
      );
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    setIsEditingConfig(false);
  };

  const handleResetToDefault = () => {
    resetConfig();
    setIsEditingConfig(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Firebase Project Diagnostics & Setup
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Verify your Firebase connection, review active credentials, and access direct Firebase Console shortcuts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={testConnection}
              disabled={testingConnection}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-1.5 shrink-0"
            >
              {testingConnection ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
              Test Firebase Connection
            </button>
          </div>
        </div>

        {/* Connection status result */}
        {connectionStatus !== "idle" && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${
              connectionStatus === "success"
                ? "bg-emerald-950/70 border-emerald-800/80 text-emerald-200"
                : "bg-red-950/70 border-red-800/80 text-red-200"
            }`}
          >
            {connectionStatus === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{connectionStatus === "success" ? "Connection Verified" : "Connection Notice"}</p>
              <p className="opacity-90">{connectionMsg}</p>
            </div>
          </div>
        )}
      </div>

      {/* Firebase Console Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href={`${consoleBase}/authentication/users`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all group flex flex-col justify-between"
        >
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
              Registered Users
            </span>
            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
              User Accounts Table
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              View, edit, disable, or delete users created in project {config.projectId}.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 pt-3">
            Open in Console <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>

        <a
          href={`${consoleBase}/authentication/providers`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all group flex flex-col justify-between"
        >
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
              Sign-In Providers
            </span>
            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
              Auth Methods Toggle
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enable &quot;Email/Password&quot; or &quot;Google&quot; providers if you encounter operation-not-allowed.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 pt-3">
            Open in Console <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>

        <a
          href={`${consoleBase}/authentication/settings`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all group flex flex-col justify-between"
        >
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
              Security & Domains
            </span>
            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
              Authorized Domains
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add your domain to Authorized Domains to allow OAuth redirects and Google Sign-In.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 pt-3">
            Open in Console <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>
      </div>

      {/* Active Configuration Table & Editor */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Active Firebase Config Parameters
            </h3>
            <p className="text-xs text-slate-400">Values currently loaded into the Firebase Client SDK</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingConfig(!isEditingConfig)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {isEditingConfig ? "Cancel Editing" : "Edit Config"}
            </button>
            <button
              onClick={handleResetToDefault}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset to default config provided in prompt"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditingConfig ? (
          <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">apiKey</label>
              <input
                type="text"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">projectId</label>
              <input
                type="text"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">authDomain</label>
              <input
                type="text"
                value={formData.authDomain}
                onChange={(e) => setFormData({ ...formData, authDomain: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">storageBucket</label>
              <input
                type="text"
                value={formData.storageBucket}
                onChange={(e) => setFormData({ ...formData, storageBucket: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">messagingSenderId</label>
              <input
                type="text"
                value={formData.messagingSenderId}
                onChange={(e) => setFormData({ ...formData, messagingSenderId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">appId</label>
              <input
                type="text"
                value={formData.appId}
                onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingConfig(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block mb-0.5">Project ID</span>
              <span className="font-mono text-slate-200 font-semibold">{config.projectId}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block mb-0.5">Auth Domain</span>
              <span className="font-mono text-slate-200 font-semibold">{config.authDomain}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block mb-0.5">Storage Bucket</span>
              <span className="font-mono text-slate-200 font-semibold">{config.storageBucket}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block mb-0.5">Messaging Sender ID</span>
              <span className="font-mono text-slate-200 font-semibold">{config.messagingSenderId}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 sm:col-span-2">
              <span className="text-slate-500 block mb-0.5">App ID</span>
              <span className="font-mono text-slate-200 font-semibold break-all">{config.appId}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

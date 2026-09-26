import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar, ActiveTab } from "./components/Navbar";
import { AuthCard } from "./components/AuthCard";
import { UserProfile } from "./components/UserProfile";
import { CodeExplorer } from "./components/CodeExplorer";
import { FirebaseDiagnostics } from "./components/FirebaseDiagnostics";
import { NotificationToast } from "./components/NotificationToast";
import { Bot, Shield, Code, Sparkles, CheckCircle2 } from "lucide-react";

function MainContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("auth");
  const { currentUser, notification, clearNotification, loading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Ambient Grid & Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Sub-header hero for Auth Portal */}
        {activeTab === "auth" && !currentUser && (
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart Robotics Firebase Authentication</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Secure Identity &amp; Access Gateway
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Register new operators or log in with verified Firebase credentials.
              Fully integrated with project <span className="font-mono text-cyan-400 font-semibold">smart-robotics-e788b</span>.
            </p>
          </div>
        )}

        {/* Tab 1: Auth Experience (Auth Card or User Profile) */}
        {activeTab === "auth" && (
          <div className="animate-in fade-in duration-300">
            {currentUser ? (
              <UserProfile />
            ) : (
              <AuthCard />
            )}
          </div>
        )}

        {/* Tab 2: Code Snippets & Guide */}
        {activeTab === "code" && (
          <div className="animate-in fade-in duration-300">
            <CodeExplorer />
          </div>
        )}

        {/* Tab 3: Project Diagnostics & Setup */}
        {activeTab === "diagnostics" && (
          <div className="animate-in fade-in duration-300">
            <FirebaseDiagnostics />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-400">Smart Robotics</span>
            <span className="text-slate-600">|</span>
            <span>Firebase Auth v11</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Client SDK: <strong className="text-slate-400 font-mono">firebase/auth</strong></span>
            <span>•</span>
            <button
              onClick={() => setActiveTab("code")}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              View Integration Code
            </button>
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <NotificationToast notification={notification} onClose={clearNotification} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

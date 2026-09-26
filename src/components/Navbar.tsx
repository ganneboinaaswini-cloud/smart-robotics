import React from "react";
import { Bot, Code2, ShieldCheck, Wrench, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export type ActiveTab = "auth" | "code" | "diagnostics";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout, config } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-cyan-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                  Smart Robotics
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                  Firebase Auth
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate max-w-[150px] sm:max-w-[220px]" title={config.projectId}>
                  Project: <strong className="text-slate-300 font-mono">{config.projectId}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("auth")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "auth"
                  ? "bg-cyan-600 text-white shadow-sm shadow-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Auth Portal
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "code"
                  ? "bg-cyan-600 text-white shadow-sm shadow-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Code2 className="w-4 h-4" />
              SDK Code & Guide
            </button>
            <button
              onClick={() => setActiveTab("diagnostics")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "diagnostics"
                  ? "bg-cyan-600 text-white shadow-sm shadow-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Wrench className="w-4 h-4" />
              Firebase Setup
            </button>
          </nav>

          {/* User state or Action */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-300 overflow-hidden">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    currentUser.displayName ? currentUser.displayName[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                    {currentUser.displayName || currentUser.email?.split("@")[0] || "Guest User"}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {currentUser.isAnonymous ? "Guest Mode" : "Signed In"}
                  </p>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("auth")}
                className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 hover:border-cyan-700 px-3 py-1.5 rounded-xl transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Tab Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-900 text-xs">
          <button
            onClick={() => setActiveTab("auth")}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-medium ${
              activeTab === "auth" ? "bg-cyan-600 text-white" : "text-slate-400"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Portal
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-medium ${
              activeTab === "code" ? "bg-cyan-600 text-white" : "text-slate-400"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Code
          </button>
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg font-medium ${
              activeTab === "diagnostics" ? "bg-cyan-600 text-white" : "text-slate-400"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Setup
          </button>
        </div>
      </div>
    </header>
  );
};

import React from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { AuthNotification } from "../context/AuthContext";

interface Props {
  notification: AuthNotification | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<Props> = ({ notification, onClose }) => {
  if (!notification) return null;

  const getTheme = () => {
    switch (notification.type) {
      case "success":
        return {
          bg: "bg-emerald-950/80 border-emerald-500/50 text-emerald-200",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        };
      case "warning":
        return {
          bg: "bg-amber-950/80 border-amber-500/50 text-amber-200",
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        };
      case "info":
      default:
        return {
          bg: "bg-cyan-950/80 border-cyan-500/50 text-cyan-200",
          icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 ${theme.bg}`}>
        {theme.icon}
        <div className="flex-1 min-w-0">
          {notification.title && (
            <p className="font-semibold text-sm leading-tight text-white mb-0.5">
              {notification.title}
            </p>
          )}
          <p className="text-xs opacity-90 leading-relaxed break-words">
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

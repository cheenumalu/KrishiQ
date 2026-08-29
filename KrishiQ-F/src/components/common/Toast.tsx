import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useKrishiQ();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
        }[toast.type];

        const border = {
          success: "border-emerald-200 bg-emerald-50/90 text-emerald-950",
          warning: "border-amber-200 bg-amber-50/90 text-amber-950",
          error: "border-rose-200 bg-rose-50/90 text-rose-950",
          info: "border-sky-200 bg-white text-slate-900",
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={
              "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm transition-all animate-in fade-in slide-in-from-bottom-2 " +
              border
            }
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
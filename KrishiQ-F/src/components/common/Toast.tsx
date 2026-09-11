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
          success: <CheckCircle2 className="w-5 h-5 text-[#2F7D4A] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#F2A93B] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#D95555] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#2F7D4A] shrink-0" />,
        }[toast.type];

        const border = {
          success: "border-[#58A66B]/30 bg-[#EEF5EF] text-[#123D2D] dark:bg-[#1A3125] dark:text-[#F0F5F1] dark:border-[#23362B]",
          warning: "border-[#F2A93B]/40 bg-[#FEF5E7] text-[#9A6210] dark:bg-[#2A2315] dark:text-[#F2A93B] dark:border-[#F2A93B]/30",
          error: "border-[#D95555]/30 bg-[#FDF2F2] text-[#9B2C2C] dark:bg-[#2A1515] dark:text-[#FCA5A5] dark:border-[#D95555]/30",
          info: "border-[#E4E9E5] bg-white text-[#111813] dark:bg-[#142019] dark:text-[#F0F5F1] dark:border-[#23362B]",
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
              <p className="text-xs text-[#404A43] dark:text-[#CBD5E1] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#66736C] hover:text-[#111813] dark:text-[#94A3B8] dark:hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
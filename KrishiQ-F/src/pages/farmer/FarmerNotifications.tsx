import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { Bell, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export const FarmerNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead } = useKrishiQ();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      
      {/* Header */}
      <div className="space-y-0.5 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Notifications & Alerts
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Official SMS and system advisories regarding your procurement schedule.
        </p>
      </div>

      <Card padding="none" className="border-slate-300 overflow-hidden divide-y divide-slate-200">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationAsRead(n.id)}
            className={
              "p-4 hover:bg-slate-50 transition-colors text-xs flex items-start justify-between gap-4 " +
              (!n.read ? "bg-emerald-50/30" : "")
            }
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <strong className="text-sm font-bold text-slate-900">{n.title}</strong>
                {!n.read && (
                  <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-slate-700 leading-relaxed">{n.message}</p>
            </div>

            <span className="text-[11px] text-slate-400 font-mono shrink-0">
              {n.timestamp}
            </span>
          </div>
        ))}
      </Card>

    </div>
  );
};
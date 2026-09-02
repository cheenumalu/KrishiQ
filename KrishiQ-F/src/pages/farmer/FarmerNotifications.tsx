import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { Card } from "../../components/common/Card";

export const FarmerNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead } = useKrishiQ();
  const { t, isHindi } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      
      {/* Header */}
      <div className="space-y-1 pb-1 border-b border-[#E4E9E5]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
          {t("farmer.notificationsTitle")}
        </h1>
        <p className="text-sm text-[#66736B] font-medium">
          {t("farmer.notificationsSubheading")}
        </p>
      </div>

      <Card padding="none" className="border-[#E4E9E5] card-shadow overflow-hidden divide-y divide-[#E4E9E5]">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#66736B]">
            {t("farmer.noNewNotifications")}
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={
                "p-4 hover:bg-[#F6F8F4] transition-colors text-xs flex items-start justify-between gap-4 cursor-pointer " +
                (!n.read ? "bg-[#EEF5EF]/60" : "")
              }
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-bold text-[#17211B]">{n.title}</strong>
                  {!n.read && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EEF5EF] text-[#123D2D] text-[10px] font-bold border border-[#58A66B]/30">
                      {isHindi ? "नया" : "NEW"}
                    </span>
                  )}
                </div>
                <p className="text-[#66736B] leading-relaxed">{n.message}</p>
              </div>

              <span className="text-[11px] text-[#8A958E] font-mono shrink-0">
                {n.timestamp}
              </span>
            </div>
          ))
        )}
      </Card>

    </div>
  );
};
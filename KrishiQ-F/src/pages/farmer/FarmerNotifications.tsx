import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { Eye, EyeOff } from "lucide-react";
import { Card } from "../../components/common/Card";

export const FarmerNotifications: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    toggleNotificationRead,
    markAllNotificationsAsRead,
    unreadNotifsCount
  } = useKrishiQ();
  const { t, isHindi } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#E4E9E5]">
        <div className="space-y-0.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
            {t("farmer.notificationsTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-[#66736B] font-medium">
            {t("farmer.notificationsSubheading")}
          </p>
        </div>

        {unreadNotifsCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF5EF] text-[#2F7D4A] hover:bg-[#58A66B]/20 border border-[#58A66B]/30 text-xs font-bold transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isHindi ? "सभी को पढ़ा हुआ चिह्नित करें" : "Mark all as read"}</span>
          </button>
        )}
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
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <strong className={`text-sm font-bold ${!n.read ? "text-[#123D2D]" : "text-[#17211B]"}`}>
                    {n.title}
                  </strong>
                  {!n.read && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EEF5EF] text-[#123D2D] text-[10px] font-bold border border-[#58A66B]/30">
                      {isHindi ? "नया" : "NEW"}
                    </span>
                  )}
                </div>
                <p className="text-[#66736B] leading-relaxed">{n.message}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-[#8A958E] font-mono">
                  {n.timestamp}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNotificationRead(n.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    !n.read
                      ? "text-[#2F7D4A] bg-[#EEF5EF] hover:bg-[#58A66B]/20"
                      : "text-[#8A958E] hover:text-[#17211B] hover:bg-[#EEF5EF]"
                  }`}
                  title={
                    !n.read
                      ? (isHindi ? "पढ़ा हुआ चिह्नित करें" : "Mark as read")
                      : (isHindi ? "अनदेखा चिह्नित करें" : "Mark as unread")
                  }
                  aria-label={!n.read ? "Mark as read" : "Mark as unread"}
                >
                  {!n.read ? (
                    <Eye className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <EyeOff className="w-4 h-4 opacity-50" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </Card>

    </div>
  );
};
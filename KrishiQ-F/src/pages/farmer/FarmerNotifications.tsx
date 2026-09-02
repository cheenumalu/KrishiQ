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
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#E4E9E5] dark:border-[#22352A]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] dark:text-[#F0F5F1] tracking-tight">
              {t("farmer.notificationsTitle")}
            </h1>
            {unreadNotifsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#2F7D4A]/10 text-[#2F7D4A] dark:bg-[#2F7D4A]/20 dark:text-[#4ADE80] text-xs font-bold">
                {unreadNotifsCount} {isHindi ? "नया" : "new"}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#66736B] dark:text-[#A0B0A6] font-medium">
            {t("farmer.notificationsSubheading")}
          </p>
        </div>

        {unreadNotifsCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF5EF] text-[#2F7D4A] dark:bg-[#1C3325] dark:text-[#4ADE80] hover:bg-[#58A66B]/20 border border-[#58A66B]/30 text-xs font-bold transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isHindi ? "सभी को पढ़ा हुआ चिह्नित करें" : "Mark all as read"}</span>
          </button>
        )}
      </div>

      <Card padding="none" className="border-[#E4E9E5] dark:border-[#243B2E] card-shadow overflow-hidden divide-y divide-[#E4E9E5] dark:divide-[#22352A]">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#66736B] dark:text-[#8E9F94]">
            {t("farmer.noNewNotifications")}
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-4 hover:bg-[#F6F8F4] dark:hover:bg-[#18291F] transition-colors text-xs flex items-start gap-3.5 cursor-pointer ${
                !n.read ? "bg-[#2F7D4A]/[0.03] dark:bg-[#2F7D4A]/[0.08]" : ""
              }`}
            >
              {/* Unread indicator dot */}
              <div className="pt-1 shrink-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full block ${
                    !n.read
                      ? "bg-[#2F7D4A] dark:bg-[#4ADE80] ring-4 ring-[#2F7D4A]/15"
                      : "bg-transparent"
                  }`}
                />
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <strong
                    className={`text-sm tracking-tight ${
                      !n.read
                        ? "font-bold text-[#17211B] dark:text-[#F0F5F1]"
                        : "font-medium text-[#66736B] dark:text-[#9AAEA2]"
                    }`}
                  >
                    {n.title}
                  </strong>
                  {!n.read && (
                    <span className="px-2 py-0.2 rounded-full bg-[#EEF5EF] text-[#2F7D4A] dark:bg-[#1C3325] dark:text-[#4ADE80] text-[10px] font-bold border border-[#58A66B]/30">
                      {isHindi ? "नया" : "NEW"}
                    </span>
                  )}
                </div>
                <p className="text-[#66736B] dark:text-[#A0B1A7] text-[12px] leading-relaxed">
                  {n.message}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-[#8A958E] dark:text-[#6C7E74] font-sans">
                  {n.timestamp}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNotificationRead(n.id);
                  }}
                  className="p-1 rounded-md text-[#8A958E] hover:text-[#2F7D4A] dark:text-[#6C7E74] dark:hover:text-[#4ADE80] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  title={
                    !n.read
                      ? (isHindi ? "पढ़ा हुआ चिह्नित करें" : "Mark as read")
                      : (isHindi ? "अनदेखा चिह्नित करें" : "Mark as unread")
                  }
                  aria-label={!n.read ? "Mark as read" : "Mark as unread"}
                >
                  {!n.read ? (
                    <Eye className="w-4 h-4 text-[#2F7D4A] dark:text-[#4ADE80]" />
                  ) : (
                    <EyeOff className="w-4 h-4 opacity-40 hover:opacity-100" />
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
import React from "react";
import { NavLink } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import {
  Home,
  MapPin,
  CalendarCheck,
  ListOrdered,
  PackageCheck,
  CreditCard,
  Bell,
  Building2,
  Sliders,
  BarChart3,
  PhoneCall
} from "lucide-react";

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
}) => {
  const { role, farmerBooking, selectedCentre, unreadNotifsCount } = useKrishiQ();
  const { t, isHindi } = useLanguage();

  const farmerNav = [
    { label: t("nav.overview"), to: "/farmer/dashboard", icon: <Home className="w-[18px] h-[18px]" /> },
    { label: t("nav.centres"), to: "/farmer/centres", icon: <MapPin className="w-[18px] h-[18px]" /> },
    { label: t("nav.bookings"), to: "/farmer/book-slot", icon: <CalendarCheck className="w-[18px] h-[18px]" /> },
    {
      label: t("nav.queue"),
      to: "/farmer/queue",
      icon: <ListOrdered className="w-[18px] h-[18px]" />,
      badge: `#${farmerBooking.tokenNumber}`,
      badgeColor: "bg-[#EEF5EF] text-[#123D2D]",
    },
    { label: t("nav.procurement"), to: "/farmer/procurement", icon: <PackageCheck className="w-[18px] h-[18px]" /> },
    { label: t("nav.payment"), to: "/farmer/payment", icon: <CreditCard className="w-[18px] h-[18px]" /> },
    {
      label: t("nav.notifications"),
      to: "/farmer/notifications",
      icon: <Bell className="w-[18px] h-[18px]" />,
      badge: unreadNotifsCount > 0 ? String(unreadNotifsCount) : undefined,
      badgeColor: "bg-[#FDF2F2] text-[#9B2C2C]",
    },
  ];

  const centreNav = [
    { label: t("nav.overview"), to: "/centre/dashboard", icon: <Home className="w-[18px] h-[18px]" /> },
    {
      label: isHindi ? "लाइव कतार" : "Live Queue",
      to: "/centre/queue",
      icon: <ListOrdered className="w-[18px] h-[18px]" />,
      badge: isHindi ? `${selectedCentre.currentQueueCount} कतार` : `${selectedCentre.currentQueueCount} Queue`,
      badgeColor: "bg-[#FEF5E7] text-[#9A6210]",
    },
    { label: isHindi ? "उपार्जन" : "Procurement", to: "/centre/procurement", icon: <PackageCheck className="w-[18px] h-[18px]" /> },
    { label: isHindi ? "विश्लेषण" : "Analytics", to: "/centre/analytics", icon: <BarChart3 className="w-[18px] h-[18px]" /> },
  ];

  const adminNav = [
    { label: t("nav.overview"), to: "/admin/dashboard", icon: <Home className="w-[18px] h-[18px]" /> },
    {
      label: isHindi ? "उपार्जन केंद्र" : "Centres",
      to: "/admin/centres",
      icon: <Building2 className="w-[18px] h-[18px]" />,
      badge: isHindi ? "42 सक्रिय" : "42 Active",
      badgeColor: "bg-[#EEF5EF] text-[#123D2D]",
    },
    { label: isHindi ? "विश्लेषण" : "Analytics", to: "/admin/analytics", icon: <BarChart3 className="w-[18px] h-[18px]" /> },
    {
      label: isHindi ? "सिम्युलेटर" : "Simulator",
      to: "/admin/simulator",
      icon: <Sliders className="w-[18px] h-[18px]" />,
      badge: isHindi ? "सैंडबॉक्स" : "Sandbox",
      badgeColor: "bg-[#F0F5FA] text-[#24538F]",
    },
  ];

  const currentNav = role === "farmer" ? farmerNav : role === "centre" ? centreNav : adminNav;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#17211B]/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={
          "fixed top-[60px] bottom-0 left-0 z-40 bg-white border-r border-[#E4E9E5] transition-all duration-200 ease-in-out flex flex-col justify-between card-shadow w-[200px] " +
          (isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
        }
      >
        <div className="p-3 overflow-y-auto flex-1">
          {/* Navigation Links */}
          <nav className="space-y-[4px]">
            {currentNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  "flex items-center gap-2.5 px-3 h-[40px] rounded-[10px] text-[13px] font-medium transition-all duration-150 cursor-pointer " +
                  (isActive
                    ? "bg-[#EEF5EF] text-[#123D2D] dark:bg-[#183928] dark:text-[#52DB89] dark:border-[#52DB89]/40 font-bold shadow-xs border border-[#58A66B]/20"
                    : "text-[#66736B] hover:text-[#17211B] hover:bg-[#F6F8F4] dark:text-[#A0B0A6] dark:hover:text-[#F0F5F1] dark:hover:bg-[#18281F]")
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? "text-[#123D2D] dark:text-[#52DB89]" : "text-[#8A958E] dark:text-[#76887E]"}>
                      {item.icon}
                    </span>

                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={
                            "text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ml-1 border " +
                            (isActive
                              ? "bg-white text-[#123D2D] border-[#E4E9E5] dark:bg-[#10241A] dark:text-[#52DB89] dark:border-[#52DB89]/30"
                              : item.badgeColor + " border-[#E4E9E5] dark:bg-[#10241A] dark:text-[#52DB89] dark:border-[#2A4235]")
                          }
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Support Info */}
        <div className="p-3 border-t border-[#E4E9E5] bg-[#F6F8F4] space-y-1.5 text-xs text-[#66736B]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-[#2F7D4A]" />
              <span>{t("nav.helpline")}:</span>
            </span>
            <span className="font-mono font-bold text-[#123D2D]">1800-180-1551</span>
          </div>
        </div>
      </aside>
    </>
  );
};

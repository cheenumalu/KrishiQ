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
  isCollapsed?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
  isCollapsed: explicitCollapsed,
  isExpanded,
}) => {
  const { role, farmerBooking, unreadNotifsCount, queueItems } = useKrishiQ();
  const { isHindi } = useLanguage();

  // Determine collapsed state: default is false (expanded)
  const isCollapsed = explicitCollapsed !== undefined
    ? explicitCollapsed
    : (isExpanded !== undefined ? !isExpanded : false);

  const realCentreQueueCount = queueItems.filter((q) => q.status !== "COMPLETED").length;

  const farmerNav = [
    { label: isHindi ? "डैशबोर्ड अवलोकन" : "Citizen Overview", to: "/farmer/dashboard", icon: <Home className="w-4 h-4 shrink-0" /> },
    { label: isHindi ? "मंडी केंद्र खोजें" : "Mandi Centre Locator", to: "/farmer/centres", icon: <MapPin className="w-4 h-4 shrink-0" /> },
    { label: isHindi ? "समय स्लॉट आरक्षण" : "Slot Reservation", to: "/farmer/book-slot", icon: <CalendarCheck className="w-4 h-4 shrink-0" /> },
    {
      label: isHindi ? "लाइव कतार टोकन" : "Live Queue Stream",
      to: "/farmer/queue",
      icon: <ListOrdered className="w-4 h-4 shrink-0" />,
      badge: `#${farmerBooking.tokenNumber}`,
      badgeColor: "bg-[#EFF6FF] text-[#003366] border-[#BFDBFE]",
    },
    { label: isHindi ? "उपार्जन प्रक्रिया" : "Intake & Quality", to: "/farmer/procurement", icon: <PackageCheck className="w-4 h-4 shrink-0" /> },
    { label: isHindi ? "DBT भुगतान खाता" : "DBT Payment Ledger", to: "/farmer/payment", icon: <CreditCard className="w-4 h-4 shrink-0" /> },
    {
      label: isHindi ? "विज्ञप्ति व सूचनाएं" : "Notices & Alerts",
      to: "/farmer/notifications",
      icon: <Bell className="w-4 h-4 shrink-0" />,
      badge: unreadNotifsCount > 0 ? String(unreadNotifsCount) : undefined,
      badgeColor: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
    },
  ];

  const centreNav = [
    { label: isHindi ? "ऑपरेटर डैशबोर्ड" : "Operator Console", to: "/centre/dashboard", icon: <Home className="w-4 h-4 shrink-0" /> },
    {
      label: isHindi ? "मंडी कतार रजिस्टर" : "Queue Intake Register",
      to: "/centre/queue",
      icon: <ListOrdered className="w-4 h-4 shrink-0" />,
      badge: String(realCentreQueueCount),
      badgeColor: "bg-[#EFF6FF] text-[#003366] border-[#BFDBFE]",
    },
    { label: isHindi ? "तौल एवं FAQ सत्यापन" : "Weighment & FAQ QC", to: "/centre/procurement", icon: <PackageCheck className="w-4 h-4 shrink-0" /> },
    { label: isHindi ? "दैनिक आवक रिपोर्ट" : "Daily Inflow Analytics", to: "/centre/analytics", icon: <BarChart3 className="w-4 h-4 shrink-0" /> },
  ];

  const adminNav = [
    { label: isHindi ? "राज्य नियंत्रण कक्ष" : "State Overview", to: "/admin/dashboard", icon: <Home className="w-4 h-4 shrink-0" /> },
    {
      label: isHindi ? "उपार्जन केंद्र निर्देशिका" : "Centres Directory",
      to: "/admin/centres",
      icon: <Building2 className="w-4 h-4 shrink-0" />,
      badge: isHindi ? "42 केंद्र" : "42 Mandis",
      badgeColor: "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]",
    },
    { label: isHindi ? "राज्य टेलीमेट्री रिपोर्ट" : "State Telemetry", to: "/admin/analytics", icon: <BarChart3 className="w-4 h-4 shrink-0" /> },
    {
      label: isHindi ? "नीति एवं भीड़ सिम्युलेटर" : "Policy Sandbox",
      to: "/admin/simulator",
      icon: <Sliders className="w-4 h-4 shrink-0" />,
      badge: isHindi ? "सिम्युलेटर" : "Sandbox",
      badgeColor: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",
    },
  ];

  const currentNav = role === "farmer" ? farmerNav : role === "centre" ? centreNav : adminNav;
  const sectionTitle = role === "farmer" ? (isHindi ? "किसान सेवाएं" : "FARMER SERVICES") : role === "centre" ? (isHindi ? "मंडी संचालन" : "OPERATIONAL CONSOLE") : (isHindi ? "राज्य प्रशासन" : "STATE GOVERNANCE");

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-black/70 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={
          "fixed top-[158px] bottom-0 left-0 z-30 bg-white dark:bg-[#0F172A] border-r border-[#CBD5E1] dark:border-slate-800 transition-all duration-200 ease-in-out flex flex-col justify-between select-none " +
          (isCollapsed ? "w-[64px] " : "w-[230px] ") +
          (isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0")
        }
      >
        <div className="p-2 overflow-y-auto flex-1">
          {/* Section Heading Badge / Divider */}
          {!isCollapsed ? (
            <div className="px-2.5 py-1.5 mb-2 bg-[#F1F5F9] dark:bg-slate-800 border-b border-[#CBD5E1] dark:border-slate-700">
              <span className="text-[10px] font-black tracking-wider text-[#003366] dark:text-[#38BDF8] uppercase block truncate">
                {sectionTitle}
              </span>
            </div>
          ) : (
            <div className="h-px bg-[#CBD5E1] dark:bg-slate-700 my-2 mx-1" />
          )}

          {/* Navigation Links */}
          <nav className="space-y-[3px]">
            {currentNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  "flex items-center h-[38px] rounded-xs text-xs font-semibold transition-colors duration-100 cursor-pointer border-l-3 " +
                  (isCollapsed ? "justify-center px-0 relative " : "gap-2.5 px-3 ") +
                  (isActive
                    ? "bg-[#EFF6FF] text-[#003366] border-[#003366] dark:bg-[#0C2340] dark:text-[#38BDF8] dark:border-[#38BDF8] font-bold shadow-2xs"
                    : "text-slate-700 hover:text-[#003366] hover:bg-slate-100 border-transparent dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800")
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? "text-[#003366] dark:text-[#38BDF8]" : "text-slate-400 dark:text-slate-500"}>
                      {item.icon}
                    </span>

                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={
                              "text-[10px] font-bold px-1.5 py-0.2 rounded-2xs shrink-0 ml-1 border " +
                              item.badgeColor
                            }
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {isCollapsed && item.badge && (
                      <span
                        className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B91C1C]"
                        title={item.badge}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Official Helpline Info */}
        {!isCollapsed ? (
          <div className="p-3 border-t border-[#CBD5E1] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0E1620] space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-[#15803D]" />
                <span>{isHindi ? "हेल्पलाइन:" : "Helpline:"}</span>
              </span>
              <span className="font-mono font-bold text-[#003366] dark:text-[#38BDF8]">1800-180-1551</span>
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">
              {isHindi ? "टोल-फ्री • 6 AM - 10 PM" : "Toll Free • 6 AM - 10 PM"}
            </p>
          </div>
        ) : (
          <div
            className="p-3 border-t border-[#CBD5E1] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0E1620] flex justify-center text-slate-600 dark:text-slate-400"
            title={isHindi ? "किसान हेल्पलाइन: 1800-180-1551" : "Kisan Helpline: 1800-180-1551"}
          >
            <PhoneCall className="w-4 h-4 text-[#15803D]" />
          </div>
        )}
      </aside>
    </>
  );
};

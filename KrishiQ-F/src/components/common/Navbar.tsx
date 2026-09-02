import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { UserRole } from "../../types";
import {
  Bell,
  RotateCcw,
  Users,
  Building2,
  Landmark,
  ChevronDown,
  Menu,
  X,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  Check
} from "lucide-react";

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
  isSidebarExpanded?: boolean;
  onToggleSidebarExpand?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  isSidebarExpanded,
  onToggleSidebarExpand,
}) => {
  const {
    role,
    setRole,
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    resetAllData,
  } = useKrishiQ();

  const { language, setLanguage, t, isHindi } = useLanguage();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setShowUserMenu(false);
    if (newRole === "farmer") navigate("/farmer/dashboard");
    else if (newRole === "centre") navigate("/centre/dashboard");
    else if (newRole === "admin") navigate("/admin/dashboard");
  };

  // Derive breadcrumb from path with localization
  const getPageBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes("/farmer/dashboard")) return { portal: t("nav.farmerPortal"), page: t("nav.overview") };
    if (path.includes("/farmer/centres")) return { portal: t("nav.farmerPortal"), page: t("nav.centres") };
    if (path.includes("/farmer/book-slot")) return { portal: t("nav.farmerPortal"), page: t("nav.bookings") };
    if (path.includes("/farmer/queue")) return { portal: t("nav.farmerPortal"), page: t("nav.queue") };
    if (path.includes("/farmer/procurement")) return { portal: t("nav.farmerPortal"), page: t("nav.procurement") };
    if (path.includes("/farmer/payment")) return { portal: t("nav.farmerPortal"), page: t("nav.payment") };
    if (path.includes("/farmer/notifications")) return { portal: t("nav.farmerPortal"), page: t("nav.notifications") };

    if (path.includes("/centre/dashboard")) return { portal: t("nav.operatorPortal"), page: t("centre.consoleTitle") };
    if (path.includes("/centre/queue")) return { portal: t("nav.operatorPortal"), page: t("nav.queue") };
    if (path.includes("/centre/procurement")) return { portal: t("nav.operatorPortal"), page: t("nav.procurement") };
    if (path.includes("/centre/analytics")) return { portal: t("nav.operatorPortal"), page: isHindi ? "विश्लेषण" : "Analytics" };

    if (path.includes("/admin/dashboard")) return { portal: t("nav.adminPortal"), page: isHindi ? "नेटवर्क अवलोकन" : "Network Overview" };
    if (path.includes("/admin/centres")) return { portal: t("nav.adminPortal"), page: isHindi ? "उपार्जन केंद्र" : "Centres Directory" };
    if (path.includes("/admin/analytics")) return { portal: t("nav.adminPortal"), page: isHindi ? "विश्लेषण" : "Analytics" };
    if (path.includes("/admin/simulator")) return { portal: t("nav.adminPortal"), page: t("admin.whatIfSimulatorBtn") };

    return { portal: t("common.appName"), page: t("common.saasEngine") };
  };

  const breadcrumb = getPageBreadcrumb();
  const userName =
    role === "farmer"
      ? (isHindi ? "राजेश शर्मा" : "Rajesh Sharma")
      : role === "centre"
      ? (isHindi ? "शिवाजी नगर संचालन" : "Shivaji Nagar Ops")
      : (isHindi ? "प्रशासक निदेशक" : "Admin Director");

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E4E9E5] card-shadow">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px] gap-3">
          
          {/* Left Side: Expand button + Brand Logo & Breadcrumb */}
          <div className="flex items-center gap-3">
            {onToggleMobileSidebar && (
              <button
                onClick={onToggleMobileSidebar}
                className="lg:hidden p-2 rounded-[10px] text-[#66736B] hover:text-[#17211B] hover:bg-[#EEF5EF] transition-colors"
                aria-label={t("nav.menu")}
              >
                {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {onToggleSidebarExpand && (
              <button
                onClick={onToggleSidebarExpand}
                className="hidden lg:flex p-2 rounded-[10px] text-[#66736B] hover:text-[#123D2D] hover:bg-[#EEF5EF] transition-colors"
                title={isSidebarExpanded ? t("nav.collapseSidebar") : t("nav.expandSidebar")}
              >
                {isSidebarExpanded ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-[10px] bg-[#123D2D] flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm group-hover:bg-[#2F7D4A] transition-colors">
                KQ
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-base text-[#17211B] tracking-tight">KrishiQ</span>
              </div>
            </Link>

            <div className="h-4 w-px bg-[#E4E9E5] hidden md:block mx-1" />

            {/* Clean Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-[13px]">
              <span className="text-[#66736B] font-medium">{breadcrumb.portal}</span>
              <span className="text-[#8A958E]">/</span>
              <span className="font-semibold text-[#17211B]">{breadcrumb.page}</span>
            </div>
          </div>

          {/* Right Side: Clean controls (Language, Notifications, Profile Dropdown) */}
          <div className="flex items-center gap-2.5">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] border border-[#E4E9E5] bg-white hover:bg-[#F6F8F4] text-xs font-medium text-[#17211B] transition-colors cursor-pointer"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#66736B]" />
                <span className="font-semibold">{language === "hi" ? "हिंदी" : "English"}</span>
                <ChevronDown className="w-3 h-3 text-[#8A958E]" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl border border-[#E4E9E5] card-shadow z-50 p-1.5 text-xs">
                  <button
                    onClick={() => { setLanguage("en"); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                      language === "en" ? "font-bold bg-[#EEF5EF] text-[#123D2D]" : "text-[#17211B] hover:bg-[#F6F8F4]"
                    }`}
                  >
                    <span>English</span>
                    {language === "en" && <Check className="w-3.5 h-3.5 text-[#2F7D4A]" />}
                  </button>
                  <button
                    onClick={() => { setLanguage("hi"); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors font-sans flex items-center justify-between ${
                      language === "hi" ? "font-bold bg-[#EEF5EF] text-[#123D2D]" : "text-[#17211B] hover:bg-[#F6F8F4]"
                    }`}
                  >
                    <span>हिंदी</span>
                    {language === "hi" && <Check className="w-3.5 h-3.5 text-[#2F7D4A]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-[10px] text-[#66736B] hover:text-[#17211B] hover:bg-[#EEF5EF] border border-[#E4E9E5] transition-colors cursor-pointer"
                aria-label={t("farmer.notificationsTitle")}
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D95555] text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-1.5 w-80 sm:w-96 bg-white rounded-2xl border border-[#E4E9E5] card-shadow z-50 overflow-hidden">
                  <div className="p-3 bg-[#F6F8F4] border-b border-[#E4E9E5] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17211B] uppercase tracking-wider">
                      {t("farmer.notificationsTitle")}
                    </span>
                    <button
                      onClick={() => setShowNotifs(false)}
                      className="text-[#8A958E] hover:text-[#17211B] text-xs font-medium"
                    >
                      {t("common.close")}
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#E4E9E5]">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#66736B]">
                        {t("farmer.noNewNotifications")}
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.actionUrl) {
                              navigate(notif.actionUrl);
                              setShowNotifs(false);
                            }
                          }}
                          className={`p-3 hover:bg-[#F6F8F4] transition-colors cursor-pointer text-xs ${
                            !notif.read ? "bg-[#EEF5EF]/60" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-bold text-[#17211B]">{notif.title}</h5>
                            <span className="text-[10px] text-[#8A958E] font-mono shrink-0">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-[#66736B] mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-[#F6F8F4] border-t border-[#E4E9E5] text-center">
                    <Link
                      to="/farmer/notifications"
                      onClick={() => setShowNotifs(false)}
                      className="text-xs font-bold text-[#2F7D4A] hover:underline"
                    >
                      {isHindi ? "सभी सूचनाएँ देखें →" : "View All Notifications →"}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown with Demo Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-[#E4E9E5] bg-white hover:bg-[#F6F8F4] transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#123D2D] text-white flex items-center justify-center text-xs font-bold">
                  {userName.charAt(0)}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-[#17211B]">
                  {userName}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8A958E] hidden md:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl border border-[#E4E9E5] card-shadow z-50 p-2 text-xs space-y-1">
                  <div className="px-3 py-2 border-b border-[#E4E9E5]">
                    <div className="font-bold text-[#17211B]">{userName}</div>
                    <div className="text-[10px] text-[#66736B] uppercase font-mono">
                      {role === "farmer" ? t("nav.farmerPortal") : role === "centre" ? t("nav.operatorPortal") : t("nav.adminPortal")}
                    </div>
                  </div>

                  <div className="px-3 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8A958E]">
                    {t("common.switchPersona")}
                  </div>

                  <button
                    onClick={() => handleRoleChange("admin")}
                    className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center gap-2 font-medium transition-colors ${
                      role === "admin" ? "bg-[#EEF5EF] text-[#123D2D] font-bold" : "text-[#17211B] hover:bg-[#F6F8F4]"
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5 text-[#F2A93B]" />
                    <span>{t("nav.adminPortal")}</span>
                  </button>

                  <button
                    onClick={() => handleRoleChange("centre")}
                    className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center gap-2 font-medium transition-colors ${
                      role === "centre" ? "bg-[#EEF5EF] text-[#123D2D] font-bold" : "text-[#17211B] hover:bg-[#F6F8F4]"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#4178C0]" />
                    <span>{t("nav.operatorPortal")}</span>
                  </button>

                  <button
                    onClick={() => handleRoleChange("farmer")}
                    className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center gap-2 font-medium transition-colors ${
                      role === "farmer" ? "bg-[#EEF5EF] text-[#123D2D] font-bold" : "text-[#17211B] hover:bg-[#F6F8F4]"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-[#2F7D4A]" />
                    <span>{t("nav.farmerPortal")}</span>
                  </button>

                  <div className="border-t border-[#E4E9E5] pt-1 mt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        resetAllData();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#FDF2F2] text-[#D95555] font-medium flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t("common.resetData")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

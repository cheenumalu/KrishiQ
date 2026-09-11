import React, { useState, useRef, useEffect } from "react";
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
  Check,
  Sun,
  Moon,
  Eye,
  EyeOff
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
    toggleNotificationRead,
    markAllNotificationsAsRead,
    resetAllData,
    theme,
    toggleTheme,
  } = useKrishiQ();

  const { language, setLanguage, t, isHindi } = useLanguage();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const notifsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (langRef.current && !langRef.current.contains(target)) {
        setShowLangMenu(false);
      }
      if (notifsRef.current && !notifsRef.current.contains(target)) {
        setShowNotifs(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowLangMenu(false);
        setShowNotifs(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
            <div className="relative" ref={langRef}>
              <button
                onClick={() => {
                  setShowLangMenu((prev) => !prev);
                  setShowNotifs(false);
                  setShowUserMenu(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] border border-[#E4E9E5] dark:border-[#202722] bg-white dark:bg-[#141816] hover:bg-[#F6F8F4] dark:hover:bg-[#1B221E] text-xs font-medium text-[#17211B] dark:text-white transition-colors cursor-pointer"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#66736B] dark:text-[#A0ABA4]" />
                <span className="font-semibold">{language === "hi" ? "हिंदी" : "English"}</span>
                <ChevronDown className="w-3 h-3 text-[#8A958E] dark:text-[#A0ABA4]" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-[#141816] rounded-2xl border border-[#E4E9E5] dark:border-[#202722] card-shadow z-50 p-1.5 text-xs">
                  <button
                    onClick={() => { setLanguage("en"); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                      language === "en" ? "font-bold bg-[#EEF5EF] dark:bg-[#12281C] text-[#123D2D] dark:text-[#52DB89]" : "text-[#17211B] dark:text-white hover:bg-[#F6F8F4] dark:hover:bg-[#1B221E]"
                    }`}
                  >
                    <span>English</span>
                    {language === "en" && <Check className="w-3.5 h-3.5 text-[#2F7D4A] dark:text-[#52DB89]" />}
                  </button>
                  <button
                    onClick={() => { setLanguage("hi"); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors font-sans flex items-center justify-between ${
                      language === "hi" ? "font-bold bg-[#EEF5EF] dark:bg-[#12281C] text-[#123D2D] dark:text-[#52DB89]" : "text-[#17211B] dark:text-white hover:bg-[#F6F8F4] dark:hover:bg-[#1B221E]"
                    }`}
                  >
                    <span>हिंदी</span>
                    {language === "hi" && <Check className="w-3.5 h-3.5 text-[#2F7D4A] dark:text-[#52DB89]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle Button (Between Language and Notifications) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-[10px] text-[#66736B] dark:text-[#A0ABA4] hover:text-[#17211B] dark:hover:text-white hover:bg-[#EEF5EF] dark:hover:bg-[#1B221E] border border-[#E4E9E5] dark:border-[#202722] transition-colors cursor-pointer"
              title={
                theme === "dark"
                  ? (isHindi ? "लाइट मोड चालू करें" : "Switch to Light Mode")
                  : (isHindi ? "डार्क मोड चालू करें" : "Switch to Dark Mode")
              }
              aria-label="Toggle Light and Dark Mode"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#F2A93B]" />
              ) : (
                <Moon className="w-4 h-4 text-[#66736B]" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifsRef}>
              <button
                onClick={() => {
                  setShowNotifs((prev) => !prev);
                  setShowLangMenu(false);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-[10px] text-[#66736B] dark:text-[#A0ABA4] hover:text-[#17211B] dark:hover:text-white hover:bg-[#EEF5EF] dark:hover:bg-[#1B221E] border border-[#E4E9E5] dark:border-[#202722] transition-colors cursor-pointer"
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
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#121E17] rounded-2xl border border-[#E4E9E5] dark:border-[#243B2E] card-shadow shadow-xl dark:shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-[#F6F8F4] dark:bg-[#0D1812] border-b border-[#E4E9E5] dark:border-[#22352A] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#66736B] dark:text-[#8E9F94] uppercase tracking-wider">
                        {t("farmer.notificationsTitle")}
                      </span>
                      {unreadNotifsCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#2F7D4A]/10 text-[#2F7D4A] dark:bg-[#2F7D4A]/20 dark:text-[#4ADE80] text-[10px] font-bold">
                          {unreadNotifsCount} {isHindi ? "नया" : "new"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {unreadNotifsCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] text-[#2F7D4A] dark:text-[#4ADE80] hover:underline font-semibold transition-colors cursor-pointer"
                        >
                          {isHindi ? "सभी पढ़ें" : "Mark all read"}
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifs(false)}
                        className="text-[#8A958E] hover:text-[#17211B] dark:hover:text-white text-xs font-medium cursor-pointer"
                      >
                        {t("common.close")}
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E4E9E5] dark:divide-[#22352A]">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#66736B] dark:text-[#8E9F94]">
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
                          className={`px-4 py-3 transition-colors cursor-pointer text-xs flex items-start gap-3 ${
                            !notif.read
                              ? "bg-[#F2F8F4] hover:bg-[#E8F3EB] dark:bg-[#162B1F] dark:hover:bg-[#1C3627]"
                              : "bg-white hover:bg-[#F9FAF8] dark:bg-[#121E17] dark:hover:bg-[#18291F]"
                          }`}
                        >
                          {/* Unread indicator dot */}
                          <div className="pt-1 shrink-0">
                            <span
                              className={`w-2 h-2 rounded-full block ${
                                !notif.read
                                  ? "bg-[#2F7D4A] dark:bg-[#4ADE80] ring-4 ring-[#2F7D4A]/20"
                                  : "bg-transparent"
                              }`}
                            />
                          </div>

                          {/* Text content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <h5
                                className={`text-xs ${
                                  !notif.read
                                    ? "font-bold text-[#123D2D] dark:text-[#F0F5F1]"
                                    : "font-medium text-[#4B5563] dark:text-[#9CA3AF]"
                                }`}
                              >
                                {notif.title}
                              </h5>
                              <span
                                className={`text-[10px] font-sans shrink-0 ${
                                  !notif.read
                                    ? "text-[#4B5563] dark:text-[#94A3B8] font-medium"
                                    : "text-[#9CA3AF] dark:text-[#64748B]"
                                }`}
                              >
                                {notif.timestamp}
                              </span>
                            </div>
                            <p
                              className={`text-[12px] leading-relaxed mt-0.5 ${
                                !notif.read
                                  ? "text-[#24332A] dark:text-[#CBD5E1]"
                                  : "text-[#6B7280] dark:text-[#94A3B8]"
                              }`}
                            >
                              {notif.message}
                            </p>
                          </div>

                          {/* Sleek Eye button to toggle read state */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNotificationRead(notif.id);
                            }}
                            className="p-1 rounded-md text-[#6B7280] hover:text-[#2F7D4A] dark:text-[#94A3B8] dark:hover:text-[#4ADE80] hover:bg-black/5 dark:hover:bg-white/10 shrink-0 transition-colors cursor-pointer mt-0.5"
                            title={
                              !notif.read
                                ? (isHindi ? "पढ़ा हुआ चिह्नित करें" : "Mark as read")
                                : (isHindi ? "अनदेखा चिह्नित करें" : "Mark as unread")
                            }
                            aria-label={!notif.read ? "Mark as read" : "Mark as unread"}
                          >
                            {!notif.read ? (
                              <Eye className="w-4 h-4 text-[#2F7D4A] dark:text-[#4ADE80]" />
                            ) : (
                              <EyeOff className="w-4 h-4 opacity-40 hover:opacity-100" />
                            )}
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-[#F6F8F4] dark:bg-[#0D1812] border-t border-[#E4E9E5] dark:border-[#22352A] text-center">
                    <Link
                      to="/farmer/notifications"
                      onClick={() => setShowNotifs(false)}
                      className="text-xs font-bold text-[#2F7D4A] dark:text-[#4ADE80] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{isHindi ? "सभी सूचनाएँ देखें →" : "View All Notifications →"}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown with Demo Persona Switcher */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  setShowUserMenu((prev) => !prev);
                  setShowLangMenu(false);
                  setShowNotifs(false);
                }}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-[#E4E9E5] dark:border-[#202722] bg-white dark:bg-[#141816] hover:bg-[#F6F8F4] dark:hover:bg-[#1B221E] transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#123D2D] dark:bg-[#2F7D4A] text-white flex items-center justify-center text-xs font-bold">
                  {userName.charAt(0)}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-[#17211B] dark:text-white">
                  {userName}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8A958E] dark:text-[#A0ABA4] hidden md:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-[#141816] rounded-2xl border border-[#E4E9E5] dark:border-[#202722] card-shadow z-50 p-2 text-xs space-y-1 shadow-xl">
                  <div className="px-3 py-2 border-b border-[#E4E9E5] dark:border-[#202722]">
                    <div className="font-bold text-[#17211B] dark:text-white">{userName}</div>
                    <div className="text-[10px] text-[#66736B] dark:text-[#A0ABA4] uppercase font-mono">
                      {role === "farmer" ? t("nav.farmerPortal") : role === "centre" ? t("nav.operatorPortal") : t("nav.adminPortal")}
                    </div>
                  </div>

                  <div className="px-3 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8A958E] dark:text-[#A0ABA4]">
                    {t("common.switchPersona")}
                  </div>

                  <button
                    onClick={() => handleRoleChange("admin")}
                    className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center gap-2 font-medium transition-colors ${
                      role === "admin" ? "bg-[#EEF5EF] dark:bg-[#12281C] text-[#123D2D] dark:text-[#52DB89] font-bold" : "text-[#17211B] dark:text-white hover:bg-[#F6F8F4] dark:hover:bg-[#1B221E]"
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5 text-[#F2A93B]" />
                    <span>{t("nav.adminPortal")}</span>
                  </button>

                  <button
                    onClick={() => handleRoleChange("centre")}
                    className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center gap-2 font-medium transition-colors ${
                      role === "centre" ? "bg-[#EEF5EF] dark:bg-[#12281C] text-[#123D2D] dark:text-[#52DB89] font-bold" : "text-[#17211B] dark:text-white hover:bg-[#F6F8F4] dark:hover:bg-[#1B221E]"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#4178C0]" />
                    <span>{t("nav.operatorPortal")}</span>
                  </button>

                  <button
                    onClick={() => handleRoleChange("farmer")}
                    className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center gap-2 font-medium transition-colors ${
                      role === "farmer" ? "bg-[#EEF5EF] dark:bg-[#12281C] text-[#123D2D] dark:text-[#52DB89] font-bold" : "text-[#17211B] dark:text-white hover:bg-[#F6F8F4] dark:hover:bg-[#1B221E]"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-[#2F7D4A] dark:text-[#52DB89]" />
                    <span>{t("nav.farmerPortal")}</span>
                  </button>

                  <div className="border-t border-[#E4E9E5] dark:border-[#202722] pt-1 mt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        resetAllData();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#FDF2F2] dark:hover:bg-[#251214] text-[#D95555] dark:text-[#F87171] font-medium flex items-center gap-2 transition-colors cursor-pointer"
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

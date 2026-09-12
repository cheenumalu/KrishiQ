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
  Eye,
  EyeOff,
  PhoneCall,
  Home,
  FileText,
  HelpCircle
} from "lucide-react";
import { EmblemOfIndia, GovInitiativeBadges } from "./EmblemOfIndia";
import { GovTopBar } from "./GovTopBar";
import { GovMarquee } from "./GovMarquee";

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
  isSidebarExpanded?: boolean;
  onToggleSidebarExpand?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  isSidebarCollapsed,
  onToggleSidebarCollapse,
  isSidebarExpanded,
  onToggleSidebarExpand,
}) => {
  const isCollapsed = isSidebarCollapsed ?? (isSidebarExpanded !== undefined ? !isSidebarExpanded : false);
  const handleToggleCollapse = onToggleSidebarCollapse ?? onToggleSidebarExpand;

  const {
    role,
    setRole,
    theme,
    toggleTheme,
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    toggleNotificationRead,
    markAllNotificationsAsRead,
    resetAllData,
  } = useKrishiQ();

  const { language, setLanguage, t, isHindi } = useLanguage();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const notifsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (notifsRef.current && !notifsRef.current.contains(target)) {
        setShowNotifs(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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

  const toggleContrast = () => {
    const root = document.documentElement;
    root.classList.toggle("high-contrast");
    setIsHighContrast(root.classList.contains("high-contrast"));
  };

  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setShowUserMenu(false);
    if (newRole === "farmer") navigate("/farmer/dashboard");
    else if (newRole === "centre") navigate("/centre/dashboard");
    else if (newRole === "admin") navigate("/admin/dashboard");
  };

  const getRoleDisplayName = () => {
    if (role === "farmer") return isHindi ? "किसान पोर्टल (Farmer)" : "Farmer Services";
    if (role === "centre") return isHindi ? "मंडी ऑपरेटर (Operator)" : "Mandi Operator";
    return isHindi ? "राज्य प्रशासन (Admin)" : "State Command";
  };

  const getUserName = () => {
    if (role === "farmer") return isHindi ? "श्री राजेश शर्मा (किसान ID: MP-IND-89421)" : "Rajesh Sharma (ID: MP-IND-89421)";
    if (role === "centre") return isHindi ? "प्रभारी अधिकारी (इंदौर मंडी-01)" : "Centre Officer (Indore-01)";
    return isHindi ? "राज्य नोडल निदेशक (कृषि विपणन)" : "State Nodal Director (Agri)";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#0F172A] border-b border-[#CBD5E1] dark:border-[#1E293B] shadow-xs select-none">
      
      {/* Tier 1: GIGW Accessibility & Identity Top Bar */}
      <GovTopBar
        onContrastToggle={toggleContrast}
        isHighContrast={isHighContrast}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Tier 2: National Portal Branding & Emblem Header */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 bg-white dark:bg-[#0F172A]">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Emblem + Official Portal Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Ashoka Lion Capital Emblem */}
            <Link to="/" className="shrink-0 group flex items-center" title="भारत सरकार | Government of India">
              <EmblemOfIndia size="md" />
            </Link>

            {/* Vertical Gov Separator */}
            <div className="h-10 sm:h-12 w-[1.5px] bg-[#CBD5E1] dark:bg-slate-700 hidden sm:block" />

            {/* Bilingual Portal Name */}
            <div>
              <Link to="/" className="block">
                <h1 className="text-base sm:text-xl lg:text-2xl font-black text-[#003366] dark:text-[#38BDF8] tracking-tight leading-tight">
                  {isHindi ? "राष्ट्रीय कृषि ई-उपार्जन पोर्टल" : "KrishiQ - National Procurement Portal"}
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-semibold leading-tight mt-0.5">
                  {isHindi
                    ? "कृषि उपज मंडी डिजिटल समन्वय एवं यात्रा प्रबंधन प्रणाली"
                    : "Intelligent Mandi Intake & Real-Time Queue Coordination Platform"}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                  {isHindi
                    ? "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार"
                    : "Department of Agriculture & Farmers Welfare, Government of India"}
                </p>
              </Link>
            </div>
          </div>

          {/* Right: National Initiative Badges & Kisan Helpline */}
          <div className="flex items-center gap-3 sm:gap-5">
            <GovInitiativeBadges />

            {/* Official Toll-free Helpline Box */}
            <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-slate-700 rounded-xs">
              <div className="w-7 h-7 rounded-2xs bg-[#15803D] text-white flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
                  {isHindi ? "किसान हेल्पलाइन" : "Kisan Helpline"}
                </span>
                <span className="font-mono font-black text-xs text-[#003366] dark:text-emerald-400 tracking-wider">
                  1800-180-1551
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Tier 3: Primary Government Navigation Bar (Deep Navy #003366) */}
      <div className="w-full bg-[#003366] text-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[42px] gap-2">
            
            {/* Left Nav Controls */}
            <div className="flex items-center gap-2">
              {/* Mobile Sidebar Toggle Button */}
              {!isLanding && onToggleMobileSidebar && (
                <button
                  onClick={onToggleMobileSidebar}
                  className="lg:hidden p-1.5 rounded-xs text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={t("nav.menu")}
                >
                  {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}

              {/* Desktop Sidebar Toggle */}
              {!isLanding && handleToggleCollapse && (
                <button
                  onClick={handleToggleCollapse}
                  className="hidden lg:flex p-1.5 rounded-xs text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title={isCollapsed ? (isHindi ? "साइडबार खोलें" : "Expand Sidebar") : (isHindi ? "साइडबार समेटें" : "Collapse Sidebar")}
                  aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                </button>
              )}

              {/* Main Nav Links */}
              <nav className="flex items-center text-xs font-bold uppercase tracking-wide">
                <Link
                  to="/"
                  className={`px-3 py-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                    isLanding
                      ? "bg-[#002244] text-[#FF9933] border-[#FF9933]"
                      : "text-white/90 hover:text-white hover:bg-white/10 border-transparent"
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>{isHindi ? "मुख्य पृष्ठ" : "Home"}</span>
                </Link>

                {role === "farmer" && !isLanding && (
                  <Link
                    to="/farmer/dashboard"
                    className="px-3 py-2.5 bg-[#002244] text-[#FF9933] border-b-2 border-[#FF9933] flex items-center gap-1.5"
                  >
                    <span>{isHindi ? "किसान सेवाएं" : "Farmer Services"}</span>
                  </Link>
                )}

                {role === "centre" && !isLanding && (
                  <Link
                    to="/centre/dashboard"
                    className="px-3 py-2.5 bg-[#002244] text-[#FF9933] border-b-2 border-[#FF9933] flex items-center gap-1.5"
                  >
                    <span>{isHindi ? "मंडी ऑपरेटर कंसोल" : "Operator Console"}</span>
                  </Link>
                )}

                {role === "admin" && !isLanding && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-2.5 bg-[#002244] text-[#FF9933] border-b-2 border-[#FF9933] flex items-center gap-1.5"
                  >
                    <span>{isHindi ? "राज्य नियंत्रण कक्ष" : "State Command"}</span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Right Side: Notifications & Official Role Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Notifications Dropdown */}
              <div className="relative" ref={notifsRef}>
                <button
                  onClick={() => {
                    setShowNotifs((prev) => !prev);
                    setShowUserMenu(false);
                  }}
                  className="relative p-1.5 rounded-xs text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label={t("farmer.notificationsTitle")}
                  title={isHindi ? "सूचनाएँ एवं विज्ञप्ति" : "Notifications & Circulars"}
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#B91C1C] text-white text-[9px] font-extrabold flex items-center justify-center border border-white">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#131D28] text-slate-800 dark:text-slate-100 rounded-xs border-2 border-[#003366] shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-2.5 bg-[#003366] text-white flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span>{isHindi ? "सरकारी सूचनाएँ एवं निर्देश" : "Official Notifications"}</span>
                        {unreadNotifsCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-2xs bg-[#FF9933] text-[#002244] text-[10px]">
                            {unreadNotifsCount} {isHindi ? "नया" : "New"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadNotifsCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllNotificationsAsRead}
                            className="text-[10px] text-[#FF9933] hover:underline"
                          >
                            {isHindi ? "सभी पढ़ें" : "Mark read"}
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifs(false)}
                          className="text-white/80 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-[#CBD5E1] dark:divide-slate-700">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500">
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
                            className={`p-3 text-xs flex items-start gap-2.5 cursor-pointer transition-colors ${
                              !notif.read ? "bg-[#EFF6FF] dark:bg-[#0C2340]" : "bg-white dark:bg-[#131D28] hover:bg-slate-50"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${!notif.read ? "bg-[#003366]" : "bg-transparent"}`} />
                            <div className="flex-1">
                              <h5 className="font-bold text-[#003366] dark:text-[#38BDF8] text-xs">
                                {notif.title}
                              </h5>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-400 block mt-1">
                                {notif.timestamp}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Authorized Operational Role Selector */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => {
                    setShowUserMenu((prev) => !prev);
                    setShowNotifs(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1 bg-[#002244] hover:bg-[#001B36] border border-[#0A3866] rounded-xs text-xs font-bold text-white transition-colors cursor-pointer"
                  title="Change Official User Role"
                >
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="hidden sm:inline">{getRoleDisplayName()}</span>
                  <span className="sm:hidden uppercase">{role}</span>
                  <ChevronDown className="w-3 h-3 text-[#FF9933]" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-[#131D28] text-slate-800 dark:text-slate-100 rounded-xs border-2 border-[#003366] shadow-2xl z-50 p-2 text-xs space-y-1">
                    <div className="px-3 py-2 bg-[#F1F5F9] dark:bg-[#0E1620] border-b border-[#CBD5E1] dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold block">
                        {isHindi ? "सत्यापित उपयोगकर्ता" : "Authorized User Profile"}
                      </span>
                      <strong className="text-xs font-bold text-[#003366] dark:text-[#38BDF8] block truncate">
                        {getUserName()}
                      </strong>
                    </div>

                    <div className="px-2 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {isHindi ? "भूमिका बदलें (Switch Role)" : "Select Operating Persona"}
                    </div>

                    <button
                      onClick={() => handleRoleChange("farmer")}
                      className={`w-full text-left px-3 py-2 rounded-xs flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                        role === "farmer" ? "bg-[#003366] text-white font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-[#22C55E]" />
                      <div className="flex-1">
                        <span className="block font-bold">{isHindi ? "1. किसान पोर्टल" : "1. Farmer Portal"}</span>
                        <span className="text-[10px] opacity-80">{isHindi ? "टोकन, कतार, एवं भुगतान" : "Token, Queue, & Payment"}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleChange("centre")}
                      className={`w-full text-left px-3 py-2 rounded-xs flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                        role === "centre" ? "bg-[#003366] text-white font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <div className="flex-1">
                        <span className="block font-bold">{isHindi ? "2. मंडी ऑपरेटर कंसोल" : "2. Mandi Operator"}</span>
                        <span className="text-[10px] opacity-80">{isHindi ? "तौल कांटा, FAQ गुणवत्ता, कतार" : "Weighbridge, FAQ grading"}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleChange("admin")}
                      className={`w-full text-left px-3 py-2 rounded-xs flex items-center gap-2 font-medium transition-colors cursor-pointer ${
                        role === "admin" ? "bg-[#003366] text-white font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Landmark className="w-3.5 h-3.5 text-[#FF9933]" />
                      <div className="flex-1">
                        <span className="block font-bold">{isHindi ? "3. राज्य नियंत्रण कक्ष" : "3. State Command"}</span>
                        <span className="text-[10px] opacity-80">{isHindi ? "टेलीमेट्री एवं भीड़ सिमुलेटर" : "Telemetry & Simulator"}</span>
                      </div>
                    </button>

                    <div className="border-t border-[#CBD5E1] dark:border-slate-700 pt-1.5 mt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          resetAllData();
                        }}
                        className="w-full text-left px-3 py-1.5 text-[#B91C1C] hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xs font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isHindi ? "डेमो डेटा रीसेट करें" : "Reset Demo Simulation"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Tier 4: Public Notice & Important Circular Ticker */}
      <GovMarquee />

    </header>
  );
};

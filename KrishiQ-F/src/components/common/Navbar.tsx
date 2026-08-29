import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
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
  Phone
} from "lucide-react";

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar, isMobileSidebarOpen }) => {
  const {
    role,
    setRole,
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    resetAllData,
    currentTimeFormatted,
    farmerBooking,
    selectedCentre
  } = useKrishiQ();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState<"en" | "hi">("en");
  const [showLangMenu, setShowLangMenu] = useState(false);

  const navigate = useNavigate();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setShowRoleMenu(false);
    if (newRole === "farmer") navigate("/farmer/dashboard");
    else if (newRole === "centre") navigate("/centre/dashboard");
    else if (newRole === "admin") navigate("/admin/dashboard");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Left controls */}
          <div className="flex items-center gap-3">
            {onToggleMobileSidebar && (
              <button
                onClick={onToggleMobileSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-extrabold text-base tracking-tight shadow-xs">
                KQ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">KrishiQ</span>
                  <span className="text-[11px] font-semibold px-2 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-300 hidden sm:inline-block">
                    Procurement Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block leading-none">
                  Intelligent Agricultural Procurement Coordination
                </p>
              </div>
            </Link>
          </div>

          {/* Center Role Switcher Bar */}
          <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => handleRoleChange("farmer")}
              className={
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer " +
                (role === "farmer"
                  ? "bg-white text-emerald-900 font-bold border border-slate-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900")
              }
            >
              <Users className="w-3.5 h-3.5" />
              <span>Farmer</span>
            </button>

            <button
              onClick={() => handleRoleChange("centre")}
              className={
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer " +
                (role === "centre"
                  ? "bg-white text-emerald-900 font-bold border border-slate-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900")
              }
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Centre Operator</span>
            </button>

            <button
              onClick={() => handleRoleChange("admin")}
              className={
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer " +
                (role === "admin"
                  ? "bg-white text-emerald-900 font-bold border border-slate-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900")
              }
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Administrator</span>
            </button>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{currentLang === "en" ? "English" : "?????"}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg border border-slate-200 shadow-lg z-50 py-1 text-xs">
                  <button
                    onClick={() => { setCurrentLang("en"); setShowLangMenu(false); }}
                    className={"w-full text-left px-3 py-1.5 hover:bg-slate-50 " + (currentLang === "en" ? "font-bold text-emerald-800" : "text-slate-700")}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setCurrentLang("hi"); setShowLangMenu(false); }}
                    className={"w-full text-left px-3 py-1.5 hover:bg-slate-50 " + (currentLang === "hi" ? "font-bold text-emerald-800" : "text-slate-700")}
                  >
                    ????? (Hindi)
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      Notifications & Alerts
                    </span>
                    <button
                      onClick={() => setShowNotifs(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Close
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.actionUrl) {
                            navigate(notif.actionUrl);
                            setShowNotifs(false);
                          }
                        }}
                        className={
                          "p-3 hover:bg-slate-50 transition-colors cursor-pointer text-xs " +
                          (!notif.read ? "bg-emerald-50/40" : "")
                        }
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-slate-900">{notif.title}</h5>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                    <Link
                      to="/farmer/notifications"
                      onClick={() => setShowNotifs(false)}
                      className="text-xs font-semibold text-emerald-800 hover:underline"
                    >
                      View All Notifications ?
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Demo Button */}
            <button
              onClick={resetAllData}
              title="Reset Demo Data"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">Reset</span>
            </button>

            {/* Mobile Role Switcher Pill */}
            <div className="relative md:hidden">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800"
              >
                <span>{role === "farmer" ? "Farmer" : role === "centre" ? "Operator" : "Admin"}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg border border-slate-200 shadow-xl z-50 py-1 text-xs">
                  <button
                    onClick={() => handleRoleChange("farmer")}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Farmer View</span>
                  </button>
                  <button
                    onClick={() => handleRoleChange("centre")}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Building2 className="w-3.5 h-3.5 text-sky-700" />
                    <span>Centre Operator</span>
                  </button>
                  <button
                    onClick={() => handleRoleChange("admin")}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Landmark className="w-3.5 h-3.5 text-amber-700" />
                    <span>Administrator</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

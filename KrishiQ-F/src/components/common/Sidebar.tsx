import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
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
  HelpCircle,
  PhoneCall,
  Globe
} from "lucide-react";

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { role, farmerBooking, selectedCentre, unreadNotifsCount } = useKrishiQ();

  const farmerNav = [
    { label: "Home", to: "/farmer/dashboard", icon: <Home className="w-4 h-4" /> },
    { label: "Find Centre", to: "/farmer/centres", icon: <MapPin className="w-4 h-4" /> },
    { label: "Book Slot", to: "/farmer/book-slot", icon: <CalendarCheck className="w-4 h-4" /> },
    {
      label: "Live Queue",
      to: "/farmer/queue",
      icon: <ListOrdered className="w-4 h-4" />,
      badge: "Token #" + farmerBooking.tokenNumber,
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      label: "My Procurement",
      to: "/farmer/procurement",
      icon: <PackageCheck className="w-4 h-4" />,
    },
    { label: "Payment", to: "/farmer/payment", icon: <CreditCard className="w-4 h-4" /> },
    {
      label: "Notifications",
      to: "/farmer/notifications",
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotifsCount > 0 ? String(unreadNotifsCount) : undefined,
      badgeColor: "bg-red-100 text-red-800",
    },
  ];

  const centreNav = [
    { label: "Overview", to: "/centre/dashboard", icon: <Home className="w-4 h-4" /> },
    {
      label: "Live Queue",
      to: "/centre/queue",
      icon: <ListOrdered className="w-4 h-4" />,
      badge: selectedCentre.currentQueueCount + " Waiting",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    { label: "Procurement", to: "/centre/procurement", icon: <PackageCheck className="w-4 h-4" /> },
    { label: "Analytics", to: "/centre/analytics", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const adminNav = [
    { label: "Overview", to: "/admin/dashboard", icon: <Home className="w-4 h-4" /> },
    {
      label: "Centres",
      to: "/admin/centres",
      icon: <Building2 className="w-4 h-4" />,
      badge: "24 Active",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    { label: "Analytics", to: "/admin/analytics", icon: <BarChart3 className="w-4 h-4" /> },
    {
      label: "What-if Simulator",
      to: "/admin/simulator",
      icon: <Sliders className="w-4 h-4" />,
      badge: "Sandbox",
      badgeColor: "bg-purple-100 text-purple-800",
    },
  ];

  const currentNav = role === "farmer" ? farmerNav : role === "centre" ? centreNav : adminNav;

  const roleTitle = {
    farmer: "Farmer Portal",
    centre: "Centre Operations",
    admin: "State Administration",
  }[role];

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={
          "fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out flex flex-col justify-between " +
          (isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
        }
      >
        <div className="p-4 overflow-y-auto flex-1">
          
          {/* Official Sector Badge */}
          <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                {roleTitle}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            </div>
            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
              {role === "farmer"
                ? farmerBooking.farmerName
                : role === "centre"
                ? selectedCentre.name
                : "Department of Agriculture"}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-0.5">
            {currentNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors " +
                  (isActive
                    ? "bg-emerald-800 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100")
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={isActive ? "text-white" : "text-slate-500"}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={
                          "text-[10px] font-bold px-1.5 py-0.2 rounded-md shrink-0 ml-1.5 " +
                          (isActive ? "bg-white/20 text-white" : item.badgeColor)
                        }
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Support & Language Box */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-[11px] font-medium">Language:</span>
            <span className="font-semibold text-slate-900">English</span>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-emerald-700" />
              <span>Help & Support:</span>
            </span>
            <span className="font-mono font-bold text-emerald-800">1800-180-1551</span>
          </div>
        </div>
      </aside>
    </>
  );
};

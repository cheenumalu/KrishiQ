import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, NavLink } from "react-router-dom";
import { KrishiQProvider, useKrishiQ } from "./context/KrishiQContext";
import { Navbar } from "./components/common/Navbar";
import { Sidebar } from "./components/common/Sidebar";
import { GovFooter } from "./components/common/GovFooter";
import { ToastContainer } from "./components/common/Toast";
import { Home, MapPin, CalendarCheck, ListOrdered, User } from "lucide-react";
import { useLanguage } from "./i18n";

// Pages
import { LandingPage } from "./pages/LandingPage";

// Farmer Pages
import { FarmerDashboard } from "./pages/farmer/FarmerDashboard";
import { FarmerCentres } from "./pages/farmer/FarmerCentres";
import { FarmerBookSlot } from "./pages/farmer/FarmerBookSlot";
import { FarmerQueue } from "./pages/farmer/FarmerQueue";
import { FarmerProcurement } from "./pages/farmer/FarmerProcurement";
import { FarmerPayment } from "./pages/farmer/FarmerPayment";
import { FarmerNotifications } from "./pages/farmer/FarmerNotifications";

// Centre Operator Pages
import { CentreDashboard } from "./pages/centre/CentreDashboard";
import { CentreQueue } from "./pages/centre/CentreQueue";
import { CentreProcurement } from "./pages/centre/CentreProcurement";
import { CentreAnalytics } from "./pages/centre/CentreAnalytics";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCentres } from "./pages/admin/AdminCentres";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";
import { AdminSimulator } from "./pages/admin/AdminSimulator";

const LayoutContent: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const { role } = useKrishiQ();
  const { t, isHindi } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0B1118] flex flex-col text-[#0F172A] dark:text-[#F8FAFC]">
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebarCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      <div className="flex-1 flex relative">
        {!isLanding && (
          <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleExpand={() => setIsSidebarCollapsed((prev) => !prev)}
          />
        )}

        <main
          id="main-content"
          tabIndex={-1}
          className={
            "flex-1 p-3 sm:p-5 lg:p-6 transition-all duration-200 pb-20 lg:pb-8 outline-none " +
            (!isLanding ? (isSidebarCollapsed ? "lg:pl-[80px]" : "lg:pl-[246px]") : "")
          }
        >
          <Routes>
            {/* Landing & Demo Portal */}
            <Route path="/" element={<LandingPage />} />

            {/* Farmer Routes */}
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/centres" element={<FarmerCentres />} />
            <Route path="/farmer/book-slot" element={<FarmerBookSlot />} />
            <Route path="/farmer/queue" element={<FarmerQueue />} />
            <Route path="/farmer/procurement" element={<FarmerProcurement />} />
            <Route path="/farmer/payment" element={<FarmerPayment />} />
            <Route path="/farmer/notifications" element={<FarmerNotifications />} />

            {/* Centre Routes */}
            <Route path="/centre/dashboard" element={<CentreDashboard />} />
            <Route path="/centre/queue" element={<CentreQueue />} />
            <Route path="/centre/procurement" element={<CentreProcurement />} />
            <Route path="/centre/analytics" element={<CentreAnalytics />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/centres" element={<AdminCentres />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/simulator" element={<AdminSimulator />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Official GIGW Footer */}
      <GovFooter />

      {/* Mobile Bottom Navigation for Farmer role */}
      {role === "farmer" && !isLanding && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#003366] border-t-2 border-[#FF9933] px-2 py-1.5 flex items-center justify-around text-white">
          <NavLink
            to="/farmer/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-1.5 py-1 rounded-2xs text-[10px] font-bold transition-colors ${
                isActive ? "text-[#FF9933] bg-[#002244]" : "text-white/80 hover:text-white"
              }`
            }
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>{isHindi ? "डैशबोर्ड" : "Home"}</span>
          </NavLink>

          <NavLink
            to="/farmer/centres"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-1.5 py-1 rounded-2xs text-[10px] font-bold transition-colors ${
                isActive ? "text-[#FF9933] bg-[#002244]" : "text-white/80 hover:text-white"
              }`
            }
          >
            <MapPin className="w-4 h-4 mb-0.5" />
            <span>{isHindi ? "मंडी केंद्र" : "Centres"}</span>
          </NavLink>

          <NavLink
            to="/farmer/book-slot"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-1.5 py-1 rounded-2xs text-[10px] font-bold transition-colors ${
                isActive ? "text-[#FF9933] bg-[#002244]" : "text-white/80 hover:text-white"
              }`
            }
          >
            <CalendarCheck className="w-4 h-4 mb-0.5" />
            <span>{isHindi ? "स्लॉट बुकिंग" : "Book Slot"}</span>
          </NavLink>

          <NavLink
            to="/farmer/queue"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-1.5 py-1 rounded-2xs text-[10px] font-bold transition-colors ${
                isActive ? "text-[#FF9933] bg-[#002244]" : "text-white/80 hover:text-white"
              }`
            }
          >
            <ListOrdered className="w-4 h-4 mb-0.5" />
            <span>{isHindi ? "लाइव कतार" : "Queue"}</span>
          </NavLink>

          <NavLink
            to="/farmer/notifications"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-1.5 py-1 rounded-2xs text-[10px] font-bold transition-colors ${
                isActive ? "text-[#FF9933] bg-[#002244]" : "text-white/80 hover:text-white"
              }`
            }
          >
            <User className="w-4 h-4 mb-0.5" />
            <span>{isHindi ? "सूचनाएं" : "Notices"}</span>
          </NavLink>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <KrishiQProvider>
        <LayoutContent />
      </KrishiQProvider>
    </BrowserRouter>
  );
}

export default App;
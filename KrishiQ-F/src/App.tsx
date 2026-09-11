import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, NavLink } from "react-router-dom";
import { KrishiQProvider, useKrishiQ } from "./context/KrishiQContext";
import { Navbar } from "./components/common/Navbar";
import { Sidebar } from "./components/common/Sidebar";
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const { role } = useKrishiQ();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F6F8F4] flex flex-col text-[#17211B]">
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
        isSidebarExpanded={isSidebarExpanded}
        onToggleSidebarExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />

      <div className="flex-1 flex relative">
        {!isLanding && (
          <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            isExpanded={isSidebarExpanded}
            onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
          />
        )}

        <main
          className={
            "flex-1 p-4 sm:p-6 transition-all duration-200 pb-20 lg:pb-8 " +
            (!isLanding ? "lg:pl-[236px]" : "")
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

      {/* Mobile Bottom Navigation for Farmer role */}
      {role === "farmer" && !isLanding && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E4E9E5] px-2 py-1.5 flex items-center justify-around card-shadow">
          <NavLink
            to="/farmer/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-1.5 py-1 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? "text-[#123D2D] font-bold bg-[#EEF5EF]" : "text-[#66736B]"
              }`
            }
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>{t("nav.overview")}</span>
          </NavLink>

          <NavLink
            to="/farmer/centres"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-1.5 py-1 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? "text-[#123D2D] font-bold bg-[#EEF5EF]" : "text-[#66736B]"
              }`
            }
          >
            <MapPin className="w-5 h-5 mb-0.5" />
            <span>{t("nav.centres")}</span>
          </NavLink>

          <NavLink
            to="/farmer/book-slot"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-1.5 py-1 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? "text-[#123D2D] font-bold bg-[#EEF5EF]" : "text-[#66736B]"
              }`
            }
          >
            <CalendarCheck className="w-5 h-5 mb-0.5" />
            <span>{t("nav.bookings")}</span>
          </NavLink>

          <NavLink
            to="/farmer/queue"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-1.5 py-1 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? "text-[#123D2D] font-bold bg-[#EEF5EF]" : "text-[#66736B]"
              }`
            }
          >
            <ListOrdered className="w-5 h-5 mb-0.5" />
            <span>{t("nav.queue")}</span>
          </NavLink>

          <NavLink
            to="/farmer/notifications"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-1.5 py-1 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? "text-[#123D2D] font-bold bg-[#EEF5EF]" : "text-[#66736B]"
              }`
            }
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>{t("nav.profile")}</span>
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
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { KrishiQProvider, useKrishiQ } from "./context/KrishiQContext";
import { Navbar } from "./components/common/Navbar";
import { Sidebar } from "./components/common/Sidebar";
import { ToastContainer } from "./components/common/Toast";

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
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      <div className="flex-1 flex">
        {!isLanding && (
          <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <main
          className={
            "flex-1 p-4 sm:p-6 lg:p-8 transition-all " +
            (!isLanding ? "lg:pl-72" : "")
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
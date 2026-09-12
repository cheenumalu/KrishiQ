import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import {
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  AlertTriangle,
  TrendingUp,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export const AdminDashboard: React.FC = () => {
  const { addToast } = useKrishiQ();
  const { t, isHindi, formatLocation } = useLanguage();
  const navigate = useNavigate();
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const waitTimeByCentreData = [
    { name: isHindi ? "धार रोड" : "Dhar Road", wait: 165 },
    { name: isHindi ? "देपालपुर" : "Depalpur", wait: 68 },
    { name: isHindi ? "शिवाजी नगर" : "Shivaji Nagar", wait: 42 },
    { name: isHindi ? "सांवेर" : "Sanwer Hub", wait: 28 },
    { name: isHindi ? "महू" : "Mhow APMC", wait: 35 },
  ];

  const hourlyVolumeData = [
    { hour: isHindi ? "08:00 सुबह" : "08:00 AM", volume: 180 },
    { hour: isHindi ? "09:00 सुबह" : "09:00 AM", volume: 340 },
    { hour: isHindi ? "10:00 सुबह" : "10:00 AM", volume: 480 },
    { hour: isHindi ? "11:00 सुबह" : "11:00 AM", volume: 520 },
    { hour: isHindi ? "12:00 दोपहर" : "12:00 PM", volume: 490 },
    { hour: isHindi ? "01:00 दोपहर" : "01:00 PM", volume: 410 },
    { hour: isHindi ? "02:00 दोपहर" : "02:00 PM", volume: 360 },
  ];

  const handleToggleAction = (actionKey: string, label: string) => {
    setCompletedActions((prev) => {
      const updated = { ...prev, [actionKey]: !prev[actionKey] };
      if (updated[actionKey]) {
        addToast(
          isHindi ? "निर्देश भेजा गया" : "Directive Dispatched",
          isHindi ? `कार्रवाई निष्पादित: "${label}"` : `Action executed: "${label}"`,
          "success"
        );
      }
      return updated;
    });
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-12 font-sans">
      
      {/* 1. STATE COMMAND CONTROL HEADER */}
      <div className="bg-white dark:bg-[#131D28] border-2 border-[#003366] dark:border-[#1E3A8A] rounded-xs shadow-xs overflow-hidden">
        <div className="bg-[#003366] text-white px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#FF9933]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider">
              {isHindi ? "राज्य कृषि विपणन बोर्ड • केंद्रीय नियंत्रण कक्ष एवं टेलीमेट्री" : "State Agricultural Marketing Board • Central Command & Telemetry"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#15803D] text-white text-[10px] font-bold rounded-2xs uppercase">
              {isHindi ? "लाइव राज्य ग्रिड: सक्रिय" : "Live State Grid: ACTIVE"}
            </span>
            <span className="text-[11px] text-slate-200">
              {isHindi ? "42 मंडी केंद्र कनेक्टेड" : "42 Mandis Synchronized"}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#003366] dark:text-[#38BDF8] tracking-tight">
              {isHindi ? "राज्य उपार्जन एवं भीड़ प्रबंधन कमांड केंद्र" : "State Procurement & Congestion Command Desk"}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {isHindi ? "इंदौर एवं उज्जैन संभाग • वास्तविक समय कतार संतुलन एवं 4-घंटे का अग्रिम पूर्वानुमान" : "Indore & Ujjain Divisions • Real-time queue balancing & 4-hour congestion forecasting"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/admin/simulator">
              <Button variant="secondary" size="sm" leftIcon={<Sliders className="w-3.5 h-3.5" />}>
                {t("admin.whatIfSimulatorBtn")}
              </Button>
            </Link>
            <Link to="/admin/centres">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                {t("admin.viewCentresBtn")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. UNIFIED METRIC STRIP */}
      <div className="bg-white dark:bg-[#131D28] rounded-xs border border-[#CBD5E1] dark:border-slate-700 shadow-xs grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-[#CBD5E1] dark:divide-slate-700">
        
        {/* Metric 1 */}
        <div className="p-3.5">
          <div className="text-2xl sm:text-3xl font-black leading-none text-[#003366] dark:text-[#38BDF8] tabular-nums font-mono">
            42
          </div>
          <div className="text-[11px] font-bold uppercase text-slate-500 mt-1">
            {t("admin.activeCentres")}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5">
          <div className="text-2xl sm:text-3xl font-black leading-none text-[#15803D] tabular-nums font-mono">
            31 {t("common.min")}
          </div>
          <div className="text-[11px] font-bold uppercase text-slate-500 mt-1">
            {t("admin.averageWaitTime")}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-3.5">
          <div className="text-2xl sm:text-3xl font-black leading-none text-[#003366] dark:text-[#38BDF8] tabular-nums font-mono">
            64%
          </div>
          <div className="text-[11px] font-bold uppercase text-slate-500 mt-1">
            {t("admin.networkCapacity")}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-3.5">
          <div className="text-2xl sm:text-3xl font-black leading-none text-slate-800 dark:text-white tabular-nums font-mono">
            3,920
          </div>
          <div className="text-[11px] font-bold uppercase text-slate-500 mt-1">
            {t("admin.farmersServedToday")}
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-3.5 bg-red-50/50 dark:bg-red-950/20">
          <div className="text-2xl sm:text-3xl font-black leading-none text-[#B91C1C] tabular-nums font-mono">
            1
          </div>
          <div className="text-[11px] font-bold uppercase text-[#B91C1C] mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" />
            {t("admin.criticalCentres")}
          </div>
        </div>

      </div>

      {/* 3. NETWORK MAP AS THE MAIN VISUAL */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-1.5">
          <h2 className="text-sm sm:text-base font-black text-[#003366] dark:text-[#38BDF8] uppercase tracking-wide">
            {t("admin.networkStatusTitle")}
          </h2>
          <span className="text-xs text-slate-500 font-mono">{t("admin.realtimeTelemetry")}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* 71% Map Card */}
          <div className="lg:col-span-8 flex flex-col h-[400px] bg-[#0F172A] rounded-xs border border-[#CBD5E1] overflow-hidden relative">
            <div className="px-4 py-2 bg-[#003366] text-white flex items-center justify-between text-xs font-bold shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF9933]" />
                <span className="uppercase tracking-wide">{isHindi ? "संभागीय उपार्जन नेटवर्क नक्शा (42 केंद्र)" : "Regional Procurement Grid Map"}</span>
              </div>
              <span className="text-[11px] text-slate-300">
                {isHindi ? "इंदौर संभाग" : "Indore Division"}
              </span>
            </div>

            <div className="relative flex-1 overflow-hidden select-none">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <line x1="30%" y1="40%" x2="60%" y2="50%" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3" />
                <line x1="60%" y1="50%" x2="80%" y2="30%" stroke="#EF4444" strokeWidth="2" />
                <line x1="60%" y1="50%" x2="40%" y2="70%" stroke="#22C55E" strokeWidth="2" />
              </svg>

              {/* Mandi Pins */}
              <div className="absolute left-[30%] top-[40%] -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="w-7 h-7 rounded-xs bg-[#15803D] text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">
                  A
                </div>
                <span className="px-1.5 py-0.5 rounded-2xs bg-black/85 text-white text-[9px] font-bold block mt-1">
                  सांवेर • 28m
                </span>
              </div>

              <div className="absolute left-[60%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="w-7 h-7 rounded-xs bg-[#B91C1C] text-white flex items-center justify-center font-bold text-xs border border-white shadow-md animate-pulse">
                  B
                </div>
                <span className="px-1.5 py-0.5 rounded-2xs bg-[#B91C1C] text-white text-[9px] font-bold block mt-1">
                  धार रोड • 165m ⚠
                </span>
              </div>

              <div className="absolute left-[80%] top-[30%] -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="w-7 h-7 rounded-xs bg-[#003366] text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">
                  C
                </div>
                <span className="px-1.5 py-0.5 rounded-2xs bg-black/85 text-white text-[9px] font-bold block mt-1">
                  शिवाजी नगर • 42m
                </span>
              </div>

              <div className="absolute left-[40%] top-[70%] -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="w-7 h-7 rounded-xs bg-[#15803D] text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">
                  D
                </div>
                <span className="px-1.5 py-0.5 rounded-2xs bg-black/85 text-white text-[9px] font-bold block mt-1">
                  महू मंडी • 35m
                </span>
              </div>

              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 p-2 rounded-xs text-[10px] text-white flex items-center justify-between border border-slate-700">
                <span className="font-semibold text-[#FF9933]">
                  {isHindi ? "रेड अलर्ट: धार रोड उपार्जन केंद्र पर क्षमता से अधिक आवक" : "CRITICAL ALERT: Dhar Road Mandi Over Capacity (165m Wait)"}
                </span>
                <span className="text-slate-400 font-mono">LIVE TELEMETRY</span>
              </div>
            </div>
          </div>

          {/* 29% Directive Dispatch Box */}
          <Card padding="md" className="lg:col-span-4 border-[#CBD5E1] flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="pb-1.5 border-b border-[#CBD5E1] dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#003366] dark:text-[#38BDF8]">
                  {isHindi ? "त्वरित प्रशासनिक निर्देश" : "Dispatch Directives"}
                </span>
                <Badge variant="critical" size="sm">1 Alert</Badge>
              </div>

              <div className="p-3 bg-[#FEF2F2] dark:bg-[#2A0808] border border-[#FECACA] rounded-xs text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#B91C1C] block font-bold">धार रोड मंडी: गंभीर भीड़</strong>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                      {isHindi
                        ? "आवक क्षमता से 180% अधिक। सांवेर एवं देपालपुर की ओर 40 ट्रैक्टर डायवर्ट करने की सिफारिश।"
                        : "Inflow 180% above threshold. Divert 40 upcoming bookings to Sanwer Hub."}
                    </p>
                  </div>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  className="w-full"
                  onClick={() => handleToggleAction("dhar_divert", isHindi ? "धार रोड डायवर्जन निर्देश" : "Dhar Road Diversion Directive")}
                >
                  {completedActions.dhar_divert ? (isHindi ? "✓ निर्देश प्रसारित" : "✓ Directive Dispatched") : (isHindi ? "डायवर्जन निर्देश जारी करें" : "Issue Diversion Directive")}
                </Button>
              </div>

              <div className="p-3 bg-[#EFF6FF] dark:bg-[#0C2340] border border-[#BFDBFE] rounded-xs text-xs space-y-1.5">
                <strong className="text-[#003366] dark:text-[#38BDF8] block font-bold">
                  {isHindi ? "अतिरिक्त कांटा तैनाती निर्देश" : "Deploy Mobile Weighbridge"}
                </strong>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  {isHindi
                    ? "भीड़भाड़ वाले समय में काउंटर 4 को तौल कार्य हेतु सक्रिय करें।"
                    : "Activate standby mobile weighbridge #4 at Shivaji Nagar."}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => handleToggleAction("counter_deploy", isHindi ? "अतिरिक्त कांटा निर्देश" : "Deploy Weighbridge")}
                >
                  {completedActions.counter_deploy ? (isHindi ? "✓ तैनात" : "✓ Deployed") : (isHindi ? "कांटा सक्रिय करें" : "Activate Counter")}
                </Button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-right">
              <Link to="/admin/centres" className="text-xs font-bold text-[#003366] dark:text-[#38BDF8] hover:underline">
                {isHindi ? "सभी 42 केंद्रों की रिपोर्ट देखें →" : "View All 42 Mandis Report →"}
              </Link>
            </div>
          </Card>

        </div>
      </div>

      {/* 4. GOVERNMENT INSIGHT STRIP */}
      <div className="p-3.5 rounded-xs bg-[#EFF6FF] dark:bg-[#0C2340] border border-[#BFDBFE] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 max-w-[1100px]">
          <ShieldCheck className="w-4 h-4 text-[#003366] dark:text-[#38BDF8] shrink-0" />
          <span className="font-black text-[#003366] dark:text-[#38BDF8] uppercase tracking-wide shrink-0">
            {isHindi ? "शासकीय नीति सिफ़ारिश" : "State Advisory"}:
          </span>
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {t("admin.krishiqInsightText")}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/simulator")}
          className="text-xs font-bold text-[#003366] dark:text-[#38BDF8] hover:underline shrink-0 cursor-pointer uppercase"
        >
          {t("admin.viewRecommendationLink")} →
        </button>
      </div>

      {/* 5. SECONDARY ANALYTICS (GRAPHS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Column 1: Congestion Trend */}
        <Card padding="md" className="space-y-3 border-[#CBD5E1]">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#CBD5E1] dark:border-slate-700">
            <span className="text-xs uppercase font-bold text-[#003366] dark:text-[#38BDF8]">
              {t("admin.congestionTrendTitle")}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{t("admin.peakTimeLabel")}</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyVolumeData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip contentStyle={{ borderRadius: "2px", border: "1px solid #CBD5E1", fontSize: "11px" }} />
                <Area type="monotone" dataKey="volume" stroke="#003366" fill="#EFF6FF" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Column 2: Capacity Utilisation */}
        <Card padding="md" className="space-y-3 border-[#CBD5E1]">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#CBD5E1] dark:border-slate-700">
            <span className="text-xs uppercase font-bold text-[#003366] dark:text-[#38BDF8]">
              {t("admin.capacityUtilisationTitle")}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{t("admin.avgCapacityLabel")}</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waitTimeByCentreData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip contentStyle={{ borderRadius: "2px", border: "1px solid #CBD5E1", fontSize: "11px" }} />
                <Bar dataKey="wait" fill="#003366" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Column 3: Top Mandis Performance */}
        <Card padding="md" className="space-y-3 border-[#CBD5E1]">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#CBD5E1] dark:border-slate-700">
            <span className="text-xs uppercase font-bold text-[#003366] dark:text-[#38BDF8]">
              {t("admin.topMandiClearanceTitle")}
            </span>
            <span className="text-[10px] text-[#15803D] font-bold uppercase">{t("admin.todayLabel")}</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-2xs bg-[#F8FAFC] dark:bg-[#0E1620] border border-[#CBD5E1] dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-white">{formatLocation("Shivaji Nagar")} (Centre B)</span>
              <strong className="font-mono tabular-nums text-[#15803D]">3,240 {t("common.quintal")}</strong>
            </div>
            <div className="flex justify-between items-center p-2 rounded-2xs bg-[#F8FAFC] dark:bg-[#0E1620] border border-[#CBD5E1] dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-white">{formatLocation("Sanwer")} (Centre C)</span>
              <strong className="font-mono tabular-nums text-[#003366] dark:text-[#38BDF8]">1,890 {t("common.quintal")}</strong>
            </div>
            <div className="flex justify-between items-center p-2 rounded-2xs bg-[#F8FAFC] dark:bg-[#0E1620] border border-[#CBD5E1] dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-white">{formatLocation("Depalpur")} (Centre D)</span>
              <strong className="font-mono tabular-nums text-[#003366] dark:text-[#38BDF8]">2,450 {t("common.quintal")}</strong>
            </div>
            <div className="flex justify-between items-center p-2 rounded-2xs bg-[#F8FAFC] dark:bg-[#0E1620] border border-[#CBD5E1] dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-white">{formatLocation("Mhow")} (Centre E)</span>
              <strong className="font-mono tabular-nums text-[#003366] dark:text-[#38BDF8]">1,620 {t("common.quintal")}</strong>
            </div>
          </div>
        </Card>

      </div>

    </div>
  );
};
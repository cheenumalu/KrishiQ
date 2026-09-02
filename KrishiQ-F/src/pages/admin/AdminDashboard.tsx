import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import {
  Sliders,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      
      {/* 1. SIMPLE CLEAN PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-1 border-b border-[#E4E9E5]">
        <div>
          <h1 className="text-[30px] sm:text-[32px] font-bold text-[#17211B] tracking-[-0.025em] leading-[1.1]">
            {t("admin.overviewTitle")}
          </h1>
          <p className="text-[13px] text-[#66736B] leading-[1.4] mt-0.5">
            {t("admin.overviewSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/simulator">
            <Button variant="secondary" size="md" leftIcon={<Sliders className="w-4 h-4" />}>
              {t("admin.whatIfSimulatorBtn")}
            </Button>
          </Link>
          <Link to="/admin/centres">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {t("admin.viewCentresBtn")}
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. UNIFIED METRIC STRIP */}
      <Card padding="none" className="bg-white rounded-[14px] border border-[#E4E9E5] card-shadow h-[88px] flex items-center divide-x divide-[#E4E9E5] overflow-x-auto">
        
        {/* Metric 1 */}
        <div className="flex-1 min-w-[140px] px-5 py-3">
          <div className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            42
          </div>
          <div className="text-[12px] font-medium text-[#66736B] mt-1.5">
            {t("admin.activeCentres")}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex-1 min-w-[140px] px-5 py-3">
          <div className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            31 {t("common.min")}
          </div>
          <div className="text-[12px] font-medium text-[#66736B] mt-1.5">
            {t("admin.averageWaitTime")}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex-1 min-w-[140px] px-5 py-3">
          <div className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            64%
          </div>
          <div className="text-[12px] font-medium text-[#66736B] mt-1.5">
            {t("admin.networkCapacity")}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="flex-1 min-w-[140px] px-5 py-3">
          <div className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            3,920
          </div>
          <div className="text-[12px] font-medium text-[#66736B] mt-1.5">
            {t("admin.farmersServedToday")}
          </div>
        </div>

        {/* Metric 5 */}
        <div className="flex-1 min-w-[140px] px-5 py-3">
          <div className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#D95555] tabular-nums font-sans">
            1
          </div>
          <div className="text-[12px] font-semibold text-[#D95555] mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D95555]" />
            {t("admin.criticalCentres")}
          </div>
        </div>

      </Card>

      {/* 3. NETWORK MAP AS THE MAIN VISUAL */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#17211B] tracking-[-0.01em]">
            {t("admin.networkStatusTitle")}
          </h2>
          <span className="text-[12px] text-[#66736B]">{t("admin.realtimeTelemetry")}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* 71% Map Card */}
          <Card padding="none" className="lg:col-span-8 flex flex-col h-[400px] overflow-hidden">
            
            {/* Clean Light Surface Map Header */}
            <div className="px-5 h-[50px] bg-white border-b border-[#E4E9E5] flex items-center justify-between text-xs font-medium shrink-0">
              <span className="text-[14px] font-semibold text-[#17211B]">{t("admin.networkMapTitle")}</span>
              <div className="flex items-center gap-2 text-[#66736B]">
                <button className="px-2.5 py-1 rounded-lg bg-[#EEF5EF] text-[#123D2D] font-semibold hover:bg-[#E4E9E5] transition-colors cursor-pointer">
                  {t("admin.districtGridBtn")}
                </button>
                <button className="px-2.5 py-1 rounded-lg hover:bg-[#F6F8F4] transition-colors cursor-pointer">
                  {t("admin.heatViewBtn")}
                </button>
              </div>
            </div>

            {/* Map Body */}
            <div className="relative flex-1 bg-[#17211B] overflow-hidden select-none">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <line x1="30%" y1="60%" x2="55%" y2="40%" stroke="#D95555" strokeWidth="2" strokeDasharray="4" />
                <line x1="55%" y1="40%" x2="75%" y2="30%" stroke="#2F7D4A" strokeWidth="2" />
                <line x1="55%" y1="40%" x2="40%" y2="25%" stroke="#F2A93B" strokeWidth="2" />
              </svg>

              {/* Centre Pins */}
              <div className="absolute left-[30%] top-[60%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
                <span className="mb-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#D95555] text-white uppercase">
                  {t("common.critical")}
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#D95555] text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">A</div>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px]">
                  {formatLocation("Dhar Road")} ({isHindi ? "2 घंटे 45 मिनट" : "2h 45m"})
                </span>
              </div>

              <div className="absolute left-[55%] top-[40%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
                <span className="mb-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#2F7D4A] text-white uppercase">
                  {t("common.normal")}
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#2F7D4A] text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">B</div>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px]">
                  {formatLocation("Shivaji Nagar")} (42m)
                </span>
              </div>

              <div className="absolute left-[75%] top-[30%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
                <span className="mb-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#2F7D4A] text-white uppercase">
                  {t("common.normal")}
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#2F7D4A] text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">C</div>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px]">
                  {formatLocation("Sanwer")} (28m)
                </span>
              </div>

              <div className="absolute left-[40%] top-[25%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
                <span className="mb-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#F2A93B] text-slate-950 uppercase">
                  {t("common.warning")}
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#F2A93B] text-slate-950 flex items-center justify-center font-bold text-xs border border-white shadow-md">D</div>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px]">
                  {formatLocation("Depalpur")} ({isHindi ? "1 घंटा 08 मिनट" : "1h 08m"})
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/75 backdrop-blur-md p-2 rounded-xl text-[11px] text-white flex items-center justify-between">
                <span>
                  {isHindi
                    ? "जिला ग्रिड: 1 गंभीर, 1 चेतावनी, 40 सामान्य"
                    : "District Grid: 1 Critical, 1 Warning, 40 Normal"}
                </span>
                <span className="text-[#58A66B] font-mono">{t("farmer.liveGrid")}</span>
              </div>
            </div>
          </Card>

          {/* 29% Needs Attention Panel */}
          <Card padding="md" className="lg:col-span-4 flex flex-col justify-between h-[400px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E4E9E5]">
                <span className="text-[14px] font-semibold text-[#17211B]">
                  {t("admin.needsAttentionTitle")}
                </span>
                <span className="text-[12px] font-semibold text-[#66736B]">{t("admin.alertsCount")}</span>
              </div>

              <div className="space-y-3">
                
                {/* Alert Row 1 */}
                <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] hover:border-[#D95555]/40 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D95555] shrink-0" />
                      <h4 className="font-semibold text-[#17211B] text-[14px]">{formatLocation("Dhar Road")}</h4>
                    </div>
                  </div>
                  
                  <div className="text-[12px] text-[#66736B] font-sans tabular-nums pl-4">
                    {isHindi ? "2 घंटे 45 मिनट प्रतीक्षा · 136% क्षमता" : "2h 45m wait · 136% capacity"}
                  </div>

                  <div className="pt-1 text-right">
                    <button
                      onClick={() => handleToggleAction("dhar", isHindi ? "धार रोड आवक पुनर्वितरण" : "Redirect Dhar Road arrivals")}
                      className="text-[12px] font-semibold text-[#D95555] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {completedActions.dhar ? t("admin.directiveSent") : t("admin.investigateAction")}
                    </button>
                  </div>
                </div>

                {/* Alert Row 2 */}
                <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] hover:border-[#F2A93B]/40 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F2A93B] shrink-0" />
                      <h4 className="font-semibold text-[#17211B] text-[14px]">{formatLocation("Rajendra Mandi")}</h4>
                    </div>
                  </div>
                  
                  <div className="text-[12px] text-[#66736B] font-sans tabular-nums pl-4">
                    {isHindi ? "1 घंटा 35 मिनट प्रतीक्षा · 84% क्षमता" : "1h 35m wait · 84% capacity"}
                  </div>

                  <div className="pt-1 text-right">
                    <button
                      onClick={() => handleToggleAction("rajendra", isHindi ? "राजेंद्र मंडी निरीक्षण" : "Inspect Rajendra Mandi")}
                      className="text-[12px] font-semibold text-[#2F7D4A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {completedActions.rajendra ? t("admin.inspectedBadge") : t("admin.viewAction")}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-2 border-t border-[#E4E9E5] text-right">
              <Link to="/admin/centres" className="text-[12px] font-semibold text-[#2F7D4A] hover:underline">
                {t("admin.viewAllMandisLink")}
              </Link>
            </div>
          </Card>

        </div>
      </div>

      {/* 4. LIGHTWEIGHT KRISHIQ INSIGHT STRIP */}
      <div className="p-4 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 max-w-[1100px]">
          <Sparkles className="w-4 h-4 text-[#2F7D4A] shrink-0" />
          <span className="font-bold text-[#123D2D] shrink-0">{t("admin.krishiqInsightPrefix")}</span>
          <p className="text-[#17211B] text-[13px] leading-relaxed">
            {t("admin.krishiqInsightText")}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/simulator")}
          className="text-[12px] font-bold text-[#2F7D4A] hover:underline shrink-0 cursor-pointer"
        >
          {t("admin.viewRecommendationLink")}
        </button>
      </div>

      {/* 5. SECONDARY ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Column 1: Congestion Trend */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
            <span className="text-[14px] font-semibold text-[#17211B]">
              {t("admin.congestionTrendTitle")}
            </span>
            <span className="text-[11px] text-[#66736B]">{t("admin.peakTimeLabel")}</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyVolumeData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E9E5" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#66736B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#66736B" }} />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #E4E9E5", fontSize: "11px" }} />
                <Area type="monotone" dataKey="volume" stroke="#2F7D4A" fill="#EEF5EF" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Column 2: Capacity Utilisation */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
            <span className="text-[14px] font-semibold text-[#17211B]">
              {t("admin.capacityUtilisationTitle")}
            </span>
            <span className="text-[11px] text-[#66736B]">{t("admin.avgCapacityLabel")}</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waitTimeByCentreData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E9E5" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#66736B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#66736B" }} />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #E4E9E5", fontSize: "11px" }} />
                <Bar dataKey="wait" fill="#2F7D4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Column 3: Top Centres Performance */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
            <span className="text-[14px] font-semibold text-[#17211B]">
              {t("admin.topMandiClearanceTitle")}
            </span>
            <span className="text-[11px] text-[#2F7D4A] font-semibold">{t("admin.todayLabel")}</span>
          </div>
          <div className="space-y-2.5 text-xs text-[#17211B]">
            <div className="flex justify-between items-center p-2 rounded-lg bg-[#F6F8F4]">
              <span>{formatLocation("Shivaji Nagar")} (Centre B)</span>
              <strong className="font-sans tabular-nums text-[#2F7D4A]">3,240 {t("common.quintal")}</strong>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-[#F6F8F4]">
              <span>{formatLocation("Sanwer")} (Centre C)</span>
              <strong className="font-sans tabular-nums text-[#17211B]">1,890 {t("common.quintal")}</strong>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-[#F6F8F4]">
              <span>{formatLocation("Depalpur")} (Centre D)</span>
              <strong className="font-sans tabular-nums text-[#17211B]">2,450 {t("common.quintal")}</strong>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-[#F6F8F4]">
              <span>{formatLocation("Mhow")} (Centre E)</span>
              <strong className="font-sans tabular-nums text-[#17211B]">1,620 {t("common.quintal")}</strong>
            </div>
          </div>
        </Card>

      </div>

    </div>
  );
};
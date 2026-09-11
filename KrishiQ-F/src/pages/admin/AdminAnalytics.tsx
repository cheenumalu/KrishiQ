import React, { useMemo } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { HOURLY_ANALYTICS_DATA } from "../../data/mockData";
import { Card } from "../../components/common/Card";
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
  CartesianGrid,
  Legend
} from "recharts";
import { Activity, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";

export const AdminAnalytics: React.FC = () => {
  const { allBookings, centres } = useKrishiQ();
  const { isHindi } = useLanguage();

  const realtimeHourlyData = useMemo(() => {
    return HOURLY_ANALYTICS_DATA.map((base) => {
      const hourPrefix = base.hour.split(":")[0];
      const hourPeriod = base.hour.split(" ")[1];

      const extraArrivals = allBookings.filter((b) => {
        if (!b.slotTime) return false;
        return b.slotTime.includes(`${hourPrefix}:`) && b.slotTime.includes(hourPeriod);
      }).length;

      const extraProcessed = allBookings.filter((b) => {
        if (!b.slotTime) return false;
        return b.currentStageNumber >= 6 && b.slotTime.includes(`${hourPrefix}:`) && b.slotTime.includes(hourPeriod);
      }).length;

      const arrivals = base.arrivals + extraArrivals;
      const processed = base.processed + extraProcessed;
      const queueLength = Math.max(0, arrivals - processed);

      return {
        ...base,
        arrivals,
        processed,
        queueLength,
      };
    });
  }, [allBookings]);

  const totalProcuredToday = allBookings.reduce((acc, b) => acc + (b.weighing?.netWeightQuintals || 0), 48250);
  const totalDbtCleared = allBookings.reduce((acc, b) => acc + (b.payment?.grossAmount || 0), 84210000);
  const totalActiveMandis = centres.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E4E9E5] dark:border-[#202722]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#2F7D4A]/10 dark:bg-[#12281C] text-[#2F7D4A] dark:text-[#52DB89] text-[11px] font-bold border border-[#58A66B]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D4A] dark:bg-[#52DB89] animate-pulse" />
              {isHindi ? "राज्य स्तरीय रीयल-टाइम टेलीमेट्री" : "Statewide Real-Time Telemetry"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] dark:text-white tracking-tight mt-1">
            {isHindi ? "राज्य कृषि उपार्जन विश्लेषण" : "State Agricultural Procurement Analytics"}
          </h1>
          <p className="text-xs sm:text-sm text-[#66736B] dark:text-[#A0ABA4] font-medium mt-0.5">
            {isHindi
              ? "संभाग-स्तरीय उपार्जन मात्रा, क्षमता उपयोग एवं DBT अंतरण मेट्रिक्स।"
              : "District-wide procurement volumes, capacity utilization, and DBT settlement metrics."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="md" className="border-[#E4E9E5] dark:border-[#202722] dark:bg-[#0E1210] card-shadow">
          <span className="text-xs text-[#66736B] dark:text-[#A0ABA4] block font-medium">{isHindi ? "आज का कुल उपार्जन" : "Total Procurement Today"}</span>
          <p className="text-2xl font-extrabold text-[#17211B] dark:text-white mt-1 font-sans tabular-nums">
            {totalProcuredToday.toLocaleString()} {isHindi ? "क्विंटल" : "Qtl"}
          </p>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] dark:border-[#202722] dark:bg-[#0E1210] card-shadow">
          <span className="text-xs text-[#66736B] dark:text-[#A0ABA4] block font-medium">{isHindi ? "स्वीकृत DBT राशि" : "DBT Amount Cleared"}</span>
          <p className="text-2xl font-extrabold text-[#2F7D4A] dark:text-[#52DB89] mt-1 font-sans tabular-nums">
            ₹{(totalDbtCleared / 10000000).toFixed(2)} Cr
          </p>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] dark:border-[#202722] dark:bg-[#0E1210] card-shadow">
          <span className="text-xs text-[#66736B] dark:text-[#A0ABA4] block font-medium">{isHindi ? "औसत प्रतीक्षा समय" : "Average Wait Time"}</span>
          <p className="text-2xl font-extrabold text-[#17211B] dark:text-white mt-1 font-sans tabular-nums">38 {isHindi ? "मिनट" : "min"}</p>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] dark:border-[#202722] dark:bg-[#0E1210] card-shadow">
          <span className="text-xs text-[#66736B] dark:text-[#A0ABA4] block font-medium">{isHindi ? "सक्रिय उपार्जन केंद्र" : "Active Mandis"}</span>
          <p className="text-2xl font-extrabold text-[#17211B] dark:text-white mt-1 font-sans tabular-nums">{totalActiveMandis}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="md" className="border-[#E4E9E5] dark:border-[#202722] dark:bg-[#0E1210] card-shadow">
          <span className="text-xs font-bold text-[#123D2D] dark:text-[#52DB89] uppercase block mb-2">
            {isHindi ? "प्रति घंटे जिला उपार्जन आवक प्रवाह" : "Hourly District Procurement Inflow"}
          </span>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={realtimeHourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminInflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F7D4A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2F7D4A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#23362B" opacity={0.3} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#A0ABA4" }} />
                <YAxis tick={{ fontSize: 10, fill: "#A0ABA4" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141816",
                    borderRadius: "0.75rem",
                    border: "1px solid #23362B",
                    color: "#FFFFFF",
                    fontSize: "11px",
                  }}
                  itemStyle={{ color: "#FFFFFF" }}
                />
                <Area type="monotone" dataKey="processed" stroke="#2F7D4A" fill="url(#adminInflowGrad)" strokeWidth={2} name={isHindi ? "उपार्जित क्विंटल" : "Procured Lots"} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] dark:border-[#202722] dark:bg-[#0E1210] card-shadow">
          <span className="text-xs font-bold text-[#123D2D] dark:text-[#52DB89] uppercase block mb-2">
            {isHindi ? "प्रति घंटे औसत मंडी कतार लंबाई" : "Average Mandi Queue Length by Hour"}
          </span>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={realtimeHourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23362B" opacity={0.3} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#A0ABA4" }} />
                <YAxis tick={{ fontSize: 10, fill: "#A0ABA4" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141816",
                    borderRadius: "0.75rem",
                    border: "1px solid #23362B",
                    color: "#FFFFFF",
                    fontSize: "11px",
                  }}
                  itemStyle={{ color: "#FFFFFF" }}
                />
                <Bar dataKey="queueLength" name={isHindi ? "कतार लंबाई" : "Queue Length"} fill="#F2A93B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
import React, { useMemo } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { HOURLY_ANALYTICS_DATA, STAGE_CYCLE_TIMES } from "../../data/mockData";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { Activity, Clock, Users, ArrowUpRight, CheckCircle2, Zap } from "lucide-react";

export const CentreAnalytics: React.FC = () => {
  const { selectedCentre, allBookings, queueItems } = useKrishiQ();
  const { isHindi, formatLocation } = useLanguage();

  // Dynamic real-time Hourly Flow synced with active bookings and stages
  const realtimeHourlyData = useMemo(() => {
    const centreBookings = allBookings.filter((b) => b.centreId === selectedCentre.id);

    return HOURLY_ANALYTICS_DATA.map((base) => {
      const hourPrefix = base.hour.split(":")[0];
      const hourPeriod = base.hour.split(" ")[1];

      const extraArrivals = centreBookings.filter((b) => {
        if (!b.slotTime) return false;
        return b.slotTime.includes(`${hourPrefix}:`) && b.slotTime.includes(hourPeriod);
      }).length;

      const extraProcessed = centreBookings.filter((b) => {
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
  }, [allBookings, selectedCentre.id]);

  // Dynamic real-time Station Cycle Times synced with actual queue stages
  const realtimeStageCycles = useMemo(() => {
    const hasBottleneck = selectedCentre.status === "critical" || selectedCentre.status === "warning";
    const queueAtWeighbridge = queueItems.filter((q) => q.stageNumber === 5).length;
    const queueAtQC = queueItems.filter((q) => q.stageNumber === 4).length;
    const queueAtGate = queueItems.filter((q) => q.stageNumber <= 3).length;

    return STAGE_CYCLE_TIMES.map((stage) => {
      let dynamicAvg = stage.avgMinutes;

      if (stage.name === "Gate Intake") {
        dynamicAvg = Math.max(2.5, Math.min(6, 3.2 + queueAtGate * 0.4));
      } else if (stage.name === "Moisture QC") {
        dynamicAvg = queueAtQC > 2 ? 10.5 : queueAtQC > 0 ? 8.8 : 6.2;
      } else if (stage.name === "Weighbridge") {
        dynamicAvg = hasBottleneck ? (queueAtWeighbridge > 1 ? 14.5 : 12.0) : 7.8;
      } else if (stage.name === "Unloading") {
        dynamicAvg = 9.8;
      } else if (stage.name === "Documentation") {
        dynamicAvg = 4.4;
      }

      return {
        ...stage,
        avgMinutes: Number(dynamicAvg.toFixed(1)),
        name: isHindi
          ? stage.name === "Gate Intake" ? "गेट आवक पंजीकरण"
          : stage.name === "Moisture QC" ? "नमी व गुणवत्ता परख"
          : stage.name === "Weighbridge" ? "तौल कांटा (वजन)"
          : stage.name === "Unloading" ? "अनलोडिंग व छनाई"
          : "दस्तावेज़ एवं DBT भुगतान"
          : stage.name,
      };
    });
  }, [selectedCentre, queueItems, isHindi]);

  const totalArrivalsToday = realtimeHourlyData.reduce((acc, h) => acc + h.arrivals, 0);
  const totalProcessedToday = realtimeHourlyData.reduce((acc, h) => acc + h.processed, 0);
  const totalAvgCycleMins = realtimeStageCycles.reduce((acc, s) => acc + s.avgMinutes, 0).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E4E9E5] dark:border-[#202722]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#2F7D4A]/10 dark:bg-[#12281C] text-[#2F7D4A] dark:text-[#52DB89] text-[11px] font-bold border border-[#58A66B]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D4A] dark:bg-[#52DB89] animate-pulse" />
              {isHindi ? "लाइव रीयल-टाइम डेटा स्ट्रीम" : "Live Real-Time Telemetry"}
            </span>
            <span className="text-xs text-[#66736B] dark:text-[#A0ABA4]">
              {selectedCentre.code}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] dark:text-white tracking-tight mt-1">
            {isHindi ? "केंद्र उपार्जन गति एवं चक्र समय विश्लेषण" : "Centre Throughput & Cycle Time Analytics"}
          </h1>
          <p className="text-xs sm:text-sm text-[#66736B] dark:text-[#A0ABA4] font-medium mt-0.5">
            {isHindi
              ? `${formatLocation(selectedCentre.name)} के लिए वास्तविक समय परिचालन मेट्रिक्स।`
              : `Real-time operational performance and stage duration metrics for ${formatLocation(selectedCentre.name)}.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#EEF5EF] dark:bg-[#12281C] border border-[#58A66B]/30 dark:border-[#58A66B]/50 text-xs font-semibold text-[#123D2D] dark:text-[#52DB89] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#2F7D4A] dark:text-[#52DB89]" />
            <span>{isHindi ? "सक्रिय कतार:" : "Active Queue:"} {queueItems.filter((q) => q.status !== "COMPLETED").length} {isHindi ? "किसान" : "Farmers"}</span>
          </div>
        </div>
      </div>

      {/* Real-Time KPI Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md" className="border-[#E4E9E5] dark:border-[#202722] dark:bg-[#0E1210] card-shadow">
          <div className="flex items-center justify-between text-xs text-[#66736B] dark:text-[#A0ABA4]">
            <span className="font-medium">{isHindi ? "आज की कुल आवक" : "Total Arrivals Today"}</span>
            <ArrowUpRight className="w-4 h-4 text-[#F2A93B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#17211B] dark:text-white mt-1.5 font-sans tabular-nums">
            {totalArrivalsToday} <span className="text-sm font-normal text-[#66736B] dark:text-[#A0ABA4]">{isHindi ? "ट्रैक्टर/लॉट" : "Lots"}</span>
          </p>
          <span className="text-[11px] text-[#2F7D4A] dark:text-[#52DB89] font-semibold mt-1 block">
            {totalProcessedToday} {isHindi ? "संपादित एवं तौल पूर्ण" : "Cleared & Intake Completed"}
          </span>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] dark:border-[#202722] dark:bg-[#0E1210] card-shadow">
          <div className="flex items-center justify-between text-xs text-[#66736B] dark:text-[#A0ABA4]">
            <span className="font-medium">{isHindi ? "औसत पूर्ण चक्र समय" : "Avg End-to-End Cycle Time"}</span>
            <Clock className="w-4 h-4 text-[#2F7D4A]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#123D2D] dark:text-[#52DB89] mt-1.5 font-sans tabular-nums">
            {totalAvgCycleMins} <span className="text-sm font-normal text-[#66736B] dark:text-[#A0ABA4]">{isHindi ? "मिनट / किसान" : "min / farmer"}</span>
          </p>
          <span className="text-[11px] text-[#66736B] dark:text-[#A0ABA4] font-medium mt-1 block">
            {isHindi ? "लक्ष्य: 30 मिनट प्रति किसान" : "Target Benchmark: 30 min per farmer"}
          </span>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] dark:border-[#202722] dark:bg-[#0E1210] card-shadow">
          <div className="flex items-center justify-between text-xs text-[#66736B] dark:text-[#A0ABA4]">
            <span className="font-medium">{isHindi ? "निपटान क्षमता दर" : "Clearance Efficiency"}</span>
            <CheckCircle2 className="w-4 h-4 text-[#2F7D4A]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#17211B] dark:text-white mt-1.5 font-sans tabular-nums">
            {Math.round((totalProcessedToday / Math.max(1, totalArrivalsToday)) * 100)}%
          </p>
          <span className="text-[11px] text-[#2F7D4A] dark:text-[#52DB89] font-semibold mt-1 block">
            {isHindi ? "कतार प्रवाह सुचारू है" : "Intake Flow Performing Stably"}
          </span>
        </Card>
      </div>

      {/* Real-time Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Hourly Arrivals vs Processed Lots */}
        <Card padding="md" className="border-[#E4E9E5] dark:border-[#202722] dark:bg-[#0E1210] card-shadow">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-[#123D2D] dark:text-[#52DB89] uppercase tracking-wider">
                {isHindi ? "प्रति घंटे आवक बनाम संसाधित उपज" : "Hourly Arrivals vs Processed Lots"}
              </h3>
              <p className="text-[11px] text-[#66736B] dark:text-[#A0ABA4] mt-0.5">
                {isHindi ? "लाइव पंजीकृत आवक (पीला) बनाम पूर्ण तौल/निपटान (हरा)" : "Live incoming arrivals (Amber) vs completed lots (Green)"}
              </p>
            </div>
            <Badge variant="normal">
              {isHindi ? "लाइव" : "Live"}
            </Badge>
          </div>

          <div className="h-64 w-full">
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
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="arrivals" name={isHindi ? "आवक (Arrivals)" : "Arrivals"} fill="#F2A93B" radius={[3, 3, 0, 0]} />
                <Bar dataKey="processed" name={isHindi ? "संपादित (Processed)" : "Processed"} fill="#2F7D4A" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Average Station Cycle Times */}
        <Card padding="md" className="border-[#E4E9E5] dark:border-[#202722] dark:bg-[#0E1210] card-shadow">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-[#123D2D] dark:text-[#52DB89] uppercase tracking-wider">
                {isHindi ? "प्रति किसान औसत चक्र समय (मिनट)" : "Average Station Cycle Times (Minutes per Farmer)"}
              </h3>
              <p className="text-[11px] text-[#66736B] dark:text-[#A0ABA4] mt-0.5">
                {isHindi ? "वास्तविक स्टेशन समय (हरा) बनाम लक्षित मानक (ग्रे)" : "Live station duration (Green) vs target benchmark (Gray)"}
              </p>
            </div>
            <Badge variant="info">
              {isHindi ? "गति ट्रैकिंग" : "Speed Tracking"}
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={realtimeStageCycles} layout="vertical" margin={{ top: 5, right: 15, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23362B" opacity={0.3} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#A0ABA4" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#A0ABA4" }} width={90} />
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
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="avgMinutes" name={isHindi ? "वास्तविक (Actual min)" : "Actual (min)"} fill="#2F7D4A" radius={[0, 4, 4, 0]} />
                <Bar dataKey="targetMinutes" name={isHindi ? "लक्ष्य (Target min)" : "Target (min)"} fill="#4B5850" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};
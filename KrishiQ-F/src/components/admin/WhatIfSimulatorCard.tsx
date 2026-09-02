import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { runWhatIfSimulation } from "../../utils/calculations";
import { Sparkles, Zap } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export const WhatIfSimulatorCard: React.FC = () => {
  const { centres, simParams, setSimParams } = useKrishiQ();
  const { t, isHindi, formatLocation } = useLanguage();

  const targetCentre = centres.find((c) => c.id === simParams.targetCentreId) || centres[0];
  const simResult = runWhatIfSimulation(simParams, targetCentre);

  return (
    <div className="space-y-6">
      
      {/* Simulator Hero Controls */}
      <Card padding="lg" className="border-[#E4E9E5] card-shadow">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E4E9E5]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#17211B]">{t("admin.simulatorHeading")}</h3>
              <Badge variant="info">{t("admin.policySandboxBadge")}</Badge>
            </div>
            <p className="text-xs text-[#66736B] mt-0.5">
              {t("admin.simulatorSubheading")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={simParams.targetCentreId}
              onChange={(e) => setSimParams((prev) => ({ ...prev, targetCentreId: e.target.value }))}
              className="text-xs font-semibold p-2 rounded-xl border border-[#E4E9E5] bg-white text-[#17211B] focus:outline-none focus:ring-2 focus:ring-[#2F7D4A]/30"
            >
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {formatLocation(c.name.split(" - ")[0])}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
          
          {/* Slider 1: Additional Farmers */}
          <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#17211B]">{isHindi ? "अतिरिक्त आवक" : "Surge Inflow"}</span>
              <span className="font-sans tabular-nums font-bold text-[#D95555] bg-[#FDF2F2] px-2 py-0.5 rounded border border-[#D95555]/30">
                +{simParams.additionalFarmers} {t("common.farmers")}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="10"
              value={simParams.additionalFarmers}
              onChange={(e) => setSimParams((prev) => ({ ...prev, additionalFarmers: Number(e.target.value) }))}
              className="w-full accent-[#D95555] cursor-pointer"
            />
            <span className="text-[10px] text-[#66736B] block mt-1">{isHindi ? "सीमा: 0 से 300 अतिरिक्त आवक" : "Range: 0 to 300 additional arrivals"}</span>
          </div>

          {/* Slider 2: Active Counters */}
          <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#17211B]">{isHindi ? "सक्रिय कांटे" : "Active Counters"}</span>
              <span className="font-sans tabular-nums font-bold text-[#123D2D] bg-[#EEF5EF] px-2 py-0.5 rounded border border-[#58A66B]/30">
                {simParams.activeCounters} {t("admin.countersSuffix")}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={simParams.activeCounters}
              onChange={(e) => setSimParams((prev) => ({ ...prev, activeCounters: Number(e.target.value) }))}
              className="w-full accent-[#2F7D4A] cursor-pointer"
            />
            <span className="text-[10px] text-[#66736B] block mt-1">{isHindi ? "तौल कांटा एवं गेट आवक" : "Weighbridge & intake gates"}</span>
          </div>

          {/* Slider 3: Quality Staff */}
          <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#17211B]">{isHindi ? "QC जाँचकर्ता" : "QC Technicians"}</span>
              <span className="font-sans tabular-nums font-bold text-[#24538F] bg-[#F0F5FA] px-2 py-0.5 rounded border border-[#4178C0]/30">
                {simParams.qualityStaff} {t("admin.inspectorsSuffix")}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={simParams.qualityStaff}
              onChange={(e) => setSimParams((prev) => ({ ...prev, qualityStaff: Number(e.target.value) }))}
              className="w-full accent-[#4178C0] cursor-pointer"
            />
            <span className="text-[10px] text-[#66736B] block mt-1">{isHindi ? "नमी परीक्षण गति" : "Moisture assay testing throughput"}</span>
          </div>

          {/* Slider 4: Extended Operating Hours */}
          <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#17211B]">{isHindi ? "विस्तारित घंटे" : "Extended Hours"}</span>
              <span className="font-sans tabular-nums font-bold text-[#123D2D] bg-[#EEF5EF] px-2 py-0.5 rounded border border-[#58A66B]/30">
                +{simParams.extendedHours} {t("admin.hoursSuffix")}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={simParams.extendedHours}
              onChange={(e) => setSimParams((prev) => ({ ...prev, extendedHours: Number(e.target.value) }))}
              className="w-full accent-[#2F7D4A] cursor-pointer"
            />
            <span className="text-[10px] text-[#66736B] block mt-1">{isHindi ? "शिफ्ट विस्तार 4 घंटे तक" : "Shift extension up to 4 hrs"}</span>
          </div>

        </div>

        {/* Calculated Impact Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          
          <div className="p-4 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] text-center">
            <span className="text-xs text-[#66736B] font-medium">{t("admin.unmitigatedSurgeLabel")}</span>
            <p className="text-2xl font-extrabold text-[#D95555] mt-1 font-sans tabular-nums">
              {simResult.unmitigatedWaitTime} {t("common.min")}
            </p>
            <span className="text-[10px] text-[#D95555] bg-[#FDF2F2] px-2 py-0.5 rounded font-semibold inline-block mt-1">
              {isHindi ? "भार:" : "Load:"} {simResult.unmitigatedUtilization}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#EEF5EF] border-2 border-[#58A66B]/40 text-center">
            <span className="text-xs text-[#123D2D] font-medium flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#2F7D4A]" />
              {t("admin.mitigatedWaitLabel")}
            </span>
            <p className="text-3xl font-extrabold text-[#123D2D] mt-1 font-sans tabular-nums">
              {simResult.simulatedWaitTime} {t("common.min")}
            </p>
            <span className="text-[10px] text-[#123D2D] bg-[#EEF5EF] px-2 py-0.5 rounded font-semibold inline-block mt-1">
              {isHindi ? `भार: ${simResult.simulatedUtilization}% (संतुलित)` : `Load: ${simResult.simulatedUtilization}% (Balanced)`}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] text-center">
            <span className="text-xs text-[#66736B] font-medium">{isHindi ? "प्रति किसान बचाया गया समय" : "Time Saved Per Farmer"}</span>
            <p className="text-2xl font-extrabold text-[#17211B] mt-1 font-sans tabular-nums">
              ~{Math.max(0, simResult.unmitigatedWaitTime - simResult.simulatedWaitTime)} {t("common.min")}
            </p>
            <span className="text-[10px] text-[#2F7D4A] font-semibold inline-block mt-1">
              {simResult.bottleneckStage}
            </span>
          </div>

        </div>

        {/* Dynamic Simulation Chart */}
        <div className="mt-6 pt-4 border-t border-[#E4E9E5]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#123D2D]">
                {isHindi ? "प्रति घंटे कतार वृद्धि बनाम सिमुलेटेड निकासी वक्र" : "Hourly Queue Accumulation vs Simulated Clearance Curve"}
              </h4>
              <p className="text-[11px] text-[#66736B]">
                {isHindi ? "बिना हस्तक्षेप (लाल) बनाम प्रस्तावित क्षमता नीति (हरा) की तुलना।" : "Comparing unmitigated congestion spike (Red) against proposed capacity policy (Green)."}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simResult.hourlyFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="unmitigatedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D95555" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D95555" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="simulatedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F7D4A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2F7D4A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E9E5" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#66736B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#66736B" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "0.75rem",
                    border: "1px solid #E4E9E5",
                    fontSize: "11px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Area
                  type="monotone"
                  dataKey="unmitigatedQueue"
                  name={isHindi ? "अनियंत्रित कतार (कार्रवाई के बिना)" : "Unmitigated Queue (Without Action)"}
                  stroke="#D95555"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#unmitigatedGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="simulatedQueue"
                  name={isHindi ? "सिम्युलेटेड कतार (हस्तक्षेप के साथ)" : "Simulated Queue (With Interventions)"}
                  stroke="#2F7D4A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#simulatedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommended Directives */}
        <div className="mt-6 p-4 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30">
          <span className="text-xs font-bold uppercase tracking-wider text-[#123D2D] flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-[#2F7D4A]" />
            {isHindi ? "लक्षित केंद्र हेतु AI अनुशंसित नीति निर्देश" : "AI Prescribed Directives for Target Centre"}
          </span>
          <div className="space-y-1.5">
            {simResult.policyDirectives.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#17211B] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D4A] mt-1.5 shrink-0" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>

      </Card>

    </div>
  );
};
import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { runWhatIfSimulation } from "../../utils/calculations";
import { Sliders, Sparkles, ArrowRight, Zap, TrendingDown, ShieldCheck } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export const WhatIfSimulatorCard: React.FC = () => {
  const { centres, simParams, setSimParams } = useKrishiQ();

  const targetCentre = centres.find((c) => c.id === simParams.targetCentreId) || centres[0];
  const simResult = runWhatIfSimulation(simParams, targetCentre);

  return (
    <div className="space-y-6">
      
      {/* Simulator Hero Controls */}
      <Card padding="lg" className="border-slate-200 shadow-sm">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">What-If Procurement Simulator</h3>
              <Badge variant="info">Interactive Policy Sandbox</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate arrival surges, counter deployments, and operating window impacts in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={simParams.targetCentreId}
              onChange={(e) => setSimParams((prev) => ({ ...prev, targetCentreId: e.target.value }))}
              className="text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.split(" - ")[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
          
          {/* Slider 1: Additional Farmers */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Surge Inflow</span>
              <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                +{simParams.additionalFarmers} farmers
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="10"
              value={simParams.additionalFarmers}
              onChange={(e) => setSimParams((prev) => ({ ...prev, additionalFarmers: Number(e.target.value) }))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Range: 0 to 300 additional arrivals</span>
          </div>

          {/* Slider 2: Active Counters */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Active Counters</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {simParams.activeCounters} Counters
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={simParams.activeCounters}
              onChange={(e) => setSimParams((prev) => ({ ...prev, activeCounters: Number(e.target.value) }))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Weighbridge & intake gates</span>
          </div>

          {/* Slider 3: Quality Staff */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">QC Technicians</span>
              <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {simParams.qualityStaff} Staff
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={simParams.qualityStaff}
              onChange={(e) => setSimParams((prev) => ({ ...prev, qualityStaff: Number(e.target.value) }))}
              className="w-full accent-sky-700 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Moisture assay testing throughput</span>
          </div>

          {/* Slider 4: Extended Operating Hours */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Extended Hours</span>
              <span className="font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                +{simParams.extendedHours} Hours
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={simParams.extendedHours}
              onChange={(e) => setSimParams((prev) => ({ ...prev, extendedHours: Number(e.target.value) }))}
              className="w-full accent-purple-700 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Shift extension up to 4 hrs</span>
          </div>

        </div>

        {/* Calculated Impact Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-medium">Unmitigated Wait Time</span>
            <p className="text-2xl font-extrabold text-rose-600 mt-1 font-mono">
              {simResult.unmitigatedWaitTime} min
            </p>
            <span className="text-[10px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-semibold inline-block mt-1">
              Load: {simResult.unmitigatedUtilization}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-center">
            <span className="text-xs text-emerald-800 font-medium flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Simulated Mitigated Wait
            </span>
            <p className="text-3xl font-extrabold text-emerald-900 mt-1 font-mono">
              {simResult.simulatedWaitTime} min
            </p>
            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold inline-block mt-1">
              Load: {simResult.simulatedUtilization}% (Balanced)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-medium">Time Saved Per Farmer</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              ~{Math.max(0, simResult.unmitigatedWaitTime - simResult.simulatedWaitTime)} min
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold inline-block mt-1">
              {simResult.bottleneckStage}
            </span>
          </div>

        </div>

        {/* Dynamic Simulation Chart */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Hourly Queue Accumulation vs Simulated Clearance Curve
              </h4>
              <p className="text-[11px] text-slate-500">
                Comparing unmitigated congestion spike (Red) against proposed capacity policy (Green).
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simResult.hourlyFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="unmitigatedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="simulatedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "0.75rem",
                    border: "1px solid #cbd5e1",
                    fontSize: "11px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Area
                  type="monotone"
                  dataKey="unmitigatedQueue"
                  name="Unmitigated Queue (Without Action)"
                  stroke="#e11d48"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#unmitigatedGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="simulatedQueue"
                  name="Simulated Queue (With Interventions)"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#simulatedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommended Directives */}
        <div className="mt-6 p-4 rounded-xl bg-purple-50/80 border border-purple-200">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-purple-700" />
            AI Prescribed Directives for Target Centre
          </span>
          <div className="space-y-1.5">
            {simResult.policyDirectives.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-purple-950 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>

      </Card>

    </div>
  );
};
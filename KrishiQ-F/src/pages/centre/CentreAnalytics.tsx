import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { HOURLY_ANALYTICS_DATA, STAGE_CYCLE_TIMES } from "../../data/mockData";
import { Card } from "../../components/common/Card";
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

export const CentreAnalytics: React.FC = () => {
  const { selectedCentre } = useKrishiQ();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      
      <div className="pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Centre Throughput & Cycle Time Analytics
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Operational performance metrics for {selectedCentre.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <Card padding="md" className="border-slate-300">
          <span className="text-xs font-bold text-slate-800 uppercase block mb-2">
            Hourly Arrivals vs Processed Lots
          </span>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_ANALYTICS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "11px" }} />
                <Bar dataKey="arrivals" name="Arrivals" fill="#d97706" />
                <Bar dataKey="processed" name="Processed" fill="#1b5e20" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md" className="border-slate-300">
          <span className="text-xs font-bold text-slate-800 uppercase block mb-2">
            Average Station Cycle Times (Minutes per Farmer)
          </span>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STAGE_CYCLE_TIMES} layout="vertical" margin={{ top: 5, right: 15, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "11px" }} />
                <Bar dataKey="avgMinutes" name="Actual (min)" fill="#047857" radius={[0, 4, 4, 0]} />
                <Bar dataKey="targetMinutes" name="Target (min)" fill="#94a3b8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};
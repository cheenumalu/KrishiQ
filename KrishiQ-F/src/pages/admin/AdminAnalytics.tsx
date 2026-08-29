import React from "react";
import { DISTRICT_ADMIN_STATS, HOURLY_ANALYTICS_DATA } from "../../data/mockData";
import { formatCurrency, formatQuintals } from "../../utils/calculations";
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

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      <div className="pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          State Agricultural Procurement Analytics
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          District-wide procurement volumes, capacity utilization, and DBT settlement metrics.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card padding="md" className="border-slate-300">
          <span className="text-xs text-slate-500 block">Total Procurement Today</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">48,250 Qtl</p>
        </Card>

        <Card padding="md" className="border-slate-300">
          <span className="text-xs text-slate-500 block">DBT Amount Cleared</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1 font-mono">?8.42 Cr</p>
        </Card>

        <Card padding="md" className="border-slate-300">
          <span className="text-xs text-slate-500 block">Average Wait Time</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">44 min</p>
        </Card>

        <Card padding="md" className="border-slate-300">
          <span className="text-xs text-slate-500 block">Active Mandis</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">24</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card padding="md" className="border-slate-300">
          <span className="text-xs font-bold text-slate-800 uppercase block mb-2">
            Hourly District Procurement Inflow
          </span>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_ANALYTICS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "11px" }} />
                <Area type="monotone" dataKey="processed" stroke="#1b5e20" fill="#d1fae5" name="Procured Qtl" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md" className="border-slate-300">
          <span className="text-xs font-bold text-slate-800 uppercase block mb-2">
            Average Mandi Queue Length by Hour
          </span>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_ANALYTICS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "11px" }} />
                <Bar dataKey="queueLength" name="Queue Length" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
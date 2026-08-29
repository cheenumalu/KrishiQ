import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { DISTRICT_ADMIN_STATS } from "../../data/mockData";
import { formatCurrency, formatQuintals } from "../../utils/calculations";
import {
  Building2,
  Users,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Send,
  Sliders,
  CheckCircle2
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

export const AdminDashboard: React.FC = () => {
  const { addToast } = useKrishiQ();
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const centresAttention = [
    { name: "Centre 17 (Dhar Road)", district: "Indore", queue: 86, capacity: "136%", wait: "165 min", status: "CRITICAL", action: "Redirect 45 farmers to Centre 21" },
    { name: "Centre 8 (Depalpur)", district: "Indore", queue: 44, capacity: "108%", wait: "68 min", status: "WARNING", action: "Extend hours by 1 hour" },
    { name: "Centre 21 (Shivaji Nagar)", district: "Indore", queue: 31, capacity: "58%", wait: "42 min", status: "NORMAL", action: "Designated receiver" },
    { name: "Centre 9 (Sanwer Hub)", district: "Indore", queue: 19, capacity: "52%", wait: "28 min", status: "NORMAL", action: "Operating normally" },
  ];

  const waitTimeByCentreData = [
    { name: "Centre 17", wait: 165 },
    { name: "Centre 8", wait: 68 },
    { name: "Centre 21", wait: 42 },
    { name: "Centre 9", wait: 28 },
    { name: "Centre 11", wait: 35 },
  ];

  const hourlyVolumeData = [
    { hour: "08:00", volume: 180 },
    { hour: "09:00", volume: 340 },
    { hour: "10:00", volume: 480 },
    { hour: "11:00", volume: 520 },
    { hour: "12:00", volume: 490 },
    { hour: "13:00", volume: 410 },
    { hour: "14:00", volume: 360 },
  ];

  const handleToggleAction = (actionKey: string, label: string) => {
    setCompletedActions((prev) => {
      const updated = { ...prev, [actionKey]: !prev[actionKey] };
      if (updated[actionKey]) {
        addToast("Directive Dispatched", `Action executed: "${label}"`, "success");
      }
      return updated;
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Procurement Network Overview
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            "Real-time operational intelligence across all procurement centres."
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/simulator">
            <Button variant="secondary" size="md">
              What-if Simulator
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top Metrics (KPI Bar) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-white border border-slate-300">
          <span className="text-xs text-slate-500 block font-medium">Active Centres</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">42</p>
          <span className="text-[11px] text-slate-400">100% connected</span>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-300">
          <span className="text-xs text-slate-500 block font-medium">Farmers Currently Waiting</span>
          <p className="text-2xl font-extrabold text-amber-800 mt-1 font-mono">1,284</p>
          <span className="text-[11px] text-slate-400">Across all centres</span>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-300">
          <span className="text-xs text-slate-500 block font-medium">Completed Today</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1 font-mono">3,920</p>
          <span className="text-[11px] text-slate-400">Farmers cleared</span>
        </div>

        <div className="p-4 rounded-lg bg-white border border-slate-300">
          <span className="text-xs text-slate-500 block font-medium">Average Waiting Time</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">31 min</p>
          <span className="text-[11px] text-slate-400">Target &lt; 45 min</span>
        </div>
      </div>

      {/* 3. CENTRES REQUIRING ATTENTION TABLE */}
      <Card padding="none" className="border-slate-300 overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
            CENTRES REQUIRING ATTENTION
          </span>
          <span className="text-xs text-slate-500">Live Status Monitor</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-4">Centre</th>
                <th className="py-2.5 px-4">District</th>
                <th className="py-2.5 px-4">Queue</th>
                <th className="py-2.5 px-4">Capacity</th>
                <th className="py-2.5 px-4">Predicted Wait</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {centresAttention.map((c) => (
                <tr key={c.name} className={c.status === "CRITICAL" ? "bg-red-50/30" : ""}>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{c.name}</td>
                  <td className="py-2.5 px-4 text-slate-600">{c.district}</td>
                  <td className="py-2.5 px-4 font-mono font-semibold">{c.queue}</td>
                  <td className="py-2.5 px-4 font-mono">{c.capacity}</td>
                  <td className="py-2.5 px-4 font-mono">{c.wait}</td>
                  <td className="py-2.5 px-4">
                    <Badge
                      variant={c.status === "CRITICAL" ? "critical" : c.status === "WARNING" ? "warning" : "normal"}
                    >
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">{c.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. PREDICTED CONGESTION ALERT & SYSTEM RECOMMENDATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Predicted Congestion Card */}
        <Card padding="lg" className="border-red-300 bg-red-50/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-red-200">
            <span className="text-xs uppercase font-extrabold tracking-wider text-red-950">
              PREDICTED CONGESTION ALERT
            </span>
            <Badge variant="critical">CRITICAL</Badge>
          </div>

          <div className="space-y-1.5 text-xs text-slate-800">
            <h3 className="text-base font-bold text-slate-900">Centre 17</h3>
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded bg-white border border-red-200 font-mono text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">Current Queue</span>
                <strong>86</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Expected Arrivals</span>
                <strong className="text-red-700">+140</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Predicted Util.</span>
                <strong className="text-red-700 font-bold">136%</strong>
              </div>
            </div>

            <div className="pt-2">
              <strong className="block text-slate-900 mb-1">Recommended Action:</strong>
              <p className="text-slate-700 leading-relaxed">� Redirect 45 farmers to Centre 21</p>
              <p className="text-slate-700 leading-relaxed">� Add 1 temporary counter</p>
            </div>
          </div>
        </Card>

        {/* SYSTEM RECOMMENDATIONS Panel */}
        <Card padding="lg" className="border-slate-300 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
              SYSTEM RECOMMENDATIONS
            </span>
            <span className="text-xs text-slate-500">Actionable Directives</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 block">? Redirect 45 farmers from Centre 17 ? Centre 21</strong>
                <span className="text-[11px] text-slate-500">Reduces wait time by 105 min</span>
              </div>
              <Button
                variant={completedActions.act1 ? "secondary" : "primary"}
                size="sm"
                onClick={() => handleToggleAction("act1", "Redirect 45 farmers")}
              >
                {completedActions.act1 ? "Applied ?" : "Apply"}
              </Button>
            </div>

            <div className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 block">? Add temporary counter at Centre 17</strong>
                <span className="text-[11px] text-slate-500">Increases throughput by +35 Qtl/hr</span>
              </div>
              <Button
                variant={completedActions.act2 ? "secondary" : "primary"}
                size="sm"
                onClick={() => handleToggleAction("act2", "Add temporary counter")}
              >
                {completedActions.act2 ? "Applied ?" : "Apply"}
              </Button>
            </div>

            <div className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 block">? Extend Centre 8 operating hours by 1 hour</strong>
                <span className="text-[11px] text-slate-500">Absorbs remaining 44 arrivals</span>
              </div>
              <Button
                variant={completedActions.act3 ? "secondary" : "primary"}
                size="sm"
                onClick={() => handleToggleAction("act3", "Extend Centre 8 hours")}
              >
                {completedActions.act3 ? "Applied ?" : "Apply"}
              </Button>
            </div>
          </div>
        </Card>

      </div>

      {/* 5. Simplified Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <Card padding="md" className="border-slate-300">
          <span className="text-xs font-bold text-slate-800 uppercase block mb-2">
            Average Waiting Time by Centre (Minutes)
          </span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waitTimeByCentreData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "11px" }} />
                <Bar dataKey="wait" fill="#1b5e20" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md" className="border-slate-300">
          <span className="text-xs font-bold text-slate-800 uppercase block mb-2">
            Procurement Volume Over Time (Quintals / Hour)
          </span>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyVolumeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "11px" }} />
                <Area type="monotone" dataKey="volume" stroke="#047857" fill="#d1fae5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};
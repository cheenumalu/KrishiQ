import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import {
  Building2,
  Users,
  Clock,
  AlertTriangle,
  Sliders,
  Sparkles,
  MapPin,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  Filter
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
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export const AdminDashboard: React.FC = () => {
  const { addToast } = useKrishiQ();
  const navigate = useNavigate();
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const waitTimeByCentreData = [
    { name: "Dhar Road", wait: 165 },
    { name: "Depalpur", wait: 68 },
    { name: "Shivaji Nagar", wait: 42 },
    { name: "Sanwer Hub", wait: 28 },
    { name: "Mhow APMC", wait: 35 },
  ];

  const hourlyVolumeData = [
    { hour: "08:00 AM", volume: 180 },
    { hour: "09:00 AM", volume: 340 },
    { hour: "10:00 AM", volume: 480 },
    { hour: "11:00 AM", volume: 520 },
    { hour: "12:00 PM", volume: 490 },
    { hour: "01:00 PM", volume: 410 },
    { hour: "02:00 PM", volume: 360 },
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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      
      {/* 1. SIMPLE CLEAN PAGE HEADER (NO GIANT GREEN HERO BANNER) */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-1 border-b border-[#E4E9E5]">
        <div>
          <h1 className="text-[30px] sm:text-[32px] font-bold text-[#17211B] tracking-[-0.025em] leading-[1.1]">
            Procurement Network Overview
          </h1>
          <p className="text-[13px] text-[#66736B] leading-[1.4] mt-0.5">
            Indore Division · 42 centres online
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/simulator">
            <Button variant="secondary" size="md" leftIcon={<Sliders className="w-4 h-4" />}>
              What-If Simulator
            </Button>
          </Link>
          <Link to="/admin/centres">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Centres
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. UNIFIED METRIC STRIP (ONE CLEAN SURFACE WITH SUBTLE DIVIDERS) */}
      <Card padding="none" className="bg-white rounded-[14px] border border-[#E4E9E5] card-shadow h-[88px] flex items-center divide-x divide-[#E4E9E5] overflow-x-auto">
        
        {/* Metric 1 */}
        <div className="flex-1 min-w-[140px] px-5 py-3">
          <div className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            42
          </div>
          <div className="text-[12px] font-medium text-[#66736B] mt-1.5">
            Active Centres
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex-1 min-w-[140px] px-5 py-3">
          <div className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            31 min
          </div>
          <div className="text-[12px] font-medium text-[#66736B] mt-1.5">
            Average Wait
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex-1 min-w-[140px] px-5 py-3">
          <div className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            64%
          </div>
          <div className="text-[12px] font-medium text-[#66736B] mt-1.5">
            Capacity
          </div>
        </div>

        {/* Metric 4 */}
        <div className="flex-1 min-w-[140px] px-5 py-3">
          <div className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            3,920
          </div>
          <div className="text-[12px] font-medium text-[#66736B] mt-1.5">
            Farmers Today
          </div>
        </div>

        {/* Metric 5 */}
        <div className="flex-1 min-w-[140px] px-5 py-3">
          <div className="text-[28px] font-bold tracking-[-0.02em] leading-none text-[#D95555] tabular-nums font-sans">
            1
          </div>
          <div className="text-[12px] font-semibold text-[#D95555] mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D95555]" />
            Critical Centre
          </div>
        </div>

      </Card>

      {/* 3. NETWORK MAP AS THE MAIN VISUAL (71% Map + 29% Needs Attention) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#17211B] tracking-[-0.01em]">
            Network Status
          </h2>
          <span className="text-[12px] text-[#66736B]">Real-time regional telemetry</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* 71% Map Card (lg:col-span-8) */}
          <Card padding="none" className="lg:col-span-8 flex flex-col h-[400px] overflow-hidden">
            
            {/* Clean Light Surface Map Header (No dark slab) */}
            <div className="px-5 h-[50px] bg-white border-b border-[#E4E9E5] flex items-center justify-between text-xs font-medium shrink-0">
              <span className="text-[14px] font-semibold text-[#17211B]">Network Map</span>
              <div className="flex items-center gap-2 text-[#66736B]">
                <button className="px-2.5 py-1 rounded-lg bg-[#EEF5EF] text-[#123D2D] font-semibold hover:bg-[#E4E9E5] transition-colors">
                  District Grid
                </button>
                <button className="px-2.5 py-1 rounded-lg hover:bg-[#F6F8F4] transition-colors">
                  Heat View
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
                <span className="mb-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#D95555] text-white uppercase">CRITICAL</span>
                <div className="w-7 h-7 rounded-lg bg-[#D95555] text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">A</div>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px]">Dhar Road (2h 45m)</span>
              </div>

              <div className="absolute left-[55%] top-[40%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
                <span className="mb-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#2F7D4A] text-white uppercase">NORMAL</span>
                <div className="w-7 h-7 rounded-lg bg-[#2F7D4A] text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">B</div>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px]">Shivaji Nagar (42m)</span>
              </div>

              <div className="absolute left-[75%] top-[30%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
                <span className="mb-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#2F7D4A] text-white uppercase">NORMAL</span>
                <div className="w-7 h-7 rounded-lg bg-[#2F7D4A] text-white flex items-center justify-center font-bold text-xs border border-white shadow-md">C</div>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px]">Sanwer Hub (28m)</span>
              </div>

              <div className="absolute left-[40%] top-[25%] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
                <span className="mb-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#F2A93B] text-slate-950 uppercase">WARNING</span>
                <div className="w-7 h-7 rounded-lg bg-[#F2A93B] text-slate-950 flex items-center justify-center font-bold text-xs border border-white shadow-md">D</div>
                <span className="mt-0.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px]">Depalpur (1h 08m)</span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/75 backdrop-blur-md p-2 rounded-xl text-[11px] text-white flex items-center justify-between">
                <span>District Grid: <strong>1 Critical, 1 Warning, 40 Normal</strong></span>
                <span className="text-[#58A66B] font-mono">Live Telemetry</span>
              </div>
            </div>
          </Card>

          {/* 29% Needs Attention Panel (Clean, uncluttered alert rows) */}
          <Card padding="md" className="lg:col-span-4 flex flex-col justify-between h-[400px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E4E9E5]">
                <span className="text-[14px] font-semibold text-[#17211B]">
                  Needs Attention
                </span>
                <span className="text-[12px] font-semibold text-[#66736B]">2 alerts</span>
              </div>

              <div className="space-y-3">
                
                {/* Alert Row 1 */}
                <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] hover:border-[#D95555]/40 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D95555] shrink-0" />
                      <h4 className="font-semibold text-[#17211B] text-[14px]">Dhar Road Centre</h4>
                    </div>
                  </div>
                  
                  <div className="text-[12px] text-[#66736B] font-sans tabular-nums pl-4">
                    2h 45m wait · 136% capacity
                  </div>

                  <div className="pt-1 text-right">
                    <button
                      onClick={() => handleToggleAction("dhar", "Redirect Dhar Road arrivals")}
                      className="text-[12px] font-semibold text-[#D95555] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {completedActions.dhar ? "Directive Sent ✓" : "Investigate →"}
                    </button>
                  </div>
                </div>

                {/* Alert Row 2 */}
                <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] hover:border-[#F2A93B]/40 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F2A93B] shrink-0" />
                      <h4 className="font-semibold text-[#17211B] text-[14px]">Rajendra Mandi</h4>
                    </div>
                  </div>
                  
                  <div className="text-[12px] text-[#66736B] font-sans tabular-nums pl-4">
                    1h 35m wait · 84% capacity
                  </div>

                  <div className="pt-1 text-right">
                    <button
                      onClick={() => handleToggleAction("rajendra", "Inspect Rajendra Mandi")}
                      className="text-[12px] font-semibold text-[#2F7D4A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {completedActions.rajendra ? "Inspected ✓" : "View →"}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-2 border-t border-[#E4E9E5] text-right">
              <Link to="/admin/centres" className="text-[12px] font-semibold text-[#2F7D4A] hover:underline">
                View All Mandis →
              </Link>
            </div>
          </Card>

        </div>
      </div>

      {/* 4. LIGHTWEIGHT KRISHIQ INSIGHT STRIP (BELOW MAP) */}
      <div className="p-4 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 max-w-[1100px]">
          <Sparkles className="w-4 h-4 text-[#2F7D4A] shrink-0" />
          <span className="font-bold text-[#123D2D] shrink-0">✦ KrishiQ Insight:</span>
          <p className="text-[#17211B] text-[13px] leading-relaxed">
            Redirecting arrivals from Dhar Road to Shivaji Nagar may reduce district waiting time by 18 min.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/simulator")}
          className="text-[12px] font-bold text-[#2F7D4A] hover:underline shrink-0 cursor-pointer"
        >
          View recommendation →
        </button>
      </div>

      {/* 5. SECONDARY ANALYTICS (3-COLUMN CALM LAYOUT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Column 1: Congestion Trend */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
            <span className="text-[14px] font-semibold text-[#17211B]">
              Congestion Trend
            </span>
            <span className="text-[11px] text-[#66736B]">Peak 11:00 AM</span>
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
              Capacity Utilisation
            </span>
            <span className="text-[11px] text-[#66736B]">Average 64%</span>
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
              Top Mandi Clearance
            </span>
            <span className="text-[11px] text-[#2F7D4A] font-semibold">Today</span>
          </div>
          <div className="space-y-2.5 text-xs text-[#17211B]">
            <div className="flex justify-between items-center p-2 rounded-lg bg-[#F6F8F4]">
              <span>Shivaji Nagar (Centre B)</span>
              <strong className="font-sans tabular-nums text-[#2F7D4A]">3,240 Qtl</strong>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-[#F6F8F4]">
              <span>Sanwer Hub (Centre C)</span>
              <strong className="font-sans tabular-nums text-[#17211B]">1,890 Qtl</strong>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-[#F6F8F4]">
              <span>Depalpur Mandi (Centre D)</span>
              <strong className="font-sans tabular-nums text-[#17211B]">2,450 Qtl</strong>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-[#F6F8F4]">
              <span>Mhow APMC Yard (Centre E)</span>
              <strong className="font-sans tabular-nums text-[#17211B]">1,620 Qtl</strong>
            </div>
          </div>
        </Card>

      </div>

    </div>
  );
};
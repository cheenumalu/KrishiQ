import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { TokenSlipModal } from "../../components/farmer/TokenSlipModal";
import { RescheduleModal } from "../../components/farmer/RescheduleModal";
import {
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export const FarmerQueue: React.FC = () => {
  const { farmerBooking, addToast } = useKrishiQ();
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  // Local demo simulation state
  const [simulationStep, setSimulationStep] = useState<number>(0);

  const queueMovementData = [
    { time: "10:30", ahead: 12 },
    { time: "10:40", ahead: 9 },
    { time: "10:50", ahead: 6 },
    { time: "11:00", ahead: Math.max(0, 3 - simulationStep) },
  ];

  const simulatedServingToken = simulationStep === 0 ? "A124" : simulationStep === 1 ? "A125" : simulationStep === 2 ? "A126" : "A127";
  const simulatedFarmersAhead = Math.max(0, 3 - simulationStep);
  const simulatedWaitTime = Math.max(0, 24 - simulationStep * 8);

  const handleSimulateUpdate = () => {
    if (simulationStep < 3) {
      const nextStep = simulationStep + 1;
      setSimulationStep(nextStep);
      if (nextStep === 1) {
        addToast("Queue Advanced", "Token A124 completed. Token A125 called. 2 farmers ahead.", "info");
      } else if (nextStep === 2) {
        addToast("Queue Advanced", "Token A125 completed. Token A126 called. Only 1 farmer ahead!", "warning");
      } else if (nextStep === 3) {
        addToast("Your Turn! ?", "Token A127 (Rajesh) called to Weighbridge. Please proceed to Gate 1!", "success");
      }
    } else {
      setSimulationStep(0);
      addToast("Queue Reset", "Simulation returned to baseline queue state.", "info");
    }
  };

  const queueList = [
    { token: "A121", name: "Harish Patel", crop: "Wheat 45 Qtl", status: "completed", symbol: "?", label: "Completed" },
    { token: "A122", name: "Suresh Chouhan", crop: "Wheat 80 Qtl", status: "completed", symbol: "?", label: "Completed" },
    { token: "A123", name: "Vikram Verma", crop: "Soybean 50 Qtl", status: "completed", symbol: "?", label: "Completed" },
    {
      token: "A124",
      name: "Rameshwar Gurjar",
      crop: "Wheat 72 Qtl",
      status: simulationStep > 0 ? "completed" : "serving",
      symbol: simulationStep > 0 ? "?" : "?",
      label: simulationStep > 0 ? "Completed" : "Currently serving",
    },
    {
      token: "A125",
      name: "Balwant Singh",
      crop: "Wheat 60 Qtl",
      status: simulationStep >= 2 ? "completed" : simulationStep === 1 ? "serving" : "waiting",
      symbol: simulationStep >= 2 ? "?" : simulationStep === 1 ? "?" : "?",
      label: simulationStep >= 2 ? "Completed" : simulationStep === 1 ? "Currently serving" : "Waiting",
    },
    {
      token: "A126",
      name: "Devendra Rathore",
      crop: "Maize 40 Qtl",
      status: simulationStep >= 3 ? "completed" : simulationStep === 2 ? "serving" : "waiting",
      symbol: simulationStep >= 3 ? "?" : simulationStep === 2 ? "?" : "?",
      label: simulationStep >= 3 ? "Completed" : simulationStep === 2 ? "Currently serving" : "Waiting",
    },
    {
      token: "A127",
      name: "Rajesh (You)",
      crop: "Sharbati Wheat 65 Qtl",
      status: simulationStep === 3 ? "serving" : "user",
      symbol: "?",
      label: simulationStep === 3 ? "Currently serving (You)" : "You",
      isUser: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      
      {/* Official Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Live Procurement Queue
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
            <span>Centre: <strong className="text-slate-900">Shivaji Nagar Procurement Centre</strong></span>
            <span>�</span>
            <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Operating normally
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateUpdate}
          >
            {simulationStep < 3 ? "Simulate Queue Update (+1)" : "Reset Simulation"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileText className="w-4 h-4" />}
            onClick={() => setIsTokenModalOpen(true)}
          >
            View Gate Slip
          </Button>
        </div>
      </div>

      {/* 4 Large Clean Status Metric Panels */}
      <Card padding="lg" className="border-slate-300 shadow-xs space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
            YOUR QUEUE POSITION
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Last updated 20 seconds ago
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          
          <div className="p-4 rounded-lg bg-emerald-800 text-white shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block">YOUR TOKEN</span>
            <p className="text-3xl font-extrabold font-mono mt-1 text-white">A127</p>
            <span className="text-[11px] text-emerald-200 block mt-0.5">Rajesh (65 Qtl)</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">CURRENTLY SERVING</span>
            <p className="text-2xl font-extrabold text-amber-800 mt-1 font-mono">{simulatedServingToken}</p>
            <span className="text-[11px] text-slate-500 block mt-0.5">Weighbridge 1</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">FARMERS AHEAD</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{simulatedFarmersAhead}</p>
            <span className="text-[11px] text-slate-500 block mt-0.5">in line before you</span>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300">
            <span className="text-xs text-emerald-900 font-semibold block">ESTIMATED WAIT</span>
            <p className="text-2xl font-extrabold text-emerald-950 mt-1 font-mono">
              {simulatedWaitTime} MINUTES
            </p>
            <span className="text-[11px] text-emerald-800 block mt-0.5">Expected: 11:42 AM</span>
          </div>

        </div>

        {/* Helpful Proactive Reminder */}
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">
            "Your turn is approaching. Please be at the procurement centre within 15 minutes."
          </p>
        </div>

      </Card>

      {/* Queue Sequence List */}
      <Card padding="lg" className="border-slate-300 shadow-xs space-y-3">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
            GATE ENTRY ORDER (TOKENS A121 � A127)
          </span>
          <span className="text-xs text-slate-500">Shivaji Nagar Centre</span>
        </div>

        <div className="space-y-2 text-xs">
          {queueList.map((item) => {
            const isUser = item.isUser;
            const isCompleted = item.status === "completed";
            const isServing = item.status === "serving";

            return (
              <div
                key={item.token}
                className={
                  "flex items-center justify-between p-3 rounded-lg border transition-colors " +
                  (isUser
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 font-semibold"
                    : isServing
                    ? "bg-amber-50 border-amber-300 font-medium"
                    : isCompleted
                    ? "bg-slate-50/70 border-slate-200 text-slate-500"
                    : "bg-white border-slate-200")
                }
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 font-bold text-center">
                    {item.symbol}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-slate-900">{item.token}</strong>
                      <span className="text-slate-800">{item.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{item.crop}</span>
                  </div>
                </div>

                <div className="text-right">
                  {isCompleted && (
                    <span className="text-slate-600 font-medium">? Completed</span>
                  )}
                  {isServing && (
                    <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                      ? Currently serving
                    </span>
                  )}
                  {!isCompleted && !isServing && !isUser && (
                    <span className="text-slate-600">? Waiting</span>
                  )}
                  {isUser && !isServing && (
                    <span className="text-emerald-900 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      ? You (35 min)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </Card>

      {/* Queue Movement Mini-Chart */}
      <Card padding="md" className="border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800 uppercase">
            Queue Movement (Last 30 Minutes)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            10:30 ? 12 | 10:40 ? 9 | 10:50 ? 6 | 11:00 ? {simulatedFarmersAhead}
          </span>
        </div>

        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={queueMovementData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{ borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "11px" }}
                formatter={(val: any) => [val + " farmers ahead", "Queue"]}
              />
              <Area type="monotone" dataKey="ahead" stroke="#059669" strokeWidth={2} fill="#d1fae5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Reschedule Option */}
      <Card padding="md" className="border-slate-200 bg-slate-50">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <strong className="text-slate-900 block text-sm">Need to change your arrival time?</strong>
            <p className="text-slate-600 mt-0.5">
              "If you cannot reach the centre on time, you can select another available slot."
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsRescheduleOpen(true)}
          >
            Reschedule Slot
          </Button>
        </div>
      </Card>

      {/* Modals */}
      <TokenSlipModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        booking={farmerBooking}
      />
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
      />

    </div>
  );
};
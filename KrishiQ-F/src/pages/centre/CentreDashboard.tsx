import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { formatQuintals } from "../../utils/calculations";
import {
  Building2,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Activity,
  Layers,
  FileText,
  Search,
  SlidersHorizontal,
  ArrowRight
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const CentreDashboard: React.FC = () => {
  const { selectedCentre, addToast } = useKrishiQ();
  const [isBottleneckResolved, setIsBottleneckResolved] = useState(false);

  // Workstation state
  const [currentServing, setCurrentServing] = useState({
    token: "Token A124",
    tokenRaw: "A124",
    farmer: "Rajesh Kumar",
    crop: "Wheat",
    quantity: 42,
    stage: "Weighing Station 1",
    estimatedCompletion: "6 minutes",
  });

  const [nextFarmer, setNextFarmer] = useState({
    token: "Token A125",
    tokenRaw: "A125",
    farmer: "Suresh Patil",
    crop: "Wheat",
    quantity: 28,
    estimatedProcessing: "8 minutes",
    called: false,
  });

  const [queueTable, setQueueTable] = useState([
    { token: "A124", farmer: "Rajesh Kumar", crop: "Wheat", quantity: 42, arrival: "10:15 AM", currentStage: "Weighing", status: "Processing" },
    { token: "A125", farmer: "Suresh Patil", crop: "Wheat", quantity: 28, arrival: "10:28 AM", currentStage: "Quality Check", status: "Waiting" },
    { token: "A126", farmer: "Vikram Verma", crop: "Soybean", quantity: 55, arrival: "10:35 AM", currentStage: "Registration", status: "Waiting" },
    { token: "A127", farmer: "Rajesh Malviya", crop: "Wheat", quantity: 65, arrival: "10:45 AM", currentStage: "Registration", status: "Waiting" },
    { token: "A123", farmer: "Om Prakash", crop: "Maize", quantity: 36, arrival: "09:50 AM", currentStage: "Procurement", status: "Completed" },
  ]);

  const handleCompleteStage = () => {
    const completedToken = currentServing.tokenRaw;
    setQueueTable((prev) =>
      prev.map((row) => (row.token === completedToken ? { ...row, status: "Completed", currentStage: "Procurement" } : row))
    );

    setCurrentServing({
      token: "Token A125",
      tokenRaw: "A125",
      farmer: "Suresh Patil",
      crop: "Wheat",
      quantity: 28,
      stage: "Weighing Station 1",
      estimatedCompletion: "5 minutes",
    });

    setNextFarmer({
      token: "Token A126",
      tokenRaw: "A126",
      farmer: "Vikram Verma",
      crop: "Soybean",
      quantity: 55,
      estimatedProcessing: "10 minutes",
      called: false,
    });

    addToast("Stage Completed", `Token ${completedToken} completed weighing. Token A125 now active.`, "success");
  };

  const handleCallFarmer = () => {
    setNextFarmer((prev) => ({ ...prev, called: true }));
    setQueueTable((prev) =>
      prev.map((row) => (row.token === nextFarmer.tokenRaw ? { ...row, status: "Called" } : row))
    );
    addToast("Farmer Called", `${nextFarmer.token} (${nextFarmer.farmer}) called to counter.`, "info");
  };

  const handleApplyBottleneck = () => {
    setIsBottleneckResolved(true);
    addToast("Staff Rebalanced", "Operator shifted to Weighing. Queue backlog resolved.", "success");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. OPERATOR HERO BANNER (Compact, 35% smaller) */}
      <div className="bg-[#123D2D] p-5 sm:p-6 rounded-[18px] text-white shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#58A66B] animate-pulse" />
            <span className="text-[11px] text-[#58A66B] font-bold uppercase tracking-wider">Operational Console • Open</span>
            <span className="text-[11px] text-white/60">• Shift 1 (08:00 AM - 06:00 PM)</span>
          </div>

          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.025em] text-white leading-[1.12]">
            {selectedCentre.name}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-sans">
            Code: <strong className="text-white font-semibold">{selectedCentre.code}</strong> • District: {selectedCentre.district} • Active Counters: {selectedCentre.activeCounters}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 text-xs text-white space-y-1 shrink-0">
          <div className="text-white/70 text-[11px]">Mandi Capacity Load</div>
          <div className="text-sm font-bold font-sans tabular-nums">1,360 / 2,000 Units (68%)</div>
          <div className="w-40 h-1.5 bg-white/20 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-[#58A66B] rounded-full" style={{ width: "68%" }} />
          </div>
        </div>
      </div>

      {/* 2. OPERATIONAL KPI STRIP (120-130px height, tabular-nums sans-serif values) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#66736B]">
            <Building2 className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-medium leading-[1.3]">Today's Bookings</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            148
          </div>
          <span className="text-[12px] text-[#2F7D4A] font-semibold">92% Checked In</span>
        </Card>

        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#66736B]">
            <Users className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-medium leading-[1.3]">Current Queue</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#9A6210] tabular-nums font-sans">
            {isBottleneckResolved ? 11 : selectedCentre.currentQueueCount}
          </div>
          <span className="text-[12px] text-[#66736B]">Farmers waiting</span>
        </Card>

        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#66736B]">
            <Clock className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-medium leading-[1.3]">Average Wait</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            {isBottleneckResolved ? "22 min" : "42 min"}
          </div>
          <span className="text-[12px] text-[#2F7D4A] font-semibold">-14m vs yesterday</span>
        </Card>

        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between bg-[#EEF5EF] border-[#58A66B]/30">
          <div className="flex items-center gap-2 text-[#123D2D]">
            <Activity className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-semibold leading-[1.3]">Today's Procurement</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#123D2D] tabular-nums font-sans">
            3,240 Qtl
          </div>
          <span className="text-[12px] text-[#2F7D4A] font-medium">61 Receipts Cleared</span>
        </Card>
      </div>

      {/* 3. BOTTLENECK ALERT ADVISORY STRIP */}
      {!isBottleneckResolved ? (
        <Card padding="sm" className="p-[16px_20px] bg-[#FEF5E7] border border-[#F2A93B]/40 text-xs text-[#9A6210] flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-[#F2A93B]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#F2A93B] shrink-0" />
            <div>
              <div className="font-bold text-[14px] text-[#17211B]">Bottleneck Advisory: Weighbridge Station #2</div>
              <p className="text-[#66736B] text-[13px] mt-0.5">18 farmers queued due to heavy lot sizes. Recommended: Shift 1 operator from documentation desk.</p>
            </div>
          </div>
          <Button variant="accent" size="sm" onClick={handleApplyBottleneck}>
            Shift Operator (Resolve)
          </Button>
        </Card>
      ) : (
        <div className="p-3 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30 text-xs text-[#123D2D] font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2F7D4A]" />
            Bottleneck Resolved: Operator shifted to Weighbridge 2. Intake rate restored to normal.
          </span>
          <span className="font-bold text-[#2F7D4A]">Optimal Flow ✓</span>
        </div>
      )}

      {/* 4. WORKSTATION CARDS & QUEUE TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT 7 COLS: WORKSTATION CARDS */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Active Serving Card */}
            <Card padding="md" className="space-y-3 border-[#2F7D4A] ring-1 ring-[#2F7D4A]/20">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                  CURRENTLY SERVING
                </span>
                <Badge variant="warning" size="sm">Active</Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <h3 className="text-2xl font-bold text-[#17211B] font-sans tabular-nums">
                  {currentServing.token}
                </h3>
                <p className="text-sm font-bold text-[#17211B]">
                  Farmer: {currentServing.farmer}
                </p>
                <p className="text-[#66736B]">
                  Lot: <strong className="text-[#17211B]">{currentServing.crop}</strong> • Quantity: <strong className="text-[#17211B] font-sans tabular-nums">{currentServing.quantity} Qtl</strong>
                </p>
                <p className="text-[#66736B]">
                  Station: <strong className="text-[#123D2D] font-semibold">{currentServing.stage}</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-[#E4E9E5]">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={handleCompleteStage}
                >
                  Complete Stage
                </Button>
              </div>
            </Card>

            {/* Next Farmer Card */}
            <Card padding="md" className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                  NEXT FARMER IN LINE
                </span>
                <Badge variant="neutral" size="sm">Position 1</Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <h3 className="text-2xl font-bold text-[#17211B] font-sans tabular-nums">
                  {nextFarmer.token}
                </h3>
                <p className="text-sm font-bold text-[#17211B]">
                  Farmer: {nextFarmer.farmer}
                </p>
                <p className="text-[#66736B]">
                  Lot: <strong className="text-[#17211B]">{nextFarmer.crop}</strong> • Quantity: <strong className="text-[#17211B] font-sans tabular-nums">{nextFarmer.quantity} Qtl</strong>
                </p>
                <p className="text-[#8A958E]">
                  Est. Inspection: {nextFarmer.estimatedProcessing}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E4E4E5]">
                <Button
                  variant={nextFarmer.called ? "secondary" : "primary"}
                  size="md"
                  className="w-full"
                  leftIcon={<PhoneCall className="w-4 h-4" />}
                  onClick={handleCallFarmer}
                >
                  {nextFarmer.called ? "Call Again" : "Call Next Farmer"}
                </Button>
              </div>
            </Card>

          </div>

          {/* Queue Timeline Visual */}
          <Card padding="md" className="space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                QUEUE TIMELINE & STATUS BADGES
              </span>
              <span className="text-xs text-[#66736B]">Live Sequence</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs pt-0.5">
              <div className="p-2.5 rounded-xl bg-[#FEF5E7] border border-[#F2A93B]/40 text-[#9A6210] font-sans tabular-nums font-bold flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#66736B]">SERVING</span>
                <span>KQ-018</span>
              </div>

              <span className="text-[#8A958E]">→</span>

              <div className="p-2.5 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30 text-[#123D2D] font-sans tabular-nums font-bold flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#66736B]">NEXT</span>
                <span>KQ-019</span>
                <span>KQ-020</span>
                <span>KQ-021</span>
              </div>

              <div className="ml-auto px-3 py-1 rounded-full bg-[#EEF5EF] text-[#2F7D4A] text-xs font-semibold">
                Est. Delay: +0 min (On Schedule)
              </div>
            </div>
          </Card>

        </div>

        {/* RIGHT 5 COLS: OPERATIONAL TABLE */}
        <div className="lg:col-span-5 space-y-4">
          <Card padding="none" className="overflow-hidden">
            <div className="p-3.5 bg-[#F6F8F4] border-b border-[#E4E9E5] flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                TODAY'S INTAKE LOG
              </span>
              <span className="text-xs text-[#66736B]">{queueTable.length} Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E4E9E5] bg-[#F6F8F4] text-[11px] font-bold text-[#66736B] uppercase">
                    <th className="py-2.5 px-3">Token</th>
                    <th className="py-2.5 px-3">Farmer</th>
                    <th className="py-2.5 px-3">Stage</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E9E5]">
                  {queueTable.map((row) => {
                    const isCurrent = row.token === currentServing.tokenRaw;

                    return (
                      <tr key={row.token} className={isCurrent ? "bg-[#EEF5EF]/60 font-semibold" : "hover:bg-[#F6F8F4]"}>
                        <td className="py-2.5 px-3 font-sans tabular-nums font-bold text-[#17211B]">{row.token}</td>
                        <td className="py-2.5 px-3 text-[#17211B]">{row.farmer}</td>
                        <td className="py-2.5 px-3 text-[#66736B]">{row.currentStage}</td>
                        <td className="py-2.5 px-3">
                          <Badge
                            size="sm"
                            variant={
                              row.status === "Processing"
                                ? "warning"
                                : row.status === "Completed"
                                ? "success"
                                : row.status === "Called"
                                ? "info"
                                : "neutral"
                            }
                          >
                            {row.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {row.status === "Waiting" && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setQueueTable((prev) =>
                                  prev.map((r) => (r.token === row.token ? { ...r, status: "Called" } : r))
                                );
                                addToast("Called", `${row.token} called to counter.`, "info");
                              }}
                            >
                              Call
                            </Button>
                          )}
                          {row.status === "Called" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setQueueTable((prev) =>
                                  prev.map((r) => (r.token === row.token ? { ...r, status: "Processing" } : r))
                                );
                              }}
                            >
                              Start
                            </Button>
                          )}
                          {row.status === "Processing" && (
                            <Button variant="primary" size="sm" onClick={handleCompleteStage}>
                              Complete
                            </Button>
                          )}
                          {row.status === "Completed" && (
                            <span className="text-[11px] text-[#2F7D4A] font-bold">Done ✓</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
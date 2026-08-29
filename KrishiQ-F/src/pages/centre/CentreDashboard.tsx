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
  FileText
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";

export const CentreDashboard: React.FC = () => {
  const { selectedCentre, addToast } = useKrishiQ();

  const [isBottleneckResolved, setIsBottleneckResolved] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Active serving & next farmer state
  const [currentServing, setCurrentServing] = useState({
    token: "Token A124",
    tokenRaw: "A124",
    farmer: "Rajesh Kumar",
    crop: "Wheat",
    quantity: 42,
    stage: "Weighing",
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
      stage: "Weighing",
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
    addToast("Farmer Called", `${nextFarmer.token} (${nextFarmer.farmer}) called to station.`, "info");
  };

  const handleApplyBottleneck = () => {
    setIsBottleneckResolved(true);
    addToast("Staff Rebalanced", "Operator shifted to Weighing. Queue backlog resolved.", "success");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      
      {/* Official Header */}
      <div className="space-y-0.5 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Procurement Centre Operations
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          {selectedCentre.name} � Centre Code: <strong className="font-mono text-slate-800">{selectedCentre.code}</strong> � Sector 4 Mandi Yard
        </p>
      </div>

      {/* 1. Today's Summary KPI Bar */}
      <div className="space-y-2">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800 block">
          Today's Summary
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-lg bg-white border border-slate-300">
            <span className="text-xs text-slate-500 block">Farmers waiting</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              {isBottleneckResolved ? 11 : 22}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-300">
            <span className="text-xs text-slate-500 block">Currently processing</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              1
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-300">
            <span className="text-xs text-slate-500 block">Completed today</span>
            <p className="text-2xl font-extrabold text-emerald-800 mt-1 font-mono">
              61
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-300">
            <span className="text-xs text-slate-500 block">Average waiting time</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
              31 min
            </p>
          </div>
        </div>
      </div>

      {/* 2. WARNING � BOTTLENECK DETECTED */}
      {!isBottleneckResolved ? (
        <Card padding="md" className="border-amber-300 bg-amber-50/50 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-800 text-white uppercase">
                WARNING � BOTTLENECK DETECTED
              </span>
              <span className="text-xs font-bold text-amber-950 uppercase">
                Location: Weighing Station
              </span>
            </div>
            <span className="text-xs text-amber-800 font-semibold font-mono">
              18 farmers waiting
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <div>
              <span>Average processing time: <strong>11 minutes</strong></span>
            </div>
            <div>
              <span>Recommended action: <strong>Shift one available operator to weighing.</strong></span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-amber-200">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleApplyBottleneck}
            >
              Shift Operator (Apply)
            </Button>
          </div>
        </Card>
      ) : (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-medium flex items-center justify-between">
          <span>Bottleneck resolved: Operator shifted to Weighing. Queue backlog cleared.</span>
          <span className="font-bold text-emerald-800">Normal Throughput ?</span>
        </div>
      )}

      {/* 3. CURRENTLY SERVING & NEXT FARMER WORKSTATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* CURRENTLY SERVING */}
        <Card padding="lg" className="border-slate-300 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
              CURRENTLY SERVING
            </span>
            <Badge variant="warning">In Service</Badge>
          </div>

          <div className="space-y-1 text-xs">
            <h3 className="text-2xl font-extrabold text-slate-900 font-mono">
              {currentServing.token}
            </h3>
            <p className="text-sm font-bold text-slate-800">
              Farmer: {currentServing.farmer}
            </p>
            <p className="text-slate-600">
              Crop: <strong>{currentServing.crop}</strong> � Quantity: <strong className="font-mono">{currentServing.quantity} quintals</strong>
            </p>
            <p className="text-slate-600">
              Stage: <strong className="uppercase">{currentServing.stage}</strong>
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <Button
              variant="primary"
              size="md"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={handleCompleteStage}
            >
              Complete Stage
            </Button>
          </div>
        </Card>

        {/* NEXT FARMER */}
        <Card padding="lg" className="border-slate-300 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
              NEXT FARMER
            </span>
            <Badge variant="neutral">Position 1</Badge>
          </div>

          <div className="space-y-1 text-xs">
            <h3 className="text-2xl font-extrabold text-slate-900 font-mono">
              {nextFarmer.token}
            </h3>
            <p className="text-sm font-bold text-slate-800">
              Farmer: {nextFarmer.farmer}
            </p>
            <p className="text-slate-600">
              Crop: <strong>{nextFarmer.crop}</strong> � Quantity: <strong className="font-mono">{nextFarmer.quantity} quintals</strong>
            </p>
            <p className="text-slate-500">
              Est. Processing: {nextFarmer.estimatedProcessing}
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <Button
              variant={nextFarmer.called ? "secondary" : "primary"}
              size="md"
              leftIcon={<PhoneCall className="w-4 h-4" />}
              onClick={handleCallFarmer}
            >
              {nextFarmer.called ? "Call Again" : "Call Farmer"}
            </Button>
          </div>
        </Card>

      </div>

      {/* 4. Visual 4-Stage Operational Pipeline */}
      <Card padding="md" className="border-slate-300 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
            Centre Flow Pipeline
          </span>
          <span className="text-xs text-slate-500">Farmers at each station</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[11px]">1. Registration</span>
            <strong className="text-xl font-mono text-slate-900 block mt-1">6</strong>
            <span className="text-[10px] text-slate-400">farmers</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[11px]">2. Quality Check</span>
            <strong className="text-xl font-mono text-slate-900 block mt-1">4</strong>
            <span className="text-[10px] text-slate-400">farmers</span>
          </div>

          <div className={"p-3 rounded-lg border " + (!isBottleneckResolved ? "bg-amber-50 border-amber-300" : "bg-slate-50 border-slate-200")}>
            <span className="text-slate-700 block text-[11px] font-semibold">3. Weighing</span>
            <strong className={"text-xl font-mono block mt-1 " + (!isBottleneckResolved ? "text-amber-900" : "text-slate-900")}>
              {isBottleneckResolved ? 8 : 18}
            </strong>
            <span className={"text-[10px] " + (!isBottleneckResolved ? "text-amber-800 font-bold" : "text-slate-400")}>
              {!isBottleneckResolved ? "High queue" : "farmers"}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[11px]">4. Procurement</span>
            <strong className="text-xl font-mono text-slate-900 block mt-1">3</strong>
            <span className="text-[10px] text-slate-400">farmers</span>
          </div>
        </div>
      </Card>

      {/* 5. Live Queue Table */}
      <Card padding="none" className="border-slate-300 overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
            Live Queue Table
          </span>
          <span className="text-xs text-slate-500 font-mono">{queueTable.length} farmers in list</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-4">Token</th>
                <th className="py-2.5 px-4">Farmer</th>
                <th className="py-2.5 px-4">Crop</th>
                <th className="py-2.5 px-4">Quantity</th>
                <th className="py-2.5 px-4">Arrival</th>
                <th className="py-2.5 px-4">Current Stage</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queueTable.map((row) => {
                const isCurrent = row.token === currentServing.tokenRaw;

                return (
                  <tr key={row.token} className={isCurrent ? "bg-amber-50/60 font-semibold" : ""}>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{row.token}</td>
                    <td className="py-2.5 px-4 text-slate-900">{row.farmer}</td>
                    <td className="py-2.5 px-4 text-slate-700">{row.crop}</td>
                    <td className="py-2.5 px-4 font-mono">{row.quantity} Qtl</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{row.arrival}</td>
                    <td className="py-2.5 px-4">{row.currentStage}</td>
                    <td className="py-2.5 px-4">
                      <Badge
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
                    <td className="py-2.5 px-4 text-right">
                      {row.status === "Waiting" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setQueueTable((prev) =>
                              prev.map((r) => (r.token === row.token ? { ...r, status: "Called" } : r))
                            );
                            addToast("Called", `${row.token} called to gate.`, "info");
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
                        <span className="text-[11px] text-emerald-800 font-bold">? Done</span>
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
  );
};
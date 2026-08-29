import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { AlertOctagon, ArrowRight, CheckCircle2, Send, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { Modal } from "../common/Modal";

export const CongestionAdvisoryCard: React.FC = () => {
  const { centres, resolveBottleneck, addToast } = useKrishiQ();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directiveIssued, setDirectiveIssued] = useState(false);

  const criticalCentre = centres.find((c) => c.status === "critical") || centres[1];

  const handleIssueDirective = () => {
    resolveBottleneck(criticalCentre.id);
    setDirectiveIssued(true);
    setIsModalOpen(false);
    addToast("State Directive Dispatched", "Automated SMS reroute alerts sent to 45 farmers. Auxiliary counter opened at Centre #17.", "success");
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 text-white p-6 shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[11px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-xs">
              <AlertOctagon className="w-3.5 h-3.5" />
              PREDICTED BOTTLENECK ALERT
            </span>
            <span className="text-xs text-rose-300 font-medium">AI Early Congestion Warning</span>
          </div>

          <Badge variant="critical">Status: CRITICAL (136% Load)</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-7">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {criticalCentre.name}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Location: Dhar Road Corridor � Capacity: {criticalCentre.totalCapacityPerDay} Farmers/Day
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 my-4">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 block">Current Queue</span>
                <span className="text-lg font-bold text-white font-mono">{criticalCentre.currentQueueCount}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 block">Expected Arrivals</span>
                <span className="text-lg font-bold text-rose-400 font-mono">+140</span>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-center">
                <span className="text-[10px] text-rose-200 block">Predicted Load</span>
                <span className="text-lg font-extrabold text-rose-300 font-mono">{criticalCentre.utilizationPercent}%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-xs text-rose-100">
              <span className="font-bold text-rose-300 block mb-1">Recommended AI Directives:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-200">
                <li>Reroute <strong>45 incoming farmers</strong> to Sanwer Hub (Centre C)</li>
                <li>Activate <strong>1 Auxiliary Weighbridge Counter</strong></li>
                <li>Extend operational receiving window by <strong>2 hours</strong></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center gap-3 bg-black/30 p-5 rounded-2xl border border-white/10">
            <div className="text-center">
              <span className="text-xs text-slate-400">Predicted Unmitigated Wait</span>
              <p className="text-3xl font-extrabold text-rose-400 mt-1 font-mono">
                {criticalCentre.predictedWaitMinutes} min
              </p>
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                Can be reduced to <strong>42 min</strong> with directives
              </p>
            </div>

            <Button
              variant="danger"
              size="lg"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-2"
            >
              {directiveIssued ? "Directive Re-issued ?" : "Issue AI Mitigation Directive"}
            </Button>
          </div>

        </div>
      </div>

      {/* Directive confirmation modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue State Emergency Procurement Directive"
        subtitle="Mandate immediate counter reallocation & SMS farmer rerouting"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-700 leading-relaxed">
            You are about to issue an executive coordination order to <strong>{criticalCentre.name}</strong>.
            This action will automatically notify 45 farmers in transit to redirect to <strong>Sanwer Grain Terminal (Centre C)</strong> and authorize auxiliary counter staffing.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-slate-800">
            <div className="flex items-center justify-between">
              <span>Rerouted Farmers:</span>
              <strong className="font-mono">45 Vehicles</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Auxiliary Counter:</span>
              <strong className="text-emerald-700">Counter #4 (Authorized)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Extended Hours:</span>
              <strong className="text-emerald-700">+2 Hours (Until 08:00 PM)</strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleIssueDirective}>
              Confirm & Dispatch Directive
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
import React from "react";
import { Link } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { CheckCircle2, Clock, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";

interface LiveQueueVisualizerProps {
  onOpenReschedule?: () => void;
  onOpenTokenSlip?: () => void;
}

export const LiveQueueVisualizer: React.FC<LiveQueueVisualizerProps> = ({
  onOpenReschedule,
  onOpenTokenSlip,
}) => {
  const { queueItems, farmerBooking } = useKrishiQ();

  const currentServingItem = queueItems.find((q) => q.status === "SERVING") || queueItems[3];

  return (
    <Card padding="lg" className="border-slate-200 shadow-xs">
      
      {/* Top Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">Live Mandi Queue</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Centre: <strong className="text-slate-800 font-semibold">{farmerBooking.centreName}</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-mono">Status update</span>
          <span className="text-xs font-semibold text-slate-700">Updated 30 seconds ago</span>
        </div>
      </div>

      {/* 4 Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-medium block">Current Token</span>
          <p className="text-2xl font-extrabold text-amber-700 mt-0.5 font-mono">
            {currentServingItem?.tokenNumber || "A124"}
          </p>
          <span className="text-[11px] text-amber-800 font-medium block mt-0.5">Now serving</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-medium block">Farmers Ahead</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-0.5 font-mono">
            8
          </p>
          <span className="text-[11px] text-slate-500 block mt-0.5">farmers in front</span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs text-emerald-800 font-semibold block">Estimated Wait</span>
          <p className="text-2xl font-extrabold text-emerald-900 mt-0.5 font-mono">
            35 min
          </p>
          <span className="text-[11px] text-emerald-700 block mt-0.5">Expected wait</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-medium block">Expected Service</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-0.5 font-mono">
            11:42 AM
          </p>
          <span className="text-[11px] text-slate-500 block mt-0.5">Counter 1</span>
        </div>

      </div>

      {/* Visual Queue Order (? Completed, ? Currently Serving, ? Waiting, ? Your Position) */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Queue Order & Token Stream
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1"><strong className="text-emerald-700">?</strong> Completed</span>
            <span className="flex items-center gap-1"><strong className="text-amber-600">?</strong> Serving</span>
            <span className="flex items-center gap-1"><strong className="text-slate-400">?</strong> Waiting</span>
            <span className="flex items-center gap-1"><strong className="text-emerald-800">?</strong> You</span>
          </div>
        </div>

        <div className="space-y-2">
          {queueItems.slice(0, 7).map((item) => {
            const isCompleted = item.status === "COMPLETED";
            const isServing = item.status === "SERVING";
            const isUser = item.isCurrentUser || item.tokenNumber === "A127";
            const isWaiting = !isCompleted && !isServing && !isUser;

            return (
              <div
                key={item.id}
                className={
                  "flex items-center justify-between p-3 rounded-xl border transition-all text-xs " +
                  (isUser
                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                    : isServing
                    ? "bg-amber-50/90 border-amber-300"
                    : isCompleted
                    ? "bg-slate-50/60 border-slate-200 opacity-60"
                    : "bg-white border-slate-200")
                }
              >
                <div className="flex items-center gap-3">
                  {/* Symbol Indicator */}
                  <div
                    className={
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm " +
                      (isCompleted
                        ? "bg-slate-200 text-emerald-800"
                        : isServing
                        ? "bg-amber-500 text-white animate-pulse"
                        : isUser
                        ? "bg-emerald-800 text-amber-300 shadow-xs"
                        : "bg-slate-100 text-slate-500")
                    }
                  >
                    {isCompleted && "?"}
                    {isServing && "?"}
                    {isWaiting && "?"}
                    {isUser && "?"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {item.tokenNumber}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {item.farmerName}
                      </span>
                      {isUser && (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-800 text-white text-[10px] font-extrabold">
                          ? YOU
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.crop} ({item.quantityQuintals} Qtl) � {item.village}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {isCompleted && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                      ? Done
                    </span>
                  )}
                  {isServing && (
                    <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2.5 py-1 rounded-md animate-pulse">
                      ? Currently serving
                    </span>
                  )}
                  {isWaiting && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      ? Waiting
                    </span>
                  )}
                  {isUser && (
                    <span className="text-xs font-extrabold text-emerald-950 bg-emerald-200 px-3 py-1 rounded-md border border-emerald-300">
                      ? Your Position (35 min)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Audio announcement will sound at Gate 1 when Token A126 is called.
        </p>

        <div className="flex items-center gap-2">
          {onOpenTokenSlip && (
            <Button variant="outline" size="sm" onClick={onOpenTokenSlip}>
              Digital Gate Slip
            </Button>
          )}
          {onOpenReschedule && (
            <Button variant="secondary" size="sm" onClick={onOpenReschedule}>
              Reschedule Slot
            </Button>
          )}
        </div>
      </div>

    </Card>
  );
};
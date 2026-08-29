import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { CheckCircle2, ShieldCheck, Scale, Award, FileText } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";

export const ProcurementStepper: React.FC = () => {
  const { farmerBooking } = useKrishiQ();

  const stages = [
    { number: 1, name: "Registered", status: "completed" },
    { number: 2, name: "Slot Booked", status: "completed" },
    { number: 3, name: "Arrived", status: "completed" },
    { number: 4, name: "Quality Check", status: "current" },
    { number: 5, name: "Weighing", status: "pending" },
    { number: 6, name: "Procured", status: "pending" },
    { number: 7, name: "Payment", status: "pending" },
  ];

  return (
    <Card padding="lg" className="border-slate-300 shadow-xs space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
            PROCUREMENT PROGRESS STATUS
          </span>
          <p className="text-xs text-slate-500 mt-0.5">
            Token: <strong className="font-mono text-slate-900">{farmerBooking.tokenNumber}</strong> � Lot: 65 Quintals Sharbati Wheat
          </p>
        </div>
        <Badge variant="normal">Stage 4 of 7</Badge>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden sm:block py-4 overflow-x-auto">
        <div className="min-w-[580px]">
          <div className="relative flex items-center justify-between">
            {/* Background connecting line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-300 z-0" />
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-700 z-0"
              style={{ width: "50%" }}
            />

            {stages.map((stage) => {
              const isCompleted = stage.status === "completed";
              const isCurrent = stage.status === "current";

              return (
                <div key={stage.number} className="relative z-10 flex flex-col items-center">
                  <div
                    className={
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all " +
                      (isCompleted
                        ? "bg-emerald-800 text-white"
                        : isCurrent
                        ? "bg-emerald-800 text-white ring-4 ring-emerald-100"
                        : "bg-white text-slate-400 border-2 border-slate-300")
                    }
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stage.number}
                  </div>

                  <div className="text-center mt-2">
                    <span
                      className={
                        "text-xs font-bold block " +
                        (isCurrent ? "text-emerald-950 font-extrabold" : isCompleted ? "text-slate-800" : "text-slate-400")
                      }
                    >
                      {stage.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isCompleted ? "?" : isCurrent ? "Current" : "Pending"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="sm:hidden space-y-3">
        {stages.map((stage) => {
          const isCompleted = stage.status === "completed";
          const isCurrent = stage.status === "current";

          return (
            <div key={stage.number} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200">
              <div
                className={
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " +
                  (isCompleted ? "bg-emerald-800 text-white" : isCurrent ? "bg-emerald-800 text-white ring-2 ring-emerald-100" : "bg-white text-slate-400 border border-slate-300")
                }
              >
                {isCompleted ? "?" : stage.number}
              </div>
              <div className="flex-1 flex justify-between items-center text-xs">
                <span className={"font-bold " + (isCurrent ? "text-emerald-900 font-extrabold" : "text-slate-800")}>
                  {stage.name}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isCompleted ? "Completed ?" : isCurrent ? "Active Now" : "Pending"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Active Inspection Details */}
      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-emerald-950 uppercase text-[11px]">
            CURRENT STAGE: QUALITY CHECK ASSAY REPORT
          </span>
          <Badge variant="success">Passed Standards ?</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-slate-700">
          <div>
            <span className="text-slate-500 block">Moisture Content</span>
            <strong className="text-sm font-mono text-emerald-950 font-bold">11.4%</strong>
            <span className="text-[10px] text-slate-500 block">(Limit: &lt; 12.0%)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Quality Grade</span>
            <strong className="text-sm font-bold text-slate-900">Grade A (FAQ)</strong>
            <span className="text-[10px] text-slate-500 block">Fair Average Quality</span>
          </div>
          <div>
            <span className="text-slate-500 block">Dockage / Foreign Matter</span>
            <strong className="text-sm font-mono text-slate-900">0.6%</strong>
            <span className="text-[10px] text-slate-500 block">(Limit: &lt; 1.5%)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Quality Officer</span>
            <strong className="text-xs text-slate-900 block mt-0.5">QC Lab Lead Officer</strong>
            <span className="text-[10px] text-slate-500 block">Assayed at 11:15 AM</span>
          </div>
        </div>
      </div>

      {/* Next Scheduled Station: Weighbridge */}
      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
        <div>
          <span className="font-bold text-slate-900">Next Station: Weighing Station (WB-02)</span>
          <p className="text-slate-500 text-[11px] mt-0.5">Automated gross and tare weighment scheduled upon queue call.</p>
        </div>
        <span className="font-mono text-slate-600 font-semibold">Scheduled Next</span>
      </div>

    </Card>
  );
};
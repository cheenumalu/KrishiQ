import React, { useState } from "react";
import { Sliders, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const AdminSimulator: React.FC = () => {
  const [additionalFarmers, setAdditionalFarmers] = useState<number>(200);
  const [counters, setCounters] = useState<number>(4);
  const [staffAvailable, setStaffAvailable] = useState<number>(8);
  const [operatingHours, setOperatingHours] = useState<number>(8);

  const baselineWait = 46;
  const predictedWait = 91;
  const afterOptimizationWait = 54;
  const reduction = 37;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 px-1">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
              Prototype Simulation
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              What-If Procurement Demand Simulator
            </h1>
          </div>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Test policy decisions: simulate arrival surges, auxiliary counter deployments, and extended operating hours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left: SIMULATION PARAMETERS */}
        <Card padding="lg" className="border-slate-300 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
              SIMULATION PARAMETERS
            </span>
            <button
              onClick={() => { setAdditionalFarmers(200); setCounters(4); setStaffAvailable(8); setOperatingHours(8); }}
              className="text-[11px] text-emerald-800 font-bold hover:underline"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-semibold">Additional farmers:</span>
                <strong className="font-mono text-slate-900">[ {additionalFarmers} ]</strong>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={additionalFarmers}
                onChange={(e) => setAdditionalFarmers(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-semibold">Number of counters:</span>
                <strong className="font-mono text-slate-900">[ {counters} ]</strong>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCounters((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded bg-white border border-slate-300 font-bold text-slate-800"
                >
                  -
                </button>
                <span className="font-mono font-bold text-slate-900">{counters}</span>
                <button
                  type="button"
                  onClick={() => setCounters((prev) => Math.min(8, prev + 1))}
                  className="w-7 h-7 rounded bg-white border border-slate-300 font-bold text-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-semibold">Available staff:</span>
                <strong className="font-mono text-slate-900">[ {staffAvailable} ]</strong>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded border border-slate-200">
                <button
                  type="button"
                  onClick={() => setStaffAvailable((prev) => Math.max(4, prev - 1))}
                  className="w-7 h-7 rounded bg-white border border-slate-300 font-bold text-slate-800"
                >
                  -
                </button>
                <span className="font-mono font-bold text-slate-900">{staffAvailable}</span>
                <button
                  type="button"
                  onClick={() => setStaffAvailable((prev) => Math.min(20, prev + 1))}
                  className="w-7 h-7 rounded bg-white border border-slate-300 font-bold text-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between mb-1">
                <span className="text-slate-700 font-semibold">Operating hours:</span>
                <strong className="font-mono text-slate-900">[ {operatingHours} ]</strong>
              </div>
              <input
                type="range"
                min="6"
                max="12"
                value={operatingHours}
                onChange={(e) => setOperatingHours(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Right: SIMULATION RESULT */}
        <div className="space-y-4">
          <Card padding="lg" className="border-slate-300 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
                SIMULATION RESULT
              </span>
              <Badge variant="normal">Calculated Projection</Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Current waiting time:</span>
                <strong className="font-mono text-slate-900">{baselineWait} min</strong>
              </div>

              <div className="flex justify-between p-2 rounded bg-red-50 border border-red-200 text-red-900">
                <span className="font-semibold">Predicted waiting time:</span>
                <strong className="font-mono font-bold text-red-900">{predictedWait} min</strong>
              </div>

              <div className="flex justify-between p-2 rounded bg-emerald-50 border border-emerald-300 text-emerald-950">
                <span className="font-bold">After recommended changes:</span>
                <strong className="font-mono font-extrabold text-emerald-950">{afterOptimizationWait} min</strong>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <strong className="text-slate-900 block uppercase text-[11px]">Recommended action:</strong>
              <p className="text-slate-700">� Add 2 counters</p>
              <p className="text-slate-700">� Redirect 45 farmers</p>
            </div>

            {/* Expected Result */}
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
              <span className="font-bold text-emerald-950">Expected improvement:</span>
              <strong className="font-mono font-extrabold text-emerald-950">{reduction} minutes</strong>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
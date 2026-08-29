import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { formatQuintals } from "../../utils/calculations";
import { FileText, Printer, CheckCircle2, ShieldCheck, Scale, Award } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const CentreProcurement: React.FC = () => {
  const { selectedCentre } = useKrishiQ();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Procurement & Quality Assay Log
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Daily Fair Average Quality (FAQ) standards & weighment calibration ledger.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          Print Daily Shift Ledger
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md" className="border-slate-300">
          <span className="text-xs text-slate-500 block font-medium">Today Procured</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{formatQuintals(3240)}</p>
          <span className="text-[11px] text-slate-500 block mt-0.5">Target: 4,000 Qtl</span>
        </Card>

        <Card padding="md" className="border-slate-300">
          <span className="text-xs text-slate-500 block font-medium">Weighbridge Calibration</span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1 font-mono">Calibrated ?</p>
          <span className="text-[11px] text-slate-500 block mt-0.5">WB-01 & WB-02 Verified</span>
        </Card>

        <Card padding="md" className="border-slate-300">
          <span className="text-xs text-slate-500 block font-medium">Average Moisture</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">11.6%</p>
          <span className="text-[11px] text-slate-500 block mt-0.5">Within permissible &lt; 12.0%</span>
        </Card>
      </div>

      <Card padding="lg" className="border-slate-300 space-y-4">
        <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800 block pb-2 border-b border-slate-200">
          Recent Quality Assay Records (Today's Shift)
        </span>

        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <strong className="text-slate-900">Token A124 (Rajesh Kumar)</strong>
              <p className="text-slate-500 text-[11px]">42 Qtl Wheat � Moisture 11.2% � Foreign Matter 0.4% � Grade A (FAQ)</p>
            </div>
            <Badge variant="success">Passed ?</Badge>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <strong className="text-slate-900">Token A123 (Om Prakash)</strong>
              <p className="text-slate-500 text-[11px]">36 Qtl Maize � Moisture 12.1% � Foreign Matter 0.7% � Grade A (FAQ)</p>
            </div>
            <Badge variant="success">Passed ?</Badge>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <strong className="text-slate-900">Token A122 (Devendra Chouhan)</strong>
              <p className="text-slate-500 text-[11px]">50 Qtl Wheat � Moisture 11.8% � Foreign Matter 0.5% � Grade A (FAQ)</p>
            </div>
            <Badge variant="success">Passed ?</Badge>
          </div>
        </div>
      </Card>

    </div>
  );
};
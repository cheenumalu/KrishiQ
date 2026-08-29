import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { CheckCircle2, ShieldCheck, Scale } from "lucide-react";

interface QualityGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const QualityGradingModal: React.FC<QualityGradingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [moisture, setMoisture] = useState("11.2");
  const [dockage, setDockage] = useState("0.5");
  const [foreignMatter, setForeignMatter] = useState("0.2");
  const [grade, setGrade] = useState<"Grade A" | "FAQ" | "Below FAQ">("Grade A");
  const [grossWeight, setGrossWeight] = useState("9120");
  const [tareWeight, setTareWeight] = useState("2620");

  const netWeightQuintals = (Math.max(0, Number(grossWeight) - Number(tareWeight)) / 100).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      moisture: Number(moisture),
      dockage: Number(dockage),
      foreignMatter: Number(foreignMatter),
      grade,
      netWeightQuintals: Number(netWeightQuintals),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Electronic Assay & Weighbridge Entry"
      subtitle="Digital lot grading for central pool procurement"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Quality Assay Section */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            1. Grain Quality Parameters (FAQ Limits)
          </h5>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-600 block mb-1">Moisture % (Max 12%)</label>
              <input
                type="number"
                step="0.1"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-white"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Dockage % (Max 1%)</label>
              <input
                type="number"
                step="0.1"
                value={dockage}
                onChange={(e) => setDockage(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-white"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Foreign Matter %</label>
              <input
                type="number"
                step="0.1"
                value={foreignMatter}
                onChange={(e) => setForeignMatter(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 font-bold text-slate-900 bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-600 block mb-1 font-semibold">Assigned Quality Grade</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Grade A", "FAQ", "Below FAQ"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={
                    "py-1.5 rounded-lg border font-bold text-xs cursor-pointer transition-all " +
                    (grade === g
                      ? "bg-emerald-800 text-white border-emerald-800"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100")
                  }
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Weighbridge Section */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-slate-700" />
            2. Electronic Weighbridge Calibration
          </h5>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 block mb-1">Gross Weight (Kg)</label>
              <input
                type="number"
                value={grossWeight}
                onChange={(e) => setGrossWeight(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 bg-white"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Tare / Vehicle Weight (Kg)</label>
              <input
                type="number"
                value={tareWeight}
                onChange={(e) => setTareWeight(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 bg-white"
                required
              />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <span className="text-emerald-900 font-semibold">Calculated Net Procurement Lot:</span>
            <span className="text-sm font-mono font-extrabold text-emerald-900">{netWeightQuintals} Quintals</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Generate Weighment Slip & Pass
          </Button>
        </div>

      </form>
    </Modal>
  );
};
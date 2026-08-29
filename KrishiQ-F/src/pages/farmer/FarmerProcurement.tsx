import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { ProcurementStepper } from "../../components/farmer/ProcurementStepper";
import { Printer } from "lucide-react";
import { Button } from "../../components/common/Button";

export const FarmerProcurement: React.FC = () => {
  const { farmerBooking } = useKrishiQ();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Procurement Tracking & Inspection
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Stage-by-stage verification record for Token #{farmerBooking.tokenNumber}.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          Print Record
        </Button>
      </div>

      <ProcurementStepper />

    </div>
  );
};
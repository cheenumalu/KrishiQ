import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { ProcurementStepper } from "../../components/farmer/ProcurementStepper";
import { Printer } from "lucide-react";
import { Button } from "../../components/common/Button";

export const FarmerProcurement: React.FC = () => {
  const { farmerBooking } = useKrishiQ();
  const { t, isHindi } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1 border-b border-[#E4E9E5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
            {t("farmer.procurementTitle")}
          </h1>
          <p className="text-sm text-[#66736B] font-medium mt-0.5">
            {isHindi
              ? `टोकन #${farmerBooking.tokenNumber} का चरणबद्ध सत्यापन एवं जाँच रिकॉर्ड।`
              : `Stage-by-stage verification record for Token #${farmerBooking.tokenNumber}.`}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          {isHindi ? "रिकॉर्ड प्रिंट करें" : "Print Record"}
        </Button>
      </div>

      <ProcurementStepper />

    </div>
  );
};
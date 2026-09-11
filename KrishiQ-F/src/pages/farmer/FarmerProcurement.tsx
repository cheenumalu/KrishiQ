import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { ProcurementStepper } from "../../components/farmer/ProcurementStepper";
import { FarmerTokenSwitcher } from "../../components/farmer/FarmerTokenSwitcher";
import { AuditTrailModal } from "../../components/common/AuditTrailModal";
import { GrievanceModal } from "../../components/farmer/GrievanceModal";
import {
  Printer,
  ShieldCheck,
  Scale,
  History,
  AlertCircle,
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { formatCurrency } from "../../utils/calculations";

export const FarmerProcurement: React.FC = () => {
  const { farmerBooking, isItemHighlighted } = useKrishiQ();
  const { t, isHindi } = useLanguage();
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);

  const stageNumber = farmerBooking.currentStageNumber || 1;
  const isHighlighted = isItemHighlighted(farmerBooking.id);

  const quality = farmerBooking.qualityCheck || {
    moisturePercent: 11.4,
    dockagePercent: 0.3,
    foreignMatterPercent: 0.4,
    grade: "Grade A" as const,
    passed: true,
    inspectedBy: "QC Officer R. Sharma",
    inspectedAt: "Today, 10:05 AM",
  };

  const weighing = farmerBooking.weighing || {
    grossWeightKg: Math.round(farmerBooking.quantityQuintals * 100 + 750),
    tareWeightKg: 750,
    netWeightQuintals: farmerBooking.quantityQuintals,
    bagCount: Math.round(farmerBooking.quantityQuintals * 2),
    weighbridgeId: "WB-02-DIGITAL",
    weighedAt: "Today, 10:12 AM",
  };

  const payment = farmerBooking.payment || {
    mspRatePerQuintal: 2275,
    grossAmount: farmerBooking.quantityQuintals * 2275,
    mandiFeeDeduction: 0,
    netPayableAmount: farmerBooking.quantityQuintals * 2275,
    bankName: "State Bank of India",
    accountEnding: "4092",
    ifscPrefix: "SBIN0000382",
    pfmsReferenceId: "PFMS-MP-2026-884102",
    utrNumber: "UTRIB26241088492",
    paymentInitiatedDate: "Today",
    paymentExpectedDate: "Within 24h",
    status: "PENDING" as const,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 px-1">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1 border-b border-[#E4E9E5] dark:border-[#23362B]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] dark:text-[#F0F5F1] tracking-tight">
            {t("farmer.procurementTitle")}
          </h1>
          <p className="text-sm text-[#66736B] dark:text-[#9EAEA4] font-medium mt-0.5">
            {isHindi
              ? `टोकन #${farmerBooking.tokenNumber} का चरणबद्ध सत्यापन, डिजिटल लैब रिपोर्ट एवं तौल पर्ची।`
              : `Certified quality inspection, digital assay certificate & weighbridge slip for Token #${farmerBooking.tokenNumber}.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<History className="w-3.5 h-3.5 text-[#2F7D4A]" />}
            onClick={() => setIsAuditOpen(true)}
          >
            {isHindi ? "ऑडिट ट्रेल" : "View Audit Trail"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<AlertCircle className="w-3.5 h-3.5 text-[#F2A93B]" />}
            onClick={() => setIsGrievanceOpen(true)}
          >
            {isHindi ? "शिकायत दर्ज करें" : "Raise Grievance"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => window.print()}
          >
            {isHindi ? "प्रमाणपत्र प्रिंट करें" : "Print Certificate"}
          </Button>
        </div>
      </div>

      {/* Multi-Token Switcher */}
      <FarmerTokenSwitcher />

      {/* Interactive 8-Stage Stepper */}
      <ProcurementStepper />

      {/* Main Procurement Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Card 1: Grain Quality Assay Certificate */}
        <Card
          padding="lg"
          className={`border-[#E4E9E5] dark:border-[#23362B] card-shadow space-y-4 transition-all ${
            isHighlighted ? "highlight-pulse ring-2 ring-[#2F7D4A]/40" : ""
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E9E5] dark:border-[#23362B]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EEF5EF] dark:bg-[#1A3125] flex items-center justify-center text-[#2F7D4A] dark:text-[#52DB89]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] text-[#111827] dark:text-[#F0F5F1]">
                  {isHindi ? "1. अनाज गुणवत्ता परीक्षण प्रमाण पत्र" : "1. Grain Quality Assay Certificate"}
                </h3>
                <span className="text-xs text-[#374151] dark:text-[#CBD5E1] font-medium">
                  {isHindi ? "केंद्रीय पूल FAQ विनिर्देश 2026-27" : "Central Pool FAQ Standards 2026-27"}
                </span>
              </div>
            </div>

            <Badge variant={stageNumber >= 4 ? (quality.passed ? "success" : "critical") : "warning"}>
              {stageNumber >= 4
                ? (quality.passed ? (isHindi ? "मानक उत्तीर्ण ✓" : "FAQ Certified ✓") : "Below FAQ")
                : (isHindi ? "जाँच प्रतीक्षारत" : "Pending QC")}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B]">
              <span className="text-[#374151] dark:text-[#CBD5E1] block text-[11px] font-semibold">{isHindi ? "नमी प्रतिशत (Moisture)" : "Moisture Content"}</span>
              <strong className="text-base font-mono font-bold text-[#123D2D] dark:text-[#52DB89]">
                {stageNumber >= 4 ? `${quality.moisturePercent}%` : "--"}
              </strong>
              <span className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] block mt-0.5">
                {isHindi ? "अधिकतम अनुमेय सीमा: 12.0%" : "Permissible limit: < 12.0%"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B]">
              <span className="text-[#374151] dark:text-[#CBD5E1] block text-[11px] font-semibold">{isHindi ? "अनाज ग्रेडिंग" : "Assayed Grade"}</span>
              <strong className="text-base font-bold text-[#111827] dark:text-[#F0F5F1]">
                {stageNumber >= 4 ? quality.grade : "--"}
              </strong>
              <span className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] block mt-0.5">
                {isHindi ? "उचित औसत गुणवत्ता (FAQ)" : "Fair Average Quality"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B]">
              <span className="text-[#374151] dark:text-[#CBD5E1] block text-[11px] font-semibold">{isHindi ? "कचरा / अन्य पदार्थ" : "Foreign Matter"}</span>
              <strong className="text-base font-mono font-bold text-[#111827] dark:text-[#F0F5F1]">
                {stageNumber >= 4 ? `${quality.foreignMatterPercent}%` : "--"}
              </strong>
              <span className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] block mt-0.5">
                {isHindi ? "अधिकतम सीमा: 1.5%" : "Permissible: < 1.5%"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B]">
              <span className="text-[#374151] dark:text-[#CBD5E1] block text-[11px] font-semibold">{isHindi ? "डोकेज प्रतिशत" : "Dockage / Refraction"}</span>
              <strong className="text-base font-mono font-bold text-[#111827] dark:text-[#F0F5F1]">
                {stageNumber >= 4 ? `${quality.dockagePercent}%` : "--"}
              </strong>
              <span className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] block mt-0.5">
                {isHindi ? "अधिकतम सीमा: 1.0%" : "Permissible: < 1.0%"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#EEF5EF] dark:bg-[#1A3125] border border-[#58A66B]/30 flex items-center justify-between text-xs text-[#123D2D] dark:text-[#52DB89]">
            <span className="font-bold">{isHindi ? "जाँच अधिकारी:" : "Certified By:"} {quality.inspectedBy}</span>
            <span className="font-mono text-[11px] font-semibold">{quality.inspectedAt}</span>
          </div>
        </Card>

        {/* Card 2: Certified Electronic Weighbridge Measurement Slip */}
        <Card
          padding="lg"
          className={`border-[#E4E9E5] dark:border-[#23362B] card-shadow space-y-4 transition-all ${
            isHighlighted ? "highlight-pulse ring-2 ring-[#2F7D4A]/40" : ""
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E9E5] dark:border-[#23362B]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EEF5EF] dark:bg-[#1A3125] flex items-center justify-center text-[#2F7D4A] dark:text-[#52DB89]">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] text-[#111827] dark:text-[#F0F5F1]">
                  {isHindi ? "2. इलेक्ट्रॉनिक तौल कांटा मापन पर्ची" : "2. Electronic Weighbridge Slip"}
                </h3>
                <span className="text-xs text-[#374151] dark:text-[#CBD5E1] font-mono font-medium">
                  {weighing.weighbridgeId} • Digital Weight Sensor
                </span>
              </div>
            </div>

            <Badge variant={stageNumber >= 5 ? "success" : "warning"}>
              {stageNumber >= 5 ? (isHindi ? "तौल सत्यापित ✓" : "Weighed ✓") : (isHindi ? "कांटा प्रतीक्षारत" : "Pending Weighing")}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B]">
              <span className="text-[#374151] dark:text-[#CBD5E1] block text-[11px] font-semibold">{isHindi ? "सकल वजन (Gross Weight)" : "Gross Weight (Loaded)"}</span>
              <strong className="text-base font-mono font-bold text-[#111827] dark:text-[#F0F5F1]">
                {stageNumber >= 5 ? `${weighing.grossWeightKg} KG` : "--"}
              </strong>
              <span className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] block mt-0.5">
                {isHindi ? "वाहन + उपज वजन" : "Tractor/Trolley + Grain"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B]">
              <span className="text-[#374151] dark:text-[#CBD5E1] block text-[11px] font-semibold">{isHindi ? "खाली वजन (Tare Weight)" : "Tare Weight (Empty)"}</span>
              <strong className="text-base font-mono font-bold text-[#111827] dark:text-[#F0F5F1]">
                {stageNumber >= 5 ? `${weighing.tareWeightKg} KG` : "--"}
              </strong>
              <span className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] block mt-0.5">
                {isHindi ? "खाली वाहन वजन" : "Vehicle Tare Weight"}
              </span>
            </div>

            <div className="col-span-2 p-3.5 rounded-xl bg-[#EEF5EF] dark:bg-[#1A3125] border border-[#58A66B]/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#123D2D] dark:text-[#52DB89] block">
                  {isHindi ? "प्रमाणित शुद्ध उपज वजन (Net Quantity):" : "Certified Net Quantity:"}
                </span>
                <span className="text-xs text-[#374151] dark:text-[#CBD5E1] font-medium">
                  {isHindi ? `${weighing.bagCount} मानक बोरियाँ (50 KG Jute Bags)` : `${weighing.bagCount} Standard 50KG Bags`}
                </span>
              </div>
              <strong className="text-2xl font-mono font-extrabold text-[#123D2D] dark:text-[#52DB89]">
                {stageNumber >= 5 ? `${weighing.netWeightQuintals} Qtl` : `${farmerBooking.quantityQuintals} Qtl`}
              </strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B] flex items-center justify-between text-xs text-[#374151] dark:text-[#CBD5E1]">
            <span className="font-medium">{isHindi ? "कांटा ऑपरेटर:" : "Weighbridge Operator:"} WB-02 Incharge</span>
            <span className="font-mono text-[11px] font-semibold">{weighing.weighedAt}</span>
          </div>
        </Card>

      </div>

      {/* Card 3: Silo Transfer & Government Procurement Receipt */}
      <Card padding="lg" className="border-[#E4E9E5] dark:border-[#23362B] card-shadow space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E4E9E5] dark:border-[#23362B]">
          <div>
            <h3 className="font-bold text-[15px] text-[#111827] dark:text-[#F0F5F1]">
              {isHindi ? "3. साइलो उपार्जन एवं DBT भुगतान स्थिति" : "3. Silo Storage Lot & DBT Payout Clearance"}
            </h3>
            <span className="text-xs text-[#374151] dark:text-[#CBD5E1] font-medium">
              {isHindi ? "मंडी गेट पास #GP-2026-9042" : "Official Mandi Gate Pass #GP-2026-9042"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={stageNumber === 8 ? "success" : stageNumber >= 7 ? "warning" : "info"}>
              {stageNumber === 8
                ? (isHindi ? "भुगतान पूर्ण ✓" : "Payment Credited ✓")
                : stageNumber >= 7
                ? (isHindi ? "भुगतान प्रक्रियाधीन" : "PFMS Initiated")
                : (isHindi ? "उपार्जन प्रक्रिया में" : "In Procurement Flow")}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#F6F8F4] dark:bg-[#101B15] rounded-xl border border-[#E4E9E5] dark:border-[#23362B]">
            <span className="text-[#374151] dark:text-[#CBD5E1] block text-[11px] font-semibold">{isHindi ? "समर्थन मूल्य (MSP Rate)" : "MSP Rate / Qtl"}</span>
            <strong className="text-base font-mono font-bold text-[#111827] dark:text-[#F0F5F1]">
              ₹{payment.mspRatePerQuintal}
            </strong>
          </div>

          <div className="p-3 bg-[#F6F8F4] dark:bg-[#101B15] rounded-xl border border-[#E4E9E5] dark:border-[#23362B]">
            <span className="text-[#374151] dark:text-[#CBD5E1] block text-[11px] font-semibold">{isHindi ? "कुल देय राशि (Gross)" : "Gross Payout"}</span>
            <strong className="text-base font-mono font-bold text-[#123D2D] dark:text-[#52DB89]">
              {formatCurrency(payment.netPayableAmount)}
            </strong>
          </div>

          <div className="p-3 bg-[#F6F8F4] dark:bg-[#101B15] rounded-xl border border-[#E4E9E5] dark:border-[#23362B]">
            <span className="text-[#374151] dark:text-[#CBD5E1] block text-[11px] font-semibold">{isHindi ? "PFMS संदर्भ आईडी" : "PFMS Reference ID"}</span>
            <strong className="text-xs font-mono font-bold text-[#111827] dark:text-[#F0F5F1] block truncate">
              {payment.pfmsReferenceId}
            </strong>
          </div>

          <div className="p-3 bg-[#F6F8F4] dark:bg-[#101B15] rounded-xl border border-[#E4E9E5] dark:border-[#23362B]">
            <span className="text-[#374151] dark:text-[#CBD5E1] block text-[11px] font-semibold">{isHindi ? "बैंक खाता (DBT)" : "Bank Account"}</span>
            <strong className="text-xs font-mono font-bold text-[#111827] dark:text-[#F0F5F1] block">
              XXXX-XXXX-{payment.accountEnding}
            </strong>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <AuditTrailModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        bookingToken={farmerBooking.tokenNumber}
      />
      <GrievanceModal
        isOpen={isGrievanceOpen}
        onClose={() => setIsGrievanceOpen(false)}
        bookingToken={farmerBooking.tokenNumber}
      />
    </div>
  );
};

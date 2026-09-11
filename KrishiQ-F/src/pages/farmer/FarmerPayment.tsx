import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { formatCurrency } from "../../utils/calculations";
import { Download, CheckCircle2, Clock, AlertCircle, History, Zap } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { AuditTrailModal } from "../../components/common/AuditTrailModal";
import { GrievanceModal } from "../../components/farmer/GrievanceModal";
import { FarmerTokenSwitcher } from "../../components/farmer/FarmerTokenSwitcher";

export const FarmerPayment: React.FC = () => {
  const { farmerBooking, simulatePayment, isItemHighlighted, addToast } = useKrishiQ();
  const { t, isHindi } = useLanguage();
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const payment = farmerBooking.payment || {
    mspRatePerQuintal: 2275,
    grossAmount: 79625,
    mandiFeeDeduction: 0,
    netPayableAmount: 79625,
    bankName: isHindi ? "भारतीय स्टेट बैंक (इंदौर शाखा)" : "State Bank of India (Indore Branch)",
    accountEnding: "4092",
    ifscPrefix: "SBIN0000382",
    pfmsReferenceId: "PFMS-MP-2026-884102",
    utrNumber: "UTRIB26241088492",
    paymentInitiatedDate: "Today",
    paymentExpectedDate: "Within 24h of intake",
    status: "PENDING" as const,
  };

  const isCompleted = payment.status === "COMPLETED";
  const isInitiated = payment.status === "INITIATED";
  const isPending = payment.status === "PENDING";
  const isHighlighted = isItemHighlighted(farmerBooking.id);

  const handleSimulatePaymentAdvance = async () => {
    setIsSimulating(true);
    try {
      if (isPending) {
        await simulatePayment(farmerBooking.id, "INITIATED");
      } else if (isInitiated) {
        await simulatePayment(farmerBooking.id, "COMPLETED");
      } else {
        await simulatePayment(farmerBooking.id, "PENDING");
      }
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#E4E9E5] dark:border-[#23362B]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] dark:text-[#F0F5F1] tracking-tight">
            {t("farmer.paymentTitle")}
          </h1>
          <p className="text-sm text-[#66736B] dark:text-[#9EAEA4] font-medium">
            {t("farmer.paymentSubheading")}
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
            {isHindi ? "शिकायत दर्ज करें" : "Raise Dispute"}
          </Button>
        </div>
      </div>

      {/* Multi-booking switcher */}
      <FarmerTokenSwitcher />

      {/* Official Transaction Summary Receipt Card */}
      <Card
        padding="lg"
        className={`border-[#E4E9E5] dark:border-[#23362B] card-shadow space-y-5 transition-all ${
          isHighlighted ? "highlight-pulse ring-2 ring-[#2F7D4A]/40" : ""
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E4E9E5] dark:border-[#23362B]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] dark:text-[#52DB89]">
              {isHindi ? "PFMS डायरेक्ट बेनिफिट ट्रांसफर (DBT)" : "PFMS DIRECT BENEFIT TRANSFER (DBT)"}
            </span>
            <Badge variant={isCompleted ? "success" : isInitiated ? "warning" : "info"} dot>
              {isCompleted
                ? isHindi ? "बैंक खाते में जमा ✓" : "Credited to Bank ✓"
                : isInitiated
                ? isHindi ? "PFMS भुगतान प्रक्रियाधीन" : "PFMS Processing"
                : isHindi ? "उपार्जन पश्चात देय" : "Pending Intake Clearance"}
            </Badge>
          </div>

          <span className="text-xs text-[#66736B] dark:text-[#9EAEA4] font-mono">
            {isHindi ? "संदर्भ:" : "PFMS Ref:"} {payment.pfmsReferenceId}
          </span>
        </div>

        {/* Amount Hero Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#66736B] dark:text-[#9EAEA4] block font-medium">
              {isHindi ? "कुल शुद्ध देय राशि (MSP Payout)" : "Net Guaranteed MSP Payout"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17211B] dark:text-[#F0F5F1] font-mono tabular-nums mt-0.5">
              {formatCurrency(payment.netPayableAmount)}
            </h2>
            <span className="text-xs text-[#2F7D4A] dark:text-[#52DB89] font-semibold block mt-1">
              {isHindi
                ? `आधिकारिक समर्थन मूल्य दर: ₹${payment.mspRatePerQuintal} / क्विंटल (${farmerBooking.quantityQuintals} क्विंटल)`
                : `Calculated at Official MSP rate of ₹${payment.mspRatePerQuintal} / Qtl (${farmerBooking.quantityQuintals} Qtl)`}
            </span>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() =>
                addToast(
                  isHindi ? "रसीद डाउनलोड हुई" : "Receipt Downloaded",
                  isHindi ? "आधिकारिक DBT उपार्जन चालान PDF के रूप में सहेजा गया।" : "Official DBT procurement invoice saved as PDF.",
                  "info"
                )
              }
            >
              {isHindi ? "PDF रसीद डाउनलोड करें" : "Download PDF Slip"}
            </Button>

            {/* PFMS Simulation Demo Button */}
            <button
              onClick={handleSimulatePaymentAdvance}
              disabled={isSimulating}
              className="text-[11px] font-semibold text-[#123D2D] dark:text-[#52DB89] bg-[#EEF5EF] dark:bg-[#1A3125] hover:bg-[#E4E9E5] px-2.5 py-1 rounded-lg border border-[#58A66B]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-3 h-3 text-[#F2A93B]" />
              <span>
                {isPending
                  ? isHindi ? "डेमो: भुगतान शुरू करें" : "Demo: Simulate PFMS Init"
                  : isInitiated
                  ? isHindi ? "डेमो: भुगतान पूरा करें" : "Demo: Simulate Bank Credit"
                  : isHindi ? "डेमो: रीसेट" : "Demo: Reset Payment"}
              </span>
            </button>
          </div>
        </div>

        {/* Transaction Data Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-[#142019] border border-[#E4E9E5] dark:border-[#23362B] space-y-2.5 text-[#17211B] dark:text-[#F0F5F1]">
            <span className="font-bold block text-xs uppercase pb-1 border-b border-[#E4E9E5] dark:border-[#23362B]">
              {isHindi ? "उपार्जन एवं तौल विवरण" : "Procurement Summary"}
            </span>
            <div className="flex justify-between">
              <span className="text-[#66736B] dark:text-[#9EAEA4]">{isHindi ? "फसल व किस्म:" : "Crop & Variety:"}</span>
              <strong>{farmerBooking.variety || "Sharbati Wheat"}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736B] dark:text-[#9EAEA4]">{isHindi ? "स्वीकृत मात्रा:" : "Certified Quantity:"}</span>
              <strong className="font-mono">{farmerBooking.quantityQuintals} Quintals</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736B] dark:text-[#9EAEA4]">{isHindi ? "उपार्जन केंद्र:" : "Procurement Centre:"}</span>
              <span>{farmerBooking.centreName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736B] dark:text-[#9EAEA4]">{isHindi ? "मंडी टैक्स कटौती:" : "Mandi Fee Deduction:"}</span>
              <strong className="text-[#2F7D4A] dark:text-[#52DB89]">₹0 (100% Exemption)</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#142019] border border-[#E4E9E5] dark:border-[#23362B] space-y-2.5 text-[#17211B] dark:text-[#F0F5F1]">
            <span className="font-bold block text-xs uppercase pb-1 border-b border-[#E4E9E5] dark:border-[#23362B]">
              {isHindi ? "सत्यापित DBT बैंक विवरण" : "Direct Benefit Bank Account"}
            </span>
            <div className="flex justify-between">
              <span className="text-[#66736B] dark:text-[#9EAEA4]">{isHindi ? "बैंक का नाम:" : "Bank Name:"}</span>
              <strong>{payment.bankName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736B] dark:text-[#9EAEA4]">{isHindi ? "खाता संख्या (Masked):" : "Account Number:"}</span>
              <strong className="font-mono">XXXX-XXXX-{payment.accountEnding}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736B] dark:text-[#9EAEA4]">{isHindi ? "IFSC कोड:" : "IFSC Prefix:"}</span>
              <strong className="font-mono">{payment.ifscPrefix}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736B] dark:text-[#9EAEA4]">{isHindi ? "आधार सत्यापन:" : "Aadhaar Linked:"}</span>
              <span className="text-[#2F7D4A] dark:text-[#52DB89] font-bold">सत्यापित (NPCI Seeding ✓)</span>
            </div>
          </div>
        </div>

        {/* Live DBT Settlement Tracking Timeline */}
        <div className="p-4 rounded-xl bg-[#EEF5EF] dark:bg-[#1A3125] border border-[#58A66B]/30 space-y-3">
          <span className="font-bold text-[#123D2D] dark:text-[#52DB89] text-xs uppercase block">
            {isHindi ? "DBT प्रत्यक्ष अंतरण स्थिति टाइमलाइन" : "DBT SETTLEMENT STATUS TIMELINE"}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-[#142019] rounded-lg border border-[#E4E9E5] dark:border-[#23362B]">
              <div className="flex items-center gap-1.5 font-bold text-[#2F7D4A] dark:text-[#52DB89]">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. {isHindi ? "मंडी आवक पूर्ण" : "Intake Cleared"}</span>
              </div>
              <p className="text-[11px] text-[#66736B] dark:text-[#9EAEA4] mt-1">
                {isHindi ? "वजन एवं गुणवत्ता प्रमाणित" : "Assay & weighment recorded"}
              </p>
            </div>

            <div className={`p-3 rounded-lg border ${
              isInitiated || isCompleted
                ? "bg-white dark:bg-[#142019] border-[#2F7D4A]/40"
                : "bg-white/60 dark:bg-[#142019]/60 border-[#E4E9E5] dark:border-[#23362B] opacity-60"
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-[#2F7D4A] dark:text-[#52DB89]">
                {isInitiated || isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4 text-[#8A958E]" />}
                <span>2. {isHindi ? "PFMS भुगतान आदेश" : "PFMS Batch Queued"}</span>
              </div>
              <p className="text-[11px] text-[#66736B] dark:text-[#9EAEA4] mt-1 font-mono">
                {payment.pfmsReferenceId}
              </p>
            </div>

            <div className={`p-3 rounded-lg border ${
              isCompleted
                ? "bg-white dark:bg-[#142019] border-emerald-400"
                : "bg-white/60 dark:bg-[#142019]/60 border-[#E4E9E5] dark:border-[#23362B] opacity-60"
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-[#8A958E]" />}
                <span>3. {isHindi ? "बैंक खाता क्रेडिट" : "Bank Credit Settled"}</span>
              </div>
              <p className="text-[11px] text-[#66736B] dark:text-[#9EAEA4] mt-1 font-mono">
                {isCompleted ? `UTR: ${payment.utrNumber}` : (isHindi ? "प्रक्रिया में (24 घंटे के भीतर)" : "Pending UTR clearance")}
              </p>
            </div>
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

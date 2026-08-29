import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { formatCurrency, formatQuintals } from "../../utils/calculations";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  FileText,
  Download,
  AlertCircle
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const FarmerPayment: React.FC = () => {
  const { farmerBooking, addToast } = useKrishiQ();
  const payment = farmerBooking.payment || {
    netPayableAmount: 147875,
    mspRatePerQuintal: 2275,
    pfmsReferenceId: "PFMS-MP-2026-9920148",
    bankName: "State Bank of India (Indore Branch)",
    accountEnding: "4092"
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      
      {/* Header */}
      <div className="space-y-0.5 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Direct Benefit Transfer (DBT) Payment Status
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Official Government Minimum Support Price (MSP) disbursement record.
        </p>
      </div>

      {/* Official Transaction Summary Receipt Card */}
      <Card padding="lg" className="border-slate-300 shadow-xs space-y-5">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
              PAYMENT TRANSACTION SUMMARY
            </span>
            <Badge variant="success">Payment Initiated</Badge>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Ref: {payment.pfmsReferenceId}
          </span>
        </div>

        {/* Amount Hero Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Total Procurement Amount (MSP)</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono mt-0.5">
              {formatCurrency(payment.netPayableAmount)}
            </h2>
            <span className="text-xs text-emerald-800 font-semibold block mt-1">
              Calculated at Official MSP rate of ?{payment.mspRatePerQuintal} / Quintal
            </span>
          </div>

          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => addToast("Receipt Downloaded", "Official DBT procurement invoice saved as PDF.", "info")}
            >
              Download PDF Receipt
            </Button>
          </div>
        </div>

        {/* Transaction Data Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2.5 text-slate-700">
            <span className="font-bold text-slate-900 block text-xs uppercase pb-1 border-b border-slate-100">
              Procurement Details
            </span>
            <div className="flex justify-between">
              <span>Accepted Quantity:</span>
              <strong className="text-slate-900 font-mono">65.0 Quintals (130 Bags)</strong>
            </div>
            <div className="flex justify-between">
              <span>Crop Variety:</span>
              <strong className="text-slate-900">Sharbati Wheat (Grade A)</strong>
            </div>
            <div className="flex justify-between">
              <span>Procurement Date:</span>
              <strong className="text-slate-900">29 August 2026</strong>
            </div>
            <div className="flex justify-between">
              <span>Procurement Centre:</span>
              <strong className="text-slate-900">{farmerBooking.centreName}</strong>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2.5 text-slate-700">
            <span className="font-bold text-slate-900 block text-xs uppercase pb-1 border-b border-slate-100">
              Bank Disbursement Details
            </span>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <strong className="text-emerald-800 font-bold">Payment Initiated</strong>
            </div>
            <div className="flex justify-between">
              <span>Beneficiary Bank:</span>
              <strong className="text-slate-900">{payment.bankName}</strong>
            </div>
            <div className="flex justify-between">
              <span>Account Number:</span>
              <strong className="text-slate-900 font-mono">XXXX-XXXX-{payment.accountEnding}</strong>
            </div>
            <div className="flex justify-between">
              <span>Expected Payment Date:</span>
              <strong className="text-slate-900 font-mono">30 August 2026</strong>
            </div>
          </div>

        </div>

        {/* DBT Process Notice */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong>Direct Benefit Transfer (DBT) via Public Financial Management System (PFMS):</strong>
            <p className="mt-0.5">
              Funds are credited directly into your Aadhaar-linked State Bank of India bank account within 24 to 48 hours of depot handover. Zero intermediary commission or mandi deduction.
            </p>
          </div>
        </div>

      </Card>

    </div>
  );
};
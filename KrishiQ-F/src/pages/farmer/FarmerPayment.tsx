import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { formatCurrency } from "../../utils/calculations";
import {
  Download,
  ShieldCheck
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const FarmerPayment: React.FC = () => {
  const { farmerBooking, addToast } = useKrishiQ();
  const { t, isHindi, formatLocation, formatCrop } = useLanguage();

  const payment = farmerBooking.payment || {
    netPayableAmount: 147875,
    mspRatePerQuintal: 2275,
    pfmsReferenceId: "PFMS-MP-2026-9920148",
    bankName: isHindi ? "भारतीय स्टेट बैंक (इंदौर शाखा)" : "State Bank of India (Indore Branch)",
    accountEnding: "4092"
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      
      {/* Header */}
      <div className="space-y-1 pb-1 border-b border-[#E4E9E5]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
          {t("farmer.paymentTitle")}
        </h1>
        <p className="text-sm text-[#66736B] font-medium">
          {t("farmer.paymentSubheading")}
        </p>
      </div>

      {/* Official Transaction Summary Receipt Card */}
      <Card padding="lg" className="border-[#E4E9E5] card-shadow space-y-5">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E4E9E5]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
              {isHindi ? "भुगतान लेन-देन सारांश" : "PAYMENT TRANSACTION SUMMARY"}
            </span>
            <Badge variant="success">
              {isHindi ? "भुगतान शुरू किया गया" : "Payment Initiated"}
            </Badge>
          </div>

          <span className="text-xs text-[#66736B] font-mono">
            {isHindi ? "संदर्भ:" : "Ref:"} {payment.pfmsReferenceId}
          </span>
        </div>

        {/* Amount Hero Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#66736B] block font-medium">
              {isHindi ? "कुल उपार्जन राशि (MSP)" : "Total Procurement Amount (MSP)"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17211B] font-sans tabular-nums mt-0.5">
              {formatCurrency(payment.netPayableAmount)}
            </h2>
            <span className="text-xs text-[#2F7D4A] font-semibold block mt-1">
              {isHindi
                ? `आधिकारिक समर्थन मूल्य दर: ₹${payment.mspRatePerQuintal} / क्विंटल`
                : `Calculated at Official MSP rate of ₹${payment.mspRatePerQuintal} / Quintal`}
            </span>
          </div>

          <div className="text-right">
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
              {isHindi ? "PDF रसीद डाउनलोड करें" : "Download PDF Receipt"}
            </Button>
          </div>
        </div>

        {/* Transaction Data Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-white border border-[#E4E9E5] space-y-2.5 text-[#17211B]">
            <span className="font-bold text-[#17211B] block text-xs uppercase pb-1 border-b border-[#E4E9E5]">
              {isHindi ? "उपार्जन विवरण" : "Procurement Details"}
            </span>
            <div className="flex justify-between">
              <span>{isHindi ? "स्वीकृत मात्रा:" : "Accepted Quantity:"}</span>
              <strong className="text-[#17211B] font-sans tabular-nums">
                {isHindi ? "65.0 क्विंटल (130 बोरी)" : "65.0 Quintals (130 Bags)"}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>{isHindi ? "फसल की किस्म:" : "Crop Variety:"}</span>
              <strong className="text-[#17211B]">
                {isHindi ? "शरबती गेहूँ (ग्रेड A)" : "Sharbati Wheat (Grade A)"}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>{isHindi ? "खरीदी की तारीख:" : "Procurement Date:"}</span>
              <strong className="text-[#17211B]">
                {isHindi ? "29 अगस्त 2026" : "29 August 2026"}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>{isHindi ? "खरीदी केंद्र:" : "Procurement Centre:"}</span>
              <strong className="text-[#17211B]">{formatLocation(farmerBooking.centreName)}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E4E9E5] space-y-2.5 text-[#17211B]">
            <span className="font-bold text-[#17211B] block text-xs uppercase pb-1 border-b border-[#E4E9E5]">
              {isHindi ? "बैंक अंतरण विवरण" : "Bank Disbursement Details"}
            </span>
            <div className="flex justify-between">
              <span>{t("farmer.paymentStatus")}:</span>
              <strong className="text-[#2F7D4A] font-bold">
                {isHindi ? "भुगतान प्रक्रिया में" : "Payment Initiated"}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>{isHindi ? "लाभार्थी बैंक:" : "Beneficiary Bank:"}</span>
              <strong className="text-[#17211B]">{payment.bankName}</strong>
            </div>
            <div className="flex justify-between">
              <span>{t("farmer.bankAccount")}:</span>
              <strong className="text-[#17211B] font-mono">XXXX-XXXX-{payment.accountEnding}</strong>
            </div>
            <div className="flex justify-between">
              <span>{isHindi ? "संभावित भुगतान तारीख:" : "Expected Payment Date:"}</span>
              <strong className="text-[#17211B]">
                {isHindi ? "30 अगस्त 2026" : "30 August 2026"}
              </strong>
            </div>
          </div>

        </div>

        {/* DBT Process Notice */}
        <div className="p-3.5 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30 text-xs text-[#17211B] leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#2F7D4A] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#123D2D]">
              {isHindi
                ? "सार्वजनिक वित्तीय प्रबंधन प्रणाली (PFMS) द्वारा प्रत्यक्ष लाभ अंतरण (DBT):"
                : "Direct Benefit Transfer (DBT) via Public Financial Management System (PFMS):"}
            </strong>
            <p className="mt-0.5 text-[#66736B]">
              {isHindi
                ? "उपज सुपुर्दगी के 24 से 48 घंटे के भीतर राशि सीधे आपके आधार-संबद्ध बैंक खाते में जमा कर दी जाती है। शून्य बिचौलिया कमीशन या मंडी कटौती।"
                : "Funds are credited directly into your Aadhaar-linked State Bank of India bank account within 24 to 48 hours of depot handover. Zero intermediary commission or mandi deduction."}
            </p>
          </div>
        </div>

      </Card>

    </div>
  );
};
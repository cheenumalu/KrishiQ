import React from "react";
import { Modal } from "../common/Modal";
import { FarmerBooking } from "../../types";
import { formatQuintals } from "../../utils/calculations";
import { useLanguage } from "../../i18n";
import { QrCode, Printer, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "../common/Button";
import { EmblemOfIndia } from "../common/EmblemOfIndia";

interface TokenSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: FarmerBooking;
}

export const TokenSlipModal: React.FC<TokenSlipModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const { t, isHindi, formatLocation, formatCrop, formatTimeSlot, formatDate } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isHindi ? "आधिकारिक डिजिटल मंडी गेट पास (प्रपत्र APMC-IV)" : "Official Mandi Gate Entry Pass (Form APMC-IV)"}
      subtitle={isHindi ? "राज्य कृषि उपज मंडी विपणन बोर्ड • अधिकृत प्रवेश टोकन" : "State Agricultural Marketing Board • Authorized Entry Token"}
      maxWidth="md"
    >
      <div className="space-y-4 font-sans print:p-0">
        
        {/* Official Gov Pass Header */}
        <div className="border-2 border-[#003366] bg-[#F8FAFC] dark:bg-[#0E1620] p-4 text-center relative overflow-hidden rounded-xs">
          <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-slate-700 pb-2 mb-2">
            <EmblemOfIndia size="sm" showText={false} />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#003366] dark:text-[#38BDF8] block">
                {isHindi ? "मध्य प्रदेश शासन • किसान कल्याण तथा कृषि विकास विभाग" : "Govt of Madhya Pradesh • Dept of Farmer Welfare & Agriculture"}
              </span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isHindi ? "राज्य कृषि उपज ई-उपार्जन गेट पास" : "State APMC Mandi Digital Intake Gate Pass"}
              </h4>
            </div>
            <div className="w-8 h-8 rounded-2xs bg-[#003366] text-white flex items-center justify-center font-bold text-xs">
              GoI
            </div>
          </div>

          <div className="bg-[#003366] text-white py-2 px-3 rounded-2xs my-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF9933] block">
              {isHindi ? "अधिकृत आगमन टोकन संख्या" : "AUTHORIZED INTAKE TOKEN NUMBER"}
            </span>
            <h3 className="text-3xl font-black font-mono tabular-nums tracking-widest text-white mt-0.5">
              #{booking.tokenNumber}
            </h3>
            <p className="text-[11px] text-slate-200 mt-0.5">
              {t("farmer.bookingId")}: <span className="font-mono font-bold text-[#FF9933]">{booking.id}</span>
            </p>
          </div>
        </div>

        {/* Structured Official Table of Particulars */}
        <div className="border border-[#CBD5E1] dark:border-slate-700 text-xs overflow-hidden rounded-xs">
          <div className="bg-[#F1F5F9] dark:bg-[#1E293B] px-3 py-1.5 border-b border-[#CBD5E1] dark:border-slate-700 font-bold text-[#003366] dark:text-white uppercase text-[11px]">
            {isHindi ? "उपज एवं किसान विवरण (Particulars)" : "Farmer & Produce Particulars"}
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-[#CBD5E1] dark:divide-slate-700 bg-white dark:bg-[#131D28]">
            <div className="p-2.5">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">{isHindi ? "किसान का नाम" : "Farmer Name"}</span>
              <strong className="text-[#003366] dark:text-white text-xs sm:text-sm font-bold">{isHindi ? "श्री राजेश शर्मा" : booking.farmerName}</strong>
            </div>

            <div className="p-2.5">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">{isHindi ? "पंजीकरण आईडी (समग्र/आधार)" : "Registration ID"}</span>
              <strong className="text-slate-900 dark:text-slate-100 font-mono font-bold">{booking.farmerId}</strong>
            </div>

            <div className="p-2.5">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">{isHindi ? "फसल एवं किस्म" : "Crop & Variety"}</span>
              <strong className="text-slate-900 dark:text-slate-100">{formatCrop(booking.crop)} ({booking.variety})</strong>
            </div>

            <div className="p-2.5">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">{isHindi ? "घोषित मात्रा" : "Declared Quantity"}</span>
              <strong className="text-[#15803D] dark:text-emerald-400 font-bold">{formatQuintals(booking.quantityQuintals)}</strong>
            </div>

            <div className="col-span-2 p-2.5 bg-slate-50 dark:bg-[#0E1620]">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">{isHindi ? "आवंटित उपार्जन केंद्र (APMC Mandi)" : "Designated Mandi Centre"}</span>
              <strong className="text-[#003366] dark:text-[#38BDF8] text-sm">{formatLocation(booking.centreName)}</strong>
            </div>

            <div className="p-2.5">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">{isHindi ? "आवंटित तारीख व समय" : "Allotted Window"}</span>
              <strong className="text-slate-900 dark:text-slate-100">{formatDate(booking.slotDate)} ({formatTimeSlot(booking.slotTime)})</strong>
            </div>

            <div className="p-2.5">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">{isHindi ? "अनुमानित प्रतीक्षा" : "Est. Wait Duration"}</span>
              <strong className="text-[#15803D] font-bold">{booking.estimatedWaitMinutes} {t("common.min")}</strong>
            </div>
          </div>
        </div>

        {/* Security Barcode & QR Verification Block */}
        <div className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0E1620] rounded-xs flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#003366] dark:text-white uppercase tracking-wider block">
              {isHindi ? "गेट 1 स्वचालित सुरक्षा स्कैनर" : "Gate 1 Automated Security Scanner"}
            </span>
            <p className="text-[10px] text-slate-500">
              {isHindi ? "मंडी प्रवेश द्वार पर बारकोड स्कैनर अथवा RFID रीडर से सत्यापित कराएं।" : "Present this QR/Barcode at Gate 1 automatic barrier reader."}
            </p>
            <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 tracking-widest bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded-2xs inline-block">
              *MP-IND-2026-A135-SEC*
            </div>
          </div>
          <div className="w-16 h-16 bg-white p-1 border border-[#CBD5E1] rounded-xs flex items-center justify-center shrink-0">
            <QrCode className="w-12 h-12 text-[#003366]" />
          </div>
        </div>

        {/* Mandatory Instructions & Officer Signature */}
        <div className="p-3 bg-[#FFFBEB] dark:bg-[#201505] border border-[#FDE68A] text-xs text-[#92400E] dark:text-[#FCD34D] rounded-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#B45309]" />
            <span>{isHindi ? "मंडी गेट पर अनिवार्य निर्देश" : "Mandatory Mandi Gate Instructions"}</span>
          </div>
          <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-700 dark:text-slate-300">
            <li>{isHindi ? "मूल आधार कार्ड एवं बैंक पासबुक (DBT खाता) साथ लाएं।" : "Carry original Aadhaar Card and Bank Passbook (DBT account)."}</li>
            <li>{isHindi ? "गेहूं में नमी 12% से कम एवं कचरा/विजातीय तत्व 1% से कम होना अनिवार्य है।" : "Wheat moisture must be ≤12% and dockage ≤1% as per FAQ standard."}</li>
          </ul>
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-700">
          <span className="text-[10px] text-slate-400 font-mono">
            {isHindi ? "कंप्यूटर जनरेटेड पावती • हस्ताक्षर की आवश्यकता नहीं" : "Computer Generated • Form APMC-IV"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              {t("common.close")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={handlePrint}
            >
              {isHindi ? "गेट पास प्रिंट करें" : "Print Gate Pass"}
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
import React from "react";
import { Modal } from "../common/Modal";
import { FarmerBooking } from "../../types";
import { formatQuintals } from "../../utils/calculations";
import { useLanguage } from "../../i18n";
import { QrCode, Printer, ShieldCheck } from "lucide-react";
import { Button } from "../common/Button";

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isHindi ? "डिजिटल मंडी गेट पास एवं टोकन" : "Digital Mandi Gate Pass & Token"}
      subtitle={isHindi ? "आधिकारिक कृषि उपार्जन प्रवेश प्राधिकार" : "Official Agricultural Procurement Entry Authorization"}
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-[#123D2D] text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#58A66B]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#58A66B]">
            {isHindi ? "मध्य प्रदेश शासन • खाद्य एवं नागरिक आपूर्ति विभाग" : "Govt of Madhya Pradesh • Food & Civil Supplies"}
          </span>
          <h3 className="text-3xl font-extrabold font-sans tabular-nums tracking-wider mt-1 text-white">
            #{booking.tokenNumber}
          </h3>
          <p className="text-xs text-white/80 mt-0.5">
            {t("farmer.bookingId")}: <span className="font-mono text-[#58A66B]">{booking.id}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] text-xs">
          <div>
            <span className="text-[#66736B] block text-[11px]">{isHindi ? "किसान का नाम" : "Farmer Name"}</span>
            <strong className="text-[#17211B] text-sm">{isHindi ? "राजेश शर्मा" : booking.farmerName}</strong>
          </div>
          <div>
            <span className="text-[#66736B] block text-[11px]">{isHindi ? "पंजीकरण आईडी" : "Farmer Registration ID"}</span>
            <strong className="text-[#17211B] font-mono">{booking.farmerId}</strong>
          </div>
          <div>
            <span className="text-[#66736B] block text-[11px]">{isHindi ? "फसल एवं किस्म" : "Crop & Variety"}</span>
            <strong className="text-[#17211B]">{formatCrop(booking.crop)} ({booking.variety})</strong>
          </div>
          <div>
            <span className="text-[#66736B] block text-[11px]">{isHindi ? "घोषित मात्रा" : "Declared Quantity"}</span>
            <strong className="text-[#2F7D4A] text-sm font-bold">{formatQuintals(booking.quantityQuintals)}</strong>
          </div>
          <div className="col-span-2 pt-2 border-t border-[#E4E9E5]">
            <span className="text-[#66736B] block text-[11px]">{isHindi ? "आवंटित खरीदी केंद्र" : "Designated Mandi Centre"}</span>
            <strong className="text-[#17211B]">{formatLocation(booking.centreName)}</strong>
          </div>
          <div>
            <span className="text-[#66736B] block text-[11px]">{isHindi ? "तारीख एवं समय" : "Slot Date & Time"}</span>
            <strong className="text-[#17211B]">{formatDate(booking.slotDate)} ({formatTimeSlot(booking.slotTime)})</strong>
          </div>
          <div>
            <span className="text-[#66736B] block text-[11px]">{t("farmer.estWaiting")}</span>
            <strong className="text-[#2F7D4A] font-semibold">{booking.estimatedWaitMinutes} {t("common.min")}</strong>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-[#E4E9E5] bg-white">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#17211B] block">
              {isHindi ? "सुरक्षा सत्यापन बारकोड" : "Security Verification Barcode"}
            </span>
            <p className="text-[10px] text-[#66736B]">
              {isHindi ? "स्वचालित बैरियर निकासी के लिए गेट 1 स्कैनर पर दिखाएँ।" : "Scan at Gate 1 Reader for automated barrier clearance."}
            </p>
            <div className="font-mono text-xs text-[#66736B] tracking-widest bg-[#F6F8F4] px-2 py-1 rounded inline-block">
              ||| | |||| ||| ||||||| | ||
            </div>
          </div>
          <div className="w-16 h-16 bg-[#F6F8F4] rounded-lg flex items-center justify-center border border-[#E4E9E5]">
            <QrCode className="w-12 h-12 text-[#17211B]" />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30 text-xs text-[#123D2D]">
          <h5 className="font-bold flex items-center gap-1.5 text-[#123D2D] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#2F7D4A]" />
            {isHindi ? "मंडी गेट पर आवश्यक दस्तावेज़" : "Mandatory Documents at Mandi Gate"}
          </h5>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#123D2D]/90">
            <li>{isHindi ? "मूल आधार कार्ड अथवा मतदाता पहचान पत्र" : "Original Aadhaar Card or Voter ID"}</li>
            <li>{isHindi ? "जमीन खसरा / बी1 ऋण पुस्तिका प्रति" : "Land Khasra / B1 Rin Pustika copy"}</li>
            <li>{isHindi ? "बैंक पासबुक (SBI खाता संख्या 4092)" : "Bank Passbook (SBI Account ending 4092)"}</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("common.close")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            {t("farmer.printGateSlip")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
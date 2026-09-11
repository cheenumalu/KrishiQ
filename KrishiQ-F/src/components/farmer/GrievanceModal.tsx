import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { AlertCircle, Send } from "lucide-react";

interface GrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingToken?: string;
}

export const GrievanceModal: React.FC<GrievanceModalProps> = ({
  isOpen,
  onClose,
  bookingToken,
}) => {
  const { raiseGrievance } = useKrishiQ();
  const { isHindi } = useLanguage();
  const [reason, setReason] = useState("Moisture meter calibration query");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const REASONS = [
    { value: "Moisture meter calibration query", labelEn: "Moisture Sensor / Assay Dispute", labelHi: "नमी मापक / ग्रेडिंग पर आपत्ति" },
    { value: "Weighbridge Tare Difference", labelEn: "Weighbridge Tare / Weight Discrepancy", labelHi: "तौल कांटा / वजन विसंगति" },
    { value: "Queue Delay / Bypassing", labelEn: "Queue Delay or Turn Skipping", labelHi: "कतार में अनावश्यक देरी" },
    { value: "DBT Payment Delay", labelEn: "PFMS / DBT Bank Transfer Inquiry", labelHi: "बैंक खाते में भुगतान सम्बन्धी पूछताछ" },
    { value: "Other Operational Issue", labelEn: "Other Mandi Issue", labelHi: "अन्य मंडी शिकायत" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsSubmitting(true);
    try {
      await raiseGrievance(reason, description);
      setDescription("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[#F2A93B]" />
          <span>{isHindi ? "शिकायत / विवाद निवारण प्रपत्र" : "Raise Grievance / Dispute"}</span>
        </div>
      }
      subtitle={
        bookingToken
          ? (isHindi ? `टोकन संख्या: ${bookingToken}` : `Related Token: ${bookingToken}`)
          : (isHindi ? "मंडी इनचार्ज को त्वरित सूचना भेजें" : "Direct escalation to Centre Supervisor")
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-[#17211B] dark:text-[#F0F5F1] mb-1.5">
            {isHindi ? "शिकायत का विषय (Category)" : "Dispute Category"}
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-[#E4E9E5] dark:border-[#23362B] bg-white dark:bg-[#101B15] text-[#17211B] dark:text-[#F0F5F1] font-medium"
          >
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {isHindi ? r.labelHi : r.labelEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#17211B] dark:text-[#F0F5F1] mb-1.5">
            {isHindi ? "विस्तृत विवरण (Description)" : "Provide details for the Supervisor"}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            placeholder={
              isHindi
                ? "कृपया अपनी समस्या का विवरण लिखें (उदा. कांटा पर्ची संख्या या नमी परीक्षण समय)..."
                : "Describe your issue clearly (e.g. weighbridge slip number or assay re-test request)..."
            }
            className="w-full p-2.5 rounded-lg border border-[#E4E9E5] dark:border-[#23362B] bg-white dark:bg-[#101B15] text-[#17211B] dark:text-[#F0F5F1]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4E9E5] dark:border-[#23362B]">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            {isHindi ? "रद्द करें" : "Cancel"}
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={isSubmitting}
            leftIcon={<Send className="w-4 h-4" />}
          >
            {isSubmitting
              ? (isHindi ? "दर्ज हो रहा है..." : "Submitting...")
              : (isHindi ? "शिकायत दर्ज करें" : "Submit Grievance")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

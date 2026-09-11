import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { History, ShieldCheck, User, Clock, ArrowRight, FileText } from "lucide-react";

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingToken?: string;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  bookingToken,
}) => {
  const { auditLogs } = useKrishiQ();
  const { isHindi } = useLanguage();

  const filteredLogs = bookingToken
    ? auditLogs.filter((l) => !l.token_code || l.token_code === bookingToken)
    : auditLogs;

  const formatEventType = (type: string) => {
    switch (type) {
      case "booking_created":
        return isHindi ? "स्लॉट आरक्षण पंजीकृत" : "Slot Booking Registered";
      case "stage_changed":
        return isHindi ? "उपार्जन चरण बदला" : "Procurement Stage Advanced";
      case "quality_updated":
        return isHindi ? "गुणवत्ता परीक्षण प्रमाणित" : "Quality Assay Certified";
      case "weight_updated":
        return isHindi ? "इलेक्ट्रॉनिक वजन दर्ज" : "Electronic Weighing Recorded";
      case "payment_initiated":
        return isHindi ? "PFMS भुगतान आरंभ" : "PFMS Payment Initiated";
      case "payment_completed":
        return isHindi ? "DBT भुगतान पूर्ण" : "DBT Settlement Completed";
      case "grievance_created":
        return isHindi ? "शिकायत/विवाद दर्ज" : "Dispute / Grievance Filed";
      case "grievance_resolved":
        return isHindi ? "शिकायत का समाधान" : "Grievance Resolved";
      default:
        return type.replace(/_/g, " ");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#2F7D4A]" />
          <span>{isHindi ? "डिजिटल ऑडिट ट्रेल एवं पारदर्शिता लॉग" : "Digital Audit Trail & Transparency Log"}</span>
        </div>
      }
      subtitle={
        bookingToken
          ? (isHindi ? `टोकन ${bookingToken} का अपरिवर्तनीय इतिहास` : `Immutable event trail for Token ${bookingToken}`)
          : (isHindi ? "सिस्टम के सभी उपार्जन एवं भुगतान इवेंट्स" : "All procurement, assay & payment events")
      }
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-[#EEF5EF] dark:bg-[#1A3125] border border-[#58A66B]/30 rounded-xl flex items-center gap-2 text-[#123D2D] dark:text-[#52DB89]">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#2F7D4A]" />
          <span>
            {isHindi
              ? "यह ऑडिट ट्रेल अपरिवर्तनीय (Append-only) है तथा SIH26032 पारदर्शिता मानकों के अनुरूप है।"
              : "This append-only audit trail guarantees end-to-end transparency under SIH26032 specifications."}
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-[#8A958E]">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>{isHindi ? "कोई ऑडिट रिकॉर्ड उपलब्ध नहीं है।" : "No audit events recorded yet."}</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E4E9E5] dark:before:bg-[#23362B]">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative group">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white dark:bg-[#142019] border-2 border-[#2F7D4A] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2F7D4A]" />
                </div>

                <div className="bg-[#F6F8F4] dark:bg-[#101B15] p-3 rounded-xl border border-[#E4E9E5] dark:border-[#23362B] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#17211B] dark:text-[#F0F5F1] text-sm">
                      {formatEventType(log.event_type)}
                    </span>
                    <span className="text-[10px] text-[#8A958E] flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[#66736B] dark:text-[#9EAEA4] text-[11px]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#2F7D4A]" />
                      <strong>{log.actor}</strong> ({log.actor_role})
                    </span>
                    {log.token_code && (
                      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#142019] border border-[#E4E9E5] dark:border-[#23362B] font-mono font-bold text-[#123D2D] dark:text-[#52DB89]">
                        {log.token_code}
                      </span>
                    )}
                  </div>

                  {(log.previous_value || log.new_value) && (
                    <div className="pt-1 flex items-center gap-2 text-[11px]">
                      {log.previous_value && (
                        <span className="text-[#8A958E] line-through">{log.previous_value}</span>
                      )}
                      {log.previous_value && <ArrowRight className="w-3 h-3 text-[#8A958E]" />}
                      <span className="font-semibold text-[#2F7D4A] dark:text-[#52DB89]">
                        {log.new_value}
                      </span>
                    </div>
                  )}

                  {log.details && (
                    <div className="pt-1.5 text-[10px] font-mono bg-white dark:bg-[#142019] p-2 rounded-lg border border-[#E4E9E5] dark:border-[#23362B] text-[#66736B] dark:text-[#9EAEA4]">
                      {JSON.stringify(log.details)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-[#E4E9E5] dark:border-[#23362B]">
          <Button variant="outline" size="sm" onClick={onClose}>
            {isHindi ? "बंद करें" : "Close"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

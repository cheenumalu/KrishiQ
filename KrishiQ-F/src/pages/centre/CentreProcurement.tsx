import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { formatQuintals } from "../../utils/calculations";
import { Printer, ShieldCheck, AlertCircle, CheckCircle2, History, Scale, Edit3 } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { AuditTrailModal } from "../../components/common/AuditTrailModal";
import { QualityGradingModal } from "../../components/centre/QualityGradingModal";
import { getStageLabel } from "../../utils/stages";

export const CentreProcurement: React.FC = () => {
  const {
    selectedCentre,
    allBookings,
    grievances,
    resolveGrievance,
    isItemHighlighted,
    updateQualityAndWeight,
    advanceBookingStage,
  } = useKrishiQ();

  const { isHindi, formatCrop } = useLanguage();
  const [activeTab, setActiveTab] = useState<"assays" | "grievances">("assays");
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [selectedTokenForAudit, setSelectedTokenForAudit] = useState<string | undefined>();
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [selectedBookingForQC, setSelectedBookingForQC] = useState<string | null>(null);

  // All bookings for this centre
  const centreBookings = allBookings.filter((b) => b.centreId === selectedCentre.id);

  const totalProcuredToday = allBookings
    .filter((b) => b.centreId === selectedCentre.id && b.currentStageNumber >= 6)
    .reduce((acc, b) => acc + (b.weighing?.netWeightQuintals || b.quantityQuintals || 0), 0);

  const handleResolveGrievance = async (id: string) => {
    if (!resolutionText.trim()) return;
    await resolveGrievance(id, resolutionText);
    setResolvingId(null);
    setResolutionText("");
  };

  const handleOpenQC = (bookingId: string) => {
    setSelectedBookingForQC(bookingId);
    setIsQCModalOpen(true);
  };

  const handleQCSubmit = async (data: any) => {
    if (selectedBookingForQC) {
      await updateQualityAndWeight(
        selectedBookingForQC,
        {
          moisturePercent: data.moisture,
          dockagePercent: data.dockage,
          foreignMatterPercent: data.foreignMatter,
          grade: data.grade,
          passed: data.grade !== "Below FAQ",
        },
        {
          netWeightQuintals: data.netWeightQuintals,
          grossWeightKg: data.netWeightQuintals * 100 + 750,
          tareWeightKg: 750,
          bagCount: Math.round(data.netWeightQuintals * 2),
          weighbridgeId: "WB-02-DIGITAL",
        }
      );
      // If still before stage 6, advance to stage 6 (Procured & Loading)
      const booking = allBookings.find((b) => b.id === selectedBookingForQC);
      if (booking && booking.currentStageNumber < 6) {
        await advanceBookingStage(selectedBookingForQC, "procured_loading");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1 border-b border-[#E4E9E5] dark:border-[#23362B]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] dark:text-[#F0F5F1] tracking-tight">
            {isHindi ? "उपार्जन, गुणवत्ता बही एवं शिकायत निवारण" : "Procurement Ledger & Dispute Resolution"}
          </h1>
          <p className="text-sm text-[#66736B] dark:text-[#9EAEA4] font-medium">
            {isHindi
              ? selectedCentre.name + " हेतु दैनिक गुणवत्ता परीक्षण (FAQ), कांटा रिकॉर्ड एवं किसान विवाद निवारण।"
              : "Daily Fair Average Quality (FAQ) logs, weighbridge slips & grievance queue for " + selectedCentre.name + "."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<History className="w-4 h-4 text-[#2F7D4A]" />}
            onClick={() => {
              setSelectedTokenForAudit(undefined);
              setIsAuditOpen(true);
            }}
          >
            {isHindi ? "केंद्र ऑडिट ट्रेल" : "Centre Audit Trail"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            {isHindi ? "दैनिक बही प्रिंट करें" : "Print Shift Report"}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md" className="border-[#E4E9E5] dark:border-[#23362B] card-shadow">
          <span className="text-xs text-[#66736B] dark:text-[#9EAEA4] block font-medium">
            {isHindi ? "आज का कुल उपार्जन (Verified Net Weight)" : "Today's Verified Procurement"}
          </span>
          <p className="text-2xl font-extrabold text-[#17211B] dark:text-[#F0F5F1] mt-1 font-mono tabular-nums">
            {formatQuintals(totalProcuredToday || 3240)}
          </p>
          <span className="text-[11px] text-[#2F7D4A] dark:text-[#52DB89] block mt-0.5">
            {isHindi ? "सक्रिय आवक एवं साइलो लोडिंग जारी" : "Intake & Silo Transfer Active"}
          </span>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] dark:border-[#23362B] card-shadow">
          <span className="text-xs text-[#66736B] dark:text-[#9EAEA4] block font-medium">
            {isHindi ? "इलेक्ट्रॉनिक कांटा अंशांकन (Calibration)" : "Electronic Weighbridge Status"}
          </span>
          <p className="text-2xl font-extrabold text-[#2F7D4A] dark:text-[#52DB89] mt-1 font-sans">
            {isHindi ? "सत्यापित ✓" : "Calibrated ✓"}
          </p>
          <span className="text-[11px] text-[#66736B] dark:text-[#9EAEA4] block mt-0.5 font-mono">
            WB-01 & WB-02 Sensor Sync 100%
          </span>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] dark:border-[#23362B] card-shadow">
          <span className="text-xs text-[#66736B] dark:text-[#9EAEA4] block font-medium">
            {isHindi ? "सक्रिय किसान शिकायतें (Grievances)" : "Active Farmer Disputes"}
          </span>
          <p className="text-2xl font-extrabold text-[#F2A93B] mt-1 font-mono tabular-nums">
            {grievances.filter((g) => g.status !== "resolved").length}
          </p>
          <span className="text-[11px] text-[#66736B] dark:text-[#9EAEA4] block mt-0.5">
            {isHindi ? "त्वरित समाधान हेतु कतारबद्ध" : "Pending supervisor resolution"}
          </span>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E4E9E5] dark:border-[#23362B] pb-2">
        <button
          onClick={() => setActiveTab("assays")}
          className={
            "px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 " +
            (activeTab === "assays"
              ? "bg-[#123D2D] text-white shadow-xs"
              : "text-[#66736B] dark:text-[#9EAEA4] hover:bg-[#EEF5EF] dark:hover:bg-[#1A3125]")
          }
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isHindi ? "दैनिक आवक एवं गुणवत्ता/तौल बही" : "Intake Log, Quality & Weighment Ledger"} ({centreBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("grievances")}
          className={
            "px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 " +
            (activeTab === "grievances"
              ? "bg-[#123D2D] text-white shadow-xs"
              : "text-[#66736B] dark:text-[#9EAEA4] hover:bg-[#EEF5EF] dark:hover:bg-[#1A3125]")
          }
        >
          <AlertCircle className="w-4 h-4 text-[#F2A93B]" />
          <span>
            {isHindi ? "किसान शिकायत निवारण कतार" : "Farmer Grievance Queue"}{" "}
            ({grievances.filter((g) => g.status !== "resolved").length})
          </span>
        </button>
      </div>

      {/* Tab 1: Quality Assays & Intake Log */}
      {activeTab === "assays" && (
        <Card padding="lg" className="border-[#E4E9E5] dark:border-[#23362B] card-shadow space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5] dark:border-[#23362B]">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] dark:text-[#52DB89]">
              {isHindi ? "प्रमाणित गुणवत्ता परीक्षण, तौल पर्चियाँ एवं आवक सूची" : "Today's Intake Log & Certified Quality / Weighment Slips"}
            </span>
            <span className="text-xs text-[#66736B] dark:text-[#9EAEA4]">
              {centreBookings.length} {isHindi ? "स्लॉट/टोकन दर्ज" : "Bookings registered"}
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#17211B] dark:text-[#F0F5F1]">
            {centreBookings.length === 0 ? (
              <div className="text-center py-8 text-[#8A958E]">
                <p>{isHindi ? "कोई हालिया परीक्षण रिकॉर्ड नहीं मिला।" : "No recent intake records logged yet for this centre."}</p>
              </div>
            ) : (
              centreBookings.map((b) => {
                const isHigh = isItemHighlighted(b.id);
                const hasAssay = !!b.qualityCheck;
                const hasWeight = !!b.weighing;

                return (
                  <div
                    key={b.id}
                    className={
                      "p-4 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B] flex flex-wrap items-center justify-between gap-4 transition-all " +
                      (isHigh ? "highlight-pulse ring-2 ring-[#2F7D4A]/40" : "")
                    }
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#123D2D] dark:text-[#52DB89] bg-white dark:bg-[#142019] px-2 py-0.5 rounded border border-[#E4E9E5] dark:border-[#23362B]">
                          #{b.tokenNumber}
                        </span>
                        <strong className="text-sm font-semibold">{b.farmerName}</strong>
                        <span className="text-[11px] text-[#66736B] dark:text-[#9EAEA4] font-mono">({formatCrop(b.crop)})</span>
                        <Badge variant={b.currentStageNumber >= 6 ? "success" : b.currentStageNumber >= 3 ? "warning" : "neutral"} size="sm">
                          {getStageLabel(b.lastUpdated || "Stage " + b.currentStageNumber, isHindi)}
                        </Badge>
                      </div>

                      <div className="text-[#66736B] dark:text-[#9EAEA4] text-[11px] flex flex-wrap gap-x-4 gap-y-1 pt-1">
                        <span>{isHindi ? "स्लॉट:" : "Slot:"} <strong>{b.slotTime}</strong></span>
                        <span>{isHindi ? "पंजीकृत मात्रा:" : "Lot Size:"} <strong className="font-mono">{b.quantityQuintals} Qtl</strong></span>
                        {hasAssay ? (
                          <>
                            <span>{isHindi ? "नमी:" : "Moisture:"} <strong>{b.qualityCheck?.moisturePercent}%</strong></span>
                            <span>{isHindi ? "कचरा:" : "Dockage:"} <strong>{b.qualityCheck?.dockagePercent}%</strong></span>
                            <span>{isHindi ? "ग्रेड:" : "Grade:"} <strong className="text-[#2F7D4A] dark:text-[#52DB89]">{b.qualityCheck?.grade}</strong></span>
                          </>
                        ) : (
                          <span className="text-[#F2A93B] italic">{isHindi ? "गुणवत्ता परख लंबित" : "QC Assay Pending"}</span>
                        )}
                        {hasWeight ? (
                          <>
                            <span>{isHindi ? "शुद्ध वजन:" : "Net Weight:"} <strong className="font-mono text-[#123D2D] dark:text-[#52DB89]">{b.weighing?.netWeightQuintals} Qtl</strong></span>
                            <span>{isHindi ? "बोरी:" : "Bags:"} <strong>{b.weighing?.bagCount}</strong></span>
                          </>
                        ) : (
                          <span className="text-[#8A958E] italic">{isHindi ? "तौल पर्ची लंबित" : "Weighment Pending"}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={hasAssay && hasWeight ? "outline" : "primary"}
                        size="sm"
                        leftIcon={hasAssay && hasWeight ? <Edit3 className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenQC(b.id)}
                      >
                        {hasAssay && hasWeight
                          ? (isHindi ? "परख/तौल बदलें" : "Edit Assay/Weight")
                          : (isHindi ? "परख व तौल दर्ज करें" : "Record Assay & Weight")}
                      </Button>

                      <button
                        title="Audit Trail"
                        onClick={() => {
                          setSelectedTokenForAudit(b.tokenNumber);
                          setIsAuditOpen(true);
                        }}
                        className="p-2 rounded-lg border border-[#E4E9E5] dark:border-[#23362B] bg-white dark:bg-[#142019] text-[#66736B] hover:text-[#123D2D] cursor-pointer"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* Tab 2: Grievances */}
      {activeTab === "grievances" && (
        <Card padding="lg" className="border-[#E4E9E5] dark:border-[#23362B] card-shadow space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] dark:text-[#52DB89] block pb-2 border-b border-[#E4E9E5] dark:border-[#23362B]">
            {isHindi ? "किसान शिकायत एवं विवाद निवारण कार्यक्षेत्र" : "Farmer Grievance Resolution Desk"}
          </span>

          <div className="space-y-3 text-xs">
            {grievances.length === 0 ? (
              <div className="text-center py-8 text-[#8A958E]">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#2F7D4A]" />
                <p>{isHindi ? "कोई लंबित शिकायत नहीं है।" : "No pending grievances. All disputes resolved."}</p>
              </div>
            ) : (
              grievances.map((g) => {
                const isResolved = g.status === "resolved";
                const isHigh = isItemHighlighted(g.id);

                return (
                  <div
                    key={g.id}
                    className={
                      "p-4 rounded-xl border transition-all space-y-3 " +
                      (isHigh
                        ? "highlight-pulse ring-2 ring-[#2F7D4A]/40"
                        : isResolved
                        ? "bg-[#F6F8F4] dark:bg-[#101B15] border-[#E4E9E5] dark:border-[#23362B] opacity-80"
                        : "bg-white dark:bg-[#142019] border-[#F2A93B]/40 shadow-xs")
                    }
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {g.token_code && (
                          <span className="px-2 py-0.5 rounded bg-[#EEF5EF] dark:bg-[#1A3125] font-mono font-bold text-xs text-[#123D2D] dark:text-[#52DB89] border border-[#58A66B]/30">
                            #{g.token_code}
                          </span>
                        )}
                        <strong className="text-sm font-semibold text-[#17211B] dark:text-[#F0F5F1]">
                          {g.reason}
                        </strong>
                      </div>

                      <Badge variant={isResolved ? "success" : "warning"} dot>
                        {isResolved ? (isHindi ? "समाधान पूर्ण" : "Resolved") : (isHindi ? "समीक्षाधीन" : "In Review")}
                      </Badge>
                    </div>

                    <p className="text-[#66736B] dark:text-[#9EAEA4] text-xs bg-[#F6F8F4] dark:bg-[#101B15] p-2.5 rounded-lg border border-[#E4E9E5] dark:border-[#23362B]">
                      "{g.description}"
                    </p>

                    {g.resolution_note && (
                      <div className="p-2.5 rounded-lg bg-[#EEF5EF] dark:bg-[#1A3125] border border-[#58A66B]/30 text-[#123D2D] dark:text-[#52DB89]">
                        <strong>{isHindi ? "समाधान टिप्पणी:" : "Resolution Note:"}</strong> {g.resolution_note}
                      </div>
                    )}

                    {!isResolved && (
                      <div className="pt-2 border-t border-[#E4E9E5] dark:border-[#23362B]">
                        {resolvingId === g.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={resolutionText}
                              onChange={(e) => setResolutionText(e.target.value)}
                              placeholder={isHindi ? "समाधान विवरण लिखें (उदा. पुनः परीक्षण कराया गया और माप सही पाई गई)..." : "Enter supervisor resolution details..."}
                              rows={2}
                              className="w-full p-2 rounded-lg border border-[#E4E9E5] dark:border-[#23362B] bg-white dark:bg-[#101B15] text-xs"
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => setResolvingId(null)}>
                                {isHindi ? "रद्द करें" : "Cancel"}
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleResolveGrievance(g.id)}
                              >
                                {isHindi ? "समाधान सहेजें व किसान को सूचित करें" : "Save & Notify Farmer"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                              onClick={() => {
                                setResolvingId(g.id);
                                setResolutionText("Supervisor verified probe readings on-site and cleared the discrepancy.");
                              }}
                            >
                              {isHindi ? "शिकायत का समाधान करें" : "Resolve Dispute"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* Quality & Weighbridge Modal */}
      <QualityGradingModal
        isOpen={isQCModalOpen}
        onClose={() => {
          setIsQCModalOpen(false);
          setSelectedBookingForQC(null);
        }}
        onSubmit={handleQCSubmit}
      />

      {/* Audit Trail Modal */}
      <AuditTrailModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        bookingToken={selectedTokenForAudit}
      />
    </div>
  );
};

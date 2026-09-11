import React from "react";
import { QueueItem } from "../../types";
import { formatQuintals } from "../../utils/calculations";
import { useLanguage } from "../../i18n";
import { useKrishiQ } from "../../context/KrishiQContext";
import { Play, Clock, ShieldCheck, History, ArrowRight } from "lucide-react";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";

interface OperatorQueueRowProps {
  item: QueueItem;
  onStartProcessing: (id: string) => void;
  onOpenQCModal: (id: string) => void;
  onAdvanceStage: (id: string) => void;
  onOpenAudit: (token: string) => void;
}

export const OperatorQueueRow: React.FC<OperatorQueueRowProps> = ({
  item,
  onStartProcessing,
  onOpenQCModal,
  onAdvanceStage,
  onOpenAudit,
}) => {
  const { isItemHighlighted } = useKrishiQ();
  const { t, isHindi, formatLocation, formatCrop } = useLanguage();
  
  const isServing = item.status === "SERVING";
  const isCompleted = item.status === "COMPLETED";
  const isWaiting = item.status === "WAITING";
  const isHighlighted = isItemHighlighted(item.id);

  const stageNumber = item.stageNumber || 1;

  return (
    <tr
      className={`border-b border-[#E4E9E5] dark:border-[#23362B] hover:bg-[#F6F8F4] dark:hover:bg-[#18281F] transition-all text-xs ${
        isHighlighted
          ? "highlight-pulse bg-emerald-50/80 dark:bg-emerald-950/40"
          : isServing
          ? "bg-[#FEF5E7]/70 dark:bg-[#2A2315]/70"
          : isCompleted
          ? "bg-[#F6F8F4]/50 dark:bg-[#101B15]/50 opacity-80"
          : ""
      }`}
    >
      {/* Token */}
      <td className="py-3.5 px-4 font-bold text-[#17211B] dark:text-[#F0F5F1]">
        <div className="flex items-center gap-2">
          <span
            className={
              "px-2.5 py-1 min-w-[50px] h-7 rounded-lg inline-flex items-center justify-center text-xs font-mono font-bold tabular-nums tracking-wide " +
              (isServing
                ? "bg-[#F2A93B] text-white shadow-xs"
                : isCompleted
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                : "bg-[#EEF5EF] dark:bg-[#183928] text-[#123D2D] dark:text-[#52DB89] border border-[#58A66B]/20")
            }
          >
            {item.tokenNumber}
          </span>
          {item.isCurrentUser && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold">
              Demo User
            </span>
          )}
        </div>
      </td>

      {/* Farmer Name & Village */}
      <td className="py-3.5 px-4">
        <div className="font-semibold text-[#17211B] dark:text-[#F0F5F1]">{item.farmerName}</div>
        <div className="text-[11px] text-[#8A958E] font-sans">
          {formatLocation(item.village)}
        </div>
      </td>

      {/* Crop & Quantity */}
      <td className="py-3.5 px-4">
        <div className="font-bold text-[#17211B] dark:text-[#F0F5F1] font-mono tabular-nums">
          {formatQuintals(item.quantityQuintals)}
        </div>
        <div className="text-[11px] text-[#66736B] dark:text-[#9EAEA4]">{formatCrop(item.crop)}</div>
      </td>

      {/* Current Procurement Stage */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5 font-bold text-[#123D2D] dark:text-[#52DB89]">
          <span className="w-4 h-4 rounded-full bg-[#EEF5EF] dark:bg-[#1A3125] border border-[#58A66B]/40 inline-flex items-center justify-center text-[10px] font-mono">
            {stageNumber}
          </span>
          <span>{item.stageName}</span>
        </div>
        <div className="text-[10px] text-[#8A958E] flex items-center gap-1 mt-0.5 font-mono">
          <Clock className="w-3 h-3" />
          <span>Slot: {item.arrivedTime}</span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="py-3.5 px-4">
        {isServing && <Badge variant="warning" dot>{isHindi ? "प्रक्रियाधीन" : "In Progress"}</Badge>}
        {isCompleted && <Badge variant="success" dot>{isHindi ? "उपार्जन पूर्ण" : "Completed"}</Badge>}
        {isWaiting && <Badge variant="info" dot>{isHindi ? "प्रतीक्षा में" : "In Queue"}</Badge>}
      </td>

      {/* Processing Time */}
      <td className="py-3.5 px-4 font-mono tabular-nums text-[#66736B] dark:text-[#9EAEA4]">
        {isCompleted ? "0 min" : `~${item.estimatedProcessingMinutes} ${t("common.min")}`}
      </td>

      {/* Operator Action Buttons */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* Stage Progression Triggers */}
          {stageNumber < 3 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Play className="w-3.5 h-3.5 text-[#2F7D4A]" />}
              onClick={() => onStartProcessing(item.id)}
            >
              {isHindi ? "गेट आवक सत्यापन" : "Verify Gate"}
            </Button>
          )}

          {stageNumber >= 3 && stageNumber <= 5 && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
              onClick={() => onOpenQCModal(item.id)}
            >
              {isHindi ? "गुणवत्ता व तौल दर्ज करें" : "Quality & Weigh"}
            </Button>
          )}

          {stageNumber >= 6 && stageNumber < 8 && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => onAdvanceStage(item.id)}
            >
              {isHindi ? "भुगतान अग्रसारित करें" : "Advance Stage"}
            </Button>
          )}

          {isCompleted && (
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800">
              {isHindi ? "प्रमाणित ✓" : "Cleared ✓"}
            </span>
          )}

          <button
            title="View Audit Trail"
            onClick={() => onOpenAudit(item.tokenNumber)}
            className="p-1.5 rounded-lg text-[#66736B] hover:text-[#123D2D] hover:bg-[#EEF5EF] dark:hover:bg-[#1E372A] transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

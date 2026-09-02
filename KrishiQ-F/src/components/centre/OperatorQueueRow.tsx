import React from "react";
import { QueueItem } from "../../types";
import { formatQuintals } from "../../utils/calculations";
import { useLanguage } from "../../i18n";
import { CheckCircle, Play, Clock } from "lucide-react";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";

interface OperatorQueueRowProps {
  item: QueueItem;
  onCallNext: (id: string) => void;
  onStartProcessing: (id: string) => void;
  onCompleteProcessing: (id: string) => void;
}

export const OperatorQueueRow: React.FC<OperatorQueueRowProps> = ({
  item,
  onStartProcessing,
  onCompleteProcessing,
}) => {
  const { t, isHindi, formatLocation, formatCrop } = useLanguage();
  const isServing = item.status === "SERVING";
  const isCompleted = item.status === "COMPLETED";
  const isWaiting = item.status === "WAITING";

  return (
    <tr
      className={
        "border-b border-[#E4E9E5] hover:bg-[#F6F8F4] transition-colors text-xs " +
        (isServing ? "bg-[#FEF5E7]/70" : isCompleted ? "bg-[#F6F8F4]/50 opacity-70" : "")
      }
    >
      {/* Token */}
      <td className="py-3 px-4 font-sans font-bold text-[#17211B]">
        <div className="flex items-center gap-2">
          <span
            className={
              "px-3 py-1.5 min-w-[50px] h-8 rounded-lg inline-flex items-center justify-center text-xs font-bold font-sans tabular-nums tracking-wide " +
              (isServing
                ? "bg-[#F2A93B] text-white shadow-xs"
                : isCompleted
                ? "bg-[#E4E9E5] dark:bg-[#203026] text-[#66736B] dark:text-[#9AAEA2]"
                : "bg-[#EEF5EF] dark:bg-[#183928] text-[#123D2D] dark:text-[#52DB89] border border-[#58A66B]/20")
            }
          >
            {item.tokenNumber.replace("A-", "")}
          </span>
          <span className="font-semibold text-[#17211B] dark:text-[#F0F5F1]">{item.tokenNumber}</span>
        </div>
      </td>

      {/* Farmer Name & Village */}
      <td className="py-3 px-4">
        <div className="font-semibold text-[#17211B]">{item.farmerName}</div>
        <div className="text-[11px] text-[#8A958E] font-sans">{item.farmerId} • {formatLocation(item.village)}</div>
      </td>

      {/* Crop & Quantity */}
      <td className="py-3 px-4">
        <div className="font-bold text-[#17211B] font-sans tabular-nums">{formatQuintals(item.quantityQuintals)}</div>
        <div className="text-[11px] text-[#66736B]">{formatCrop(item.crop)}</div>
      </td>

      {/* Arrival & Stage */}
      <td className="py-3 px-4">
        <div className="font-semibold text-[#17211B]">
          {isHindi
            ? item.stageName === "Registration" ? "पंजीकरण"
            : item.stageName === "Quality Check" ? "गुणवत्ता जाँच"
            : item.stageName === "Weighing" ? "तौल"
            : "उपार्जन"
            : item.stageName}
        </div>
        <div className="text-[10px] text-[#8A958E] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{item.arrivedTime}</span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="py-3 px-4">
        {isServing && <Badge variant="warning" dot>{isHindi ? "प्रक्रिया में" : "Processing"}</Badge>}
        {isCompleted && <Badge variant="success" dot>{isHindi ? "पूर्ण" : "Completed"}</Badge>}
        {isWaiting && <Badge variant="info" dot>{isHindi ? "कतार में" : "In Queue"}</Badge>}
      </td>

      {/* Processing Time */}
      <td className="py-3 px-4 font-sans tabular-nums text-[#66736B]">
        {isCompleted ? "0 min" : item.estimatedProcessingMinutes + " " + t("common.min")}
      </td>

      {/* Operator Action Buttons */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {isWaiting && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Play className="w-3.5 h-3.5 text-[#2F7D4A]" />}
              onClick={() => onStartProcessing(item.id)}
            >
              {isHindi ? "आवक शुरू करें" : "Start Intake"}
            </Button>
          )}

          {isServing && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
              onClick={() => onCompleteProcessing(item.id)}
            >
              {isHindi ? "पूर्ण करें व आगे बढ़ाएँ" : "Complete & Pass"}
            </Button>
          )}

          {isCompleted && (
            <span className="text-[11px] font-semibold text-[#2F7D4A] bg-[#EEF5EF] px-2 py-1 rounded-lg border border-[#58A66B]/20">
              {isHindi ? "सत्यापित ✓" : "Verified ✓"}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};
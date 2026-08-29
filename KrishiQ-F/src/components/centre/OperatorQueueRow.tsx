import React from "react";
import { QueueItem } from "../../types";
import { formatQuintals } from "../../utils/calculations";
import { CheckCircle, Play, PhoneCall, AlertCircle, Clock } from "lucide-react";
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
  onCallNext,
  onStartProcessing,
  onCompleteProcessing,
}) => {
  const isServing = item.status === "SERVING";
  const isCompleted = item.status === "COMPLETED";
  const isWaiting = item.status === "WAITING";

  return (
    <tr
      className={
        "border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-xs " +
        (isServing ? "bg-amber-50/60" : isCompleted ? "bg-slate-50/40 opacity-70" : "")
      }
    >
      {/* Token */}
      <td className="py-3 px-4 font-mono font-bold text-slate-900">
        <div className="flex items-center gap-1.5">
          <span
            className={
              "w-7 h-7 rounded-lg flex items-center justify-center text-xs " +
              (isServing
                ? "bg-amber-600 text-white font-bold animate-pulse"
                : isCompleted
                ? "bg-slate-200 text-slate-600"
                : "bg-emerald-100 text-emerald-900 font-bold")
            }
          >
            {item.tokenNumber.replace("A-", "")}
          </span>
          <span className="font-semibold text-slate-800">{item.tokenNumber}</span>
        </div>
      </td>

      {/* Farmer Name & Village */}
      <td className="py-3 px-4">
        <div className="font-semibold text-slate-900">{item.farmerName}</div>
        <div className="text-[11px] text-slate-400 font-mono">{item.farmerId} � {item.village}</div>
      </td>

      {/* Crop & Quantity */}
      <td className="py-3 px-4">
        <div className="font-bold text-slate-800">{formatQuintals(item.quantityQuintals)}</div>
        <div className="text-[11px] text-slate-500">{item.crop}</div>
      </td>

      {/* Arrival & Stage */}
      <td className="py-3 px-4">
        <div className="font-semibold text-slate-800">{item.stageName}</div>
        <div className="text-[10px] text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{item.arrivedTime}</span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="py-3 px-4">
        {isServing && <Badge variant="warning" dot>Processing</Badge>}
        {isCompleted && <Badge variant="success" dot>Completed</Badge>}
        {isWaiting && <Badge variant="info" dot>In Queue</Badge>}
      </td>

      {/* Processing Time */}
      <td className="py-3 px-4 font-mono text-slate-600">
        {isCompleted ? "0 min" : item.estimatedProcessingMinutes + " min"}
      </td>

      {/* Operator Action Buttons */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {isWaiting && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Play className="w-3.5 h-3.5 text-emerald-700" />}
              onClick={() => onStartProcessing(item.id)}
            >
              Start Intake
            </Button>
          )}

          {isServing && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
              onClick={() => onCompleteProcessing(item.id)}
            >
              Complete & Pass
            </Button>
          )}

          {isCompleted && (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              Verified ?
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};
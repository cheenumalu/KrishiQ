import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export const BottleneckAlertCard: React.FC = () => {
  const { selectedCentre, resolveBottleneck } = useKrishiQ();
  const bottleneck = selectedCentre.bottlenecks?.[0];

  if (!bottleneck) return null;

  return (
    <Card padding="md" className="border-amber-300 bg-amber-50/50 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-800 text-white uppercase">
            WARNING � BOTTLENECK DETECTED
          </span>
          <span className="text-xs font-bold text-amber-950 uppercase">
            Location: Weighing Station
          </span>
        </div>
        <span className="text-xs text-amber-800 font-semibold font-mono">
          18 farmers waiting
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
        <div>
          <span>Average processing time: <strong>11 minutes</strong></span>
        </div>
        <div>
          <span>Recommended action: <strong>Shift one available operator to weighing.</strong></span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1 border-t border-amber-200">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => resolveBottleneck(selectedCentre.id)}
        >
          View Recommendation
        </Button>
      </div>
    </Card>
  );
};
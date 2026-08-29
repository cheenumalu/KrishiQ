import React from "react";
import { Link } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export const CentreRecommendationCard: React.FC = () => {
  const { centres, setSelectedCentreId } = useKrishiQ();
  const recommendedCentre = centres.find((c) => c.isRecommended) || centres[0];

  return (
    <Card padding="lg" className="border-slate-300 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
            RECOMMENDED PROCUREMENT CENTRE
          </span>
          <Badge variant="normal">RECOMMENDED</Badge>
        </div>
        <span className="text-xs text-slate-500 font-medium">Saves ~2h 28m waiting time</span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {recommendedCentre.name.split(" (")[0]}
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Distance: <strong className="text-slate-900">{recommendedCentre.distanceKm} km away</strong> � {recommendedCentre.district}
        </p>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
        <div>
          <span className="text-slate-500 block text-[11px]">Distance</span>
          <strong className="text-slate-900 font-mono text-sm block mt-0.5">{recommendedCentre.distanceKm} km</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Current Queue</span>
          <strong className="text-slate-900 font-mono text-sm block mt-0.5">{recommendedCentre.currentQueueCount} farmers</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Predicted Wait</span>
          <strong className="text-emerald-800 font-mono text-sm font-bold block mt-0.5">{recommendedCentre.predictedWaitMinutes} minutes</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Centre Capacity</span>
          <strong className="text-slate-900 font-mono text-sm block mt-0.5">{recommendedCentre.utilizationPercent}% (Optimal)</strong>
        </div>
      </div>

      {/* Rationale */}
      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
        "Recommended because it is expected to save approximately 2 hours compared with Centre A."
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-200">
        <Link to="/farmer/centres">
          <Button variant="outline" size="md">
            View Centre
          </Button>
        </Link>
        <Link to="/farmer/book-slot">
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => setSelectedCentreId("centre-b")}
          >
            Book Slot
          </Button>
        </Link>
      </div>

    </Card>
  );
};
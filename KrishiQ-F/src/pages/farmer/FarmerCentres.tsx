import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { CropType } from "../../types";
import {
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  Compass
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

interface MapCentreData {
  id: string;
  name: string;
  shortName: string;
  distanceKm: number;
  travelMinutes: number;
  currentQueue: number;
  capacityPercent: number;
  predictedWaitMinutes: number;
  predictedWaitFormatted: string;
  totalJourneyFormatted: string;
  availableSlotsCount: number;
  status: "normal" | "warning" | "critical";
  isRecommended: boolean;
  pos: { x: number; y: number };
  address: string;
  activeCounters: number;
}

export const FarmerCentres: React.FC = () => {
  const { farmerBooking, setSelectedCentreId } = useKrishiQ();
  const navigate = useNavigate();

  const [selectedCrop, setSelectedCrop] = useState<CropType>("Wheat");
  const [selectedDate, setSelectedDate] = useState("Today, 29 Aug");
  const [maxDistance, setMaxDistance] = useState<number>(25);
  const [maxWaitFilter, setMaxWaitFilter] = useState<"any" | "45m" | "90m">("any");
  const [sortBy, setSortBy] = useState<"recommended" | "distance" | "wait">("recommended");
  const [activeCentreId, setActiveCentreId] = useState<string>("centre-b");
  const [search, setSearch] = useState("");

  const centresList: MapCentreData[] = [
    {
      id: "centre-b",
      name: "Shivaji Nagar Procurement Centre (Centre B)",
      shortName: "Centre B (Shivaji Nagar)",
      distanceKm: 7.2,
      travelMinutes: 22,
      currentQueue: 31,
      capacityPercent: 58,
      predictedWaitMinutes: 42,
      predictedWaitFormatted: "42m",
      totalJourneyFormatted: "1h 17m",
      availableSlotsCount: 14,
      status: "normal",
      isRecommended: true,
      pos: { x: 58, y: 38 },
      address: "Sector 4, Shivaji Nagar Mandi Yard, Depalpur Road, Indore",
      activeCounters: 6,
    },
    {
      id: "centre-a",
      name: "Dhar Road Regional Mandi (Centre A)",
      shortName: "Centre A (Dhar Road)",
      distanceKm: 4.2,
      travelMinutes: 12,
      currentQueue: 128,
      capacityPercent: 95,
      predictedWaitMinutes: 190,
      predictedWaitFormatted: "3h 10m",
      totalJourneyFormatted: "3h 30m",
      availableSlotsCount: 2,
      status: "critical",
      isRecommended: false,
      pos: { x: 38, y: 62 },
      address: "Mhow-Neemuch State Highway, Dhar Road Sector 2",
      activeCounters: 3,
    },
    {
      id: "centre-c",
      name: "Sanwer Hub Grain Terminal (Centre C)",
      shortName: "Centre C (Sanwer Hub)",
      distanceKm: 14.8,
      travelMinutes: 42,
      currentQueue: 19,
      capacityPercent: 52,
      predictedWaitMinutes: 28,
      predictedWaitFormatted: "28m",
      totalJourneyFormatted: "1h 22m",
      availableSlotsCount: 18,
      status: "normal",
      isRecommended: false,
      pos: { x: 78, y: 22 },
      address: "Sanwer Bypass Road, Industrial Mandi Zone",
      activeCounters: 5,
    },
    {
      id: "centre-d",
      name: "Depalpur Farmers Cooperative (Centre D)",
      shortName: "Centre D (Depalpur)",
      distanceKm: 18.5,
      travelMinutes: 52,
      currentQueue: 44,
      capacityPercent: 88,
      predictedWaitMinutes: 68,
      predictedWaitFormatted: "1h 08m",
      totalJourneyFormatted: "2h 12m",
      availableSlotsCount: 6,
      status: "warning",
      isRecommended: false,
      pos: { x: 22, y: 28 },
      address: "Depalpur Sub-Division APMC Yard, Western Corridor",
      activeCounters: 4,
    },
  ];

  const filteredCentres = centresList
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.shortName.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase());
      const matchesDistance = c.distanceKm <= maxDistance;
      const matchesWait =
        maxWaitFilter === "any" ||
        (maxWaitFilter === "45m" && c.predictedWaitMinutes <= 45) ||
        (maxWaitFilter === "90m" && c.predictedWaitMinutes <= 90);
      return matchesSearch && matchesDistance && matchesWait;
    })
    .sort((a, b) => {
      if (sortBy === "recommended") return (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0);
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      if (sortBy === "wait") return a.predictedWaitMinutes - b.predictedWaitMinutes;
      return 0;
    });

  const handleBookAtCentre = (centreId: string) => {
    setSelectedCentreId(centreId);
    navigate("/farmer/book-slot");
  };

  const activeCentre = centresList.find((c) => c.id === activeCentreId) || centresList[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      
      {/* Official Header */}
      <div className="space-y-0.5 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Find Procurement Centre
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          We recommend the procurement centre that minimizes your total journey time (travel + queue wait).
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 5 Cols: Basic Map & Filters */}
        <div className="lg:col-span-5 space-y-4">
          
          <Card padding="none" className="border-slate-300 overflow-hidden">
            <div className="p-3 bg-slate-800 text-white flex items-center justify-between text-xs font-semibold">
              <span>Regional Procurement Map</span>
              <span className="text-[11px] text-slate-300">Indore District Grid</span>
            </div>

            <div className="relative h-72 sm:h-80 bg-slate-900 overflow-hidden select-none border-b border-slate-700">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="45%" y1="50%" x2="58%" y2="38%" stroke="#10b981" strokeWidth="2" strokeDasharray="3" />
                <line x1="45%" y1="50%" x2="38%" y2="62%" stroke="#ef4444" strokeWidth="1.5" />
                <line x1="45%" y1="50%" x2="78%" y2="22%" stroke="#94a3b8" strokeWidth="1" />
                <line x1="45%" y1="50%" x2="22%" y2="28%" stroke="#f59e0b" strokeWidth="1" />
              </svg>

              {/* Farmer Pin */}
              <div className="absolute left-[45%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                  ??
                </div>
                <span className="mt-0.5 px-1.5 py-0.2 rounded bg-black/80 text-white text-[9px] font-bold">
                  Your Farm
                </span>
              </div>

              {/* Markers */}
              {centresList.map((centre) => {
                const isSelected = activeCentreId === centre.id;
                const isRec = centre.isRecommended;

                return (
                  <div
                    key={centre.id}
                    onClick={() => setActiveCentreId(centre.id)}
                    style={{ left: centre.pos.x + "%", top: centre.pos.y + "%" }}
                    className={
                      "absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center cursor-pointer transition-transform " +
                      (isSelected ? "scale-110" : "hover:scale-105")
                    }
                  >
                    {isRec && (
                      <span className="mb-0.5 px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-emerald-500 text-slate-950 uppercase">
                        RECOMMENDED
                      </span>
                    )}

                    <div
                      className={
                        "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white border-2 border-white " +
                        (centre.status === "critical"
                          ? "bg-red-700"
                          : centre.status === "warning"
                          ? "bg-amber-600"
                          : "bg-emerald-700") +
                        (isSelected ? " ring-2 ring-white" : "")
                      }
                    >
                      {centre.shortName.charAt(7)}
                    </div>

                    <div className="mt-0.5 px-1.5 py-0.2 rounded bg-black/80 text-white text-[9px] font-medium text-center whitespace-nowrap">
                      <span>{centre.shortName.split(" (")[0]}</span>
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-2 left-2 right-2 bg-black/70 p-1.5 rounded text-[10px] text-slate-300 flex justify-between">
                <span>Click marker to select</span>
                <span className="text-emerald-400 font-bold">{activeCentre.shortName}</span>
              </div>
            </div>
          </Card>

          {/* Simple Filters */}
          <Card padding="md" className="border-slate-300 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900 uppercase">Filters</span>
              <button
                onClick={() => { setMaxDistance(25); setMaxWaitFilter("any"); setSortBy("recommended"); setSearch(""); }}
                className="text-[11px] text-emerald-800 font-semibold hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Crop</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                  className="w-full p-2 rounded border border-slate-300 bg-white text-slate-800 font-semibold"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Paddy">Paddy</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Date</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 bg-white text-slate-800 font-semibold"
                >
                  <option value="Today, 29 Aug">29 Aug (Today)</option>
                  <option value="Tomorrow, 30 Aug">30 Aug (Tomorrow)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 font-medium">Max Distance:</span>
                <strong className="font-mono text-slate-900">{maxDistance} km</strong>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
            </div>
          </Card>

        </div>

        {/* Right 7 Cols: Centre List & Comparisons */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-300">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">Sort:</span>
              <button
                onClick={() => setSortBy("recommended")}
                className={"px-2.5 py-1 rounded font-semibold transition-colors " + (sortBy === "recommended" ? "bg-emerald-800 text-white" : "text-slate-700 hover:bg-slate-100")}
              >
                Recommended
              </button>
              <button
                onClick={() => setSortBy("distance")}
                className={"px-2.5 py-1 rounded font-semibold transition-colors " + (sortBy === "distance" ? "bg-emerald-800 text-white" : "text-slate-700 hover:bg-slate-100")}
              >
                Nearest
              </button>
              <button
                onClick={() => setSortBy("wait")}
                className={"px-2.5 py-1 rounded font-semibold transition-colors " + (sortBy === "wait" ? "bg-emerald-800 text-white" : "text-slate-700 hover:bg-slate-100")}
              >
                Shortest Wait
              </button>
            </div>

            <div className="relative w-full sm:w-44">
              <input
                type="text"
                placeholder="Search Mandi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-3 pr-3 py-1 text-xs rounded border border-slate-300 bg-white text-slate-800"
              />
            </div>
          </div>

          {/* List of Centres */}
          <div className="space-y-3">
            {filteredCentres.map((centre) => {
              const isRec = centre.isRecommended;
              const isCrit = centre.status === "critical";

              return (
                <Card
                  key={centre.id}
                  padding="md"
                  className={
                    "border transition-colors " +
                    (isRec
                      ? "border-emerald-700 bg-emerald-50/30 ring-1 ring-emerald-700/20"
                      : isCrit
                      ? "border-red-300 bg-red-50/20"
                      : "border-slate-300 bg-white")
                  }
                  onClick={() => setActiveCentreId(centre.id)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{centre.name}</h3>
                        {isRec && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-800 text-white">
                            RECOMMENDED
                          </span>
                        )}
                        {isCrit && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                            CONGESTED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{centre.address}</p>
                    </div>
                  </div>

                  {/* 4 Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-xs text-center">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Distance</span>
                      <strong className="text-slate-900 font-mono">{centre.distanceKm} km</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Current Queue</span>
                      <strong className="text-slate-900 font-mono">{centre.currentQueue} farmers</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Predicted Wait</span>
                      <strong className={isRec ? "text-emerald-800 font-bold font-mono" : "text-slate-900 font-mono"}>
                        {centre.predictedWaitFormatted}
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Available Slots</span>
                      <strong className="text-slate-900 font-mono">{centre.availableSlotsCount} open</strong>
                    </div>
                  </div>

                  {/* Rationale Comparison Line */}
                  {isRec && (
                    <div className="p-2.5 rounded bg-emerald-100/70 border border-emerald-200 text-xs text-emerald-950 font-medium">
                      "Expected total journey time: 1h 17m (2h 13m faster than Centre A)"
                    </div>
                  )}

                  {isCrit && (
                    <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-900">
                      High gate queue reported. Rerouting to Centre B recommended.
                    </div>
                  )}

                  <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-end">
                    <Button
                      variant={isRec ? "primary" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookAtCentre(centre.id);
                      }}
                    >
                      Book Slot
                    </Button>
                  </div>

                </Card>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
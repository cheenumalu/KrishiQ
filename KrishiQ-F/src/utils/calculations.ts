import { ProcurementCentre, SimulationParams, SimulationResult } from "../types";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumberIndian = (num: number): string => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export const formatQuintals = (qtl: number): string => {
  return String(qtl.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 })) + " Qtl";
};

export const STAGES_LIST = [
  { stageNumber: 1, key: "REGISTERED", name: "Farmer Registered", shortDesc: "Verified Land & Aadhaar", icon: "UserCheck" },
  { stageNumber: 2, key: "SLOT_BOOKED", name: "Slot Booked", shortDesc: "Intelligent Time Window Allocated", icon: "CalendarCheck" },
  { stageNumber: 3, key: "ARRIVED", name: "Arrived at Mandi", shortDesc: "Gate Token Verification", icon: "MapPin" },
  { stageNumber: 4, key: "QUALITY_CHECK", name: "Quality & Moisture Check", shortDesc: "Assayed for FAQ Standards", icon: "CheckCircle2" },
  { stageNumber: 5, key: "WEIGHING", name: "Electronic Weighbridge", shortDesc: "Certified Gross & Tare Weight", icon: "Scale" },
  { stageNumber: 6, key: "PROCURED", name: "Procured & Handed Over", shortDesc: "Lot Passed to Govt Depot", icon: "PackageCheck" },
  { stageNumber: 7, key: "PAYMENT_INITIATED", name: "Payment Initiated", shortDesc: "PFMS / DBT Direct Transfer", icon: "CreditCard" },
  { stageNumber: 8, key: "PAYMENT_COMPLETED", name: "Payment Credited", shortDesc: "Funds in Bank Account", icon: "BadgeCheck" },
];

export const getStageDetails = (stageNumber: number) => {
  return STAGES_LIST.find((s) => s.stageNumber === stageNumber) || STAGES_LIST[0];
};

/**
 * Intelligent simulation engine for Admin What-If Analysis
 */
export const runWhatIfSimulation = (
  params: SimulationParams,
  centre: ProcurementCentre
): SimulationResult => {
  const baseArrivalsPerHour = 32;
  const baseCounters = centre.activeCounters || 4;
  const counterThroughputPerHour = 7.5; // farmers per counter per hour
  
  const additionalFarmers = params.additionalFarmers;
  const extraCounters = Math.max(0, params.activeCounters - baseCounters);
  const totalCounters = Math.max(1, params.activeCounters);
  const extraStaff = params.qualityStaff;
  const extendedHours = params.extendedHours;

  // Unmitigated calculation (if surge happens with baseline capacity)
  const baselineCapacity = baseCounters * counterThroughputPerHour;
  const totalSurgeVolume = baseArrivalsPerHour * 8 + additionalFarmers;
  const unmitigatedWaitTime = Math.round(
    centre.predictedWaitMinutes + (additionalFarmers / baselineCapacity) * 16
  );
  const unmitigatedUtilization = Math.round(
    Math.min(220, ((totalSurgeVolume) / (baselineCapacity * 8)) * 100)
  );

  // Mitigated calculation with new parameters
  const qualityMultiplier = 1 + (extraStaff - 2) * 0.15; // staff boosts throughput
  const simulatedCapacityPerHour = totalCounters * counterThroughputPerHour * Math.max(0.7, qualityMultiplier);
  const effectiveOperatingHours = 8 + extendedHours;
  const totalSimulatedCapacity = simulatedCapacityPerHour * effectiveOperatingHours;

  const simulatedUtilization = Math.round(
    Math.min(180, (totalSurgeVolume / totalSimulatedCapacity) * 100)
  );

  // Simulated average wait time
  const waitReduction = (extraCounters * 18) + (extraStaff * 8) + (extendedHours * 6);
  const rawWaitTime = unmitigatedWaitTime - waitReduction;
  const simulatedWaitTime = Math.max(18, Math.round(rawWaitTime));

  const congestionIndex = Math.min(100, Math.round((simulatedUtilization / 140) * 100));

  // Determine critical bottleneck
  let bottleneckStage = "None (Smooth Clearance)";
  if (totalCounters < 4) {
    bottleneckStage = "Weighbridge Congestion (Severe)";
  } else if (extraStaff < 3 && additionalFarmers > 80) {
    bottleneckStage = "Moisture & QC Desk (Queue Spillover)";
  } else if (extendedHours === 0 && additionalFarmers > 150) {
    bottleneckStage = "Gate Inflow / Evening Cutoff Limit";
  }

  // Recommended policy directives
  const policyDirectives: string[] = [];
  if (additionalFarmers > 100 && totalCounters < 6) {
    policyDirectives.push("Deploy +" + Math.ceil(additionalFarmers / 60) + " Auxiliary Weighbridge Counters immediately.");
  }
  if (extraStaff < 4 && additionalFarmers > 50) {
    policyDirectives.push("Reallocate 2 QA technicians from Zonal Office to accelerate Moisture Testing.");
  }
  if (extendedHours < 2 && unmitigatedUtilization > 115) {
    policyDirectives.push("Extend operating window by at least 2 hours to avoid overnight farmer holdovers.");
  }
  if (additionalFarmers > 150) {
    policyDirectives.push("Trigger AI Rerouting alert to redirect 30% of incoming farmers to nearby Sanwer Grain Terminal (Centre C).");
  }
  if (policyDirectives.length === 0) {
    policyDirectives.push("Operating parameters are optimal for projected volume. Maintain current shifts.");
  }

  // Generate hourly queue curve
  const hours = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
  const hourlyFlow = hours.map((hour, idx) => {
    const surgeDistribution = [0.05, 0.12, 0.18, 0.16, 0.10, 0.08, 0.12, 0.10, 0.06, 0.03];
    const baseHourArrival = Math.round(24 + surgeDistribution[idx] * additionalFarmers);
    const normalCap = Math.round(baselineCapacity);
    const simCap = Math.round(simulatedCapacityPerHour);
    
    const unmitigatedQueue = Math.max(0, Math.round(baseHourArrival * 1.4 - normalCap * 0.7 + idx * 4));
    const simulatedQueue = Math.max(0, Math.round(baseHourArrival - simCap * 0.9 + (idx > 4 ? -idx * 2 : 2)));

    return {
      hour,
      arrivals: baseHourArrival,
      normalThroughput: normalCap,
      simulatedThroughput: simCap,
      unmitigatedQueue,
      simulatedQueue: Math.max(3, simulatedQueue),
    };
  });

  return {
    baseWaitTime: centre.predictedWaitMinutes,
    unmitigatedWaitTime,
    simulatedWaitTime,
    unmitigatedUtilization,
    simulatedUtilization,
    congestionIndex,
    bottleneckStage,
    policyDirectives,
    hourlyFlow,
  };
};
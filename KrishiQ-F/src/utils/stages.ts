export type ProcurementStage =
  | "slot_booked"
  | "in_transit"
  | "gate_verification"
  | "quality_inspection"
  | "electronic_weighing"
  | "procured_loading"
  | "payment_initiated"
  | "payment_completed";

export interface StageDefinition {
  key: ProcurementStage;
  number: number;
  label: string;
  hindiLabel: string;
  description: string;
  stationName: string;
}

export const PROCUREMENT_STAGES: StageDefinition[] = [
  {
    key: "slot_booked",
    number: 1,
    label: "Slot Booked",
    hindiLabel: "स्लॉट बुक हुआ",
    description: "Slot reserved, awaiting arrival at centre",
    stationName: "Online Portal",
  },
  {
    key: "in_transit",
    number: 2,
    label: "In Transit",
    hindiLabel: "मार्ग में (मंडी आगमन)",
    description: "Farmer travelling towards Mandi gate",
    stationName: "En Route",
  },
  {
    key: "gate_verification",
    number: 3,
    label: "Gate Verification",
    hindiLabel: "गेट सत्यापन",
    description: "Token check, Aadhaar ID verification and vehicle pass",
    stationName: "Intake Gate #1",
  },
  {
    key: "quality_inspection",
    number: 4,
    label: "Quality Inspection",
    hindiLabel: "गुणवत्ता परीक्षण",
    description: "Moisture test, dockage check, FAQ grading",
    stationName: "QC Lab #2",
  },
  {
    key: "electronic_weighing",
    number: 5,
    label: "Electronic Weighing",
    hindiLabel: "इलेक्ट्रॉनिक तौल",
    description: "Certified gross & tare weighbridge measurement",
    stationName: "Weighbridge #1",
  },
  {
    key: "procured_loading",
    number: 6,
    label: "Procured & Loading",
    hindiLabel: "उपार्जन एवं लोडिंग",
    description: "Silo storage stacking, bag tagging, receipt generated",
    stationName: "Silo Yard 4",
  },
  {
    key: "payment_initiated",
    number: 7,
    label: "Payment Initiated",
    hindiLabel: "भुगतान आरंभ",
    description: "DBT transfer queued with PFMS portal",
    stationName: "DBT Finance Cell",
  },
  {
    key: "payment_completed",
    number: 8,
    label: "Payment Completed",
    hindiLabel: "भुगतान पूर्ण",
    description: "MSP funds credited to farmer bank account (UTR confirmed)",
    stationName: "Direct Bank Transfer",
  },
];

export const STAGE_ORDER: ProcurementStage[] = PROCUREMENT_STAGES.map((s) => s.key);

export const getStageDefinition = (stage: ProcurementStage | string): StageDefinition => {
  const found = PROCUREMENT_STAGES.find((s) => s.key === stage);
  return found || PROCUREMENT_STAGES[0];
};

export const getStageNumber = (stage: ProcurementStage | string | number): number => {
  if (typeof stage === "number") return Math.max(1, Math.min(8, stage));
  const def = getStageDefinition(stage);
  return def.number;
};

export const getStageFromNumber = (num: number): ProcurementStage => {
  const clamped = Math.max(1, Math.min(8, num));
  return PROCUREMENT_STAGES[clamped - 1].key;
};

export const getStageLabel = (stage: ProcurementStage | string, isHindi = false): string => {
  const def = getStageDefinition(stage);
  return isHindi ? def.hindiLabel : def.label;
};

export const getStageProgressPercent = (stage: ProcurementStage | string | number): number => {
  const num = getStageNumber(stage);
  return Math.round(((num - 1) / 7) * 100);
};

export const getNextStage = (current: ProcurementStage | string): ProcurementStage | null => {
  const num = getStageNumber(current);
  if (num >= 8) return null;
  return PROCUREMENT_STAGES[num].key;
};

export const isStagePassed = (current: ProcurementStage | string, check: ProcurementStage | string): boolean => {
  return getStageNumber(current) >= getStageNumber(check);
};

export const getStageStatusColor = (stage: ProcurementStage | string) => {
  const num = getStageNumber(stage);
  if (num === 8) {
    return {
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      dot: "bg-emerald-500",
      text: "text-emerald-700 dark:text-emerald-400",
    };
  }
  if (num >= 3) {
    return {
      bg: "bg-[#EEF5EF] text-[#123D2D] border-[#58A66B]/30 dark:bg-[#1A3125] dark:text-[#52DB89] dark:border-[#52DB89]/30",
      dot: "bg-[#2F7D4A] dark:bg-[#52DB89]",
      text: "text-[#2F7D4A] dark:text-[#52DB89]",
    };
  }
  return {
    bg: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
  };
};

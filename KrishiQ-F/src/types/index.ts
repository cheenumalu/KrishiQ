export type UserRole = "farmer" | "centre" | "admin";

export type CropType = "Wheat" | "Paddy" | "Soybean" | "Maize" | "Cotton" | "Mustard";

export type CentreStatus = "normal" | "warning" | "critical";

export interface BottleneckInfo {
  stage: string;
  count: number;
  recommendation: string;
  severity: "warning" | "critical";
  counterSuggestion?: string;
}

export interface ProcurementCentre {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  distanceKm: number;
  activeCounters: number;
  totalCapacityPerDay: number;
  currentQueueCount: number;
  predictedWaitMinutes: number;
  historicalWaitMinutes: number;
  status: CentreStatus;
  utilizationPercent: number;
  operatingHours: string;
  todayProcuredQuintals: number;
  isRecommended?: boolean;
  recommendationReason?: string;
  timeSavedMinutes?: number;
  bottlenecks?: BottleneckInfo[];
}

export interface QualityInspection {
  moisturePercent: number;
  dockagePercent: number;
  foreignMatterPercent: number;
  grade: "Grade A" | "FAQ (Fair Average Quality)" | "Grade B";
  passed: boolean;
  inspectedBy: string;
  inspectedAt: string;
}

export interface WeighingSlip {
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightQuintals: number;
  bagCount: number;
  weighbridgeId: string;
  weighedAt: string;
}

export interface PaymentRecord {
  mspRatePerQuintal: number;
  grossAmount: number;
  mandiFeeDeduction: number;
  netPayableAmount: number;
  bankName: string;
  accountEnding: string;
  ifscPrefix: string;
  pfmsReferenceId: string;
  utrNumber: string;
  paymentInitiatedDate: string;
  paymentExpectedDate: string;
  paymentCompletedDate?: string;
  status: "COMPLETED" | "INITIATED" | "PENDING";
}

export interface FarmerBooking {
  id: string;
  tokenNumber: string;
  farmerName: string;
  farmerId: string;
  phone: string;
  village: string;
  district: string;
  crop: CropType;
  variety: string;
  quantityQuintals: number;
  centreId: string;
  centreName: string;
  centreDistanceKm: number;
  slotDate: string;
  slotTime: string;
  queuePosition: number;
  currentStageNumber: number; // 1 to 8
  estimatedWaitMinutes: number;
  estimatedServiceTime: string;
  lastUpdated: string;
  qualityCheck?: QualityInspection;
  weighing?: WeighingSlip;
  payment?: PaymentRecord;
}

export interface QueueItem {
  id: string;
  tokenNumber: string;
  farmerName: string;
  farmerId: string;
  village: string;
  crop: CropType;
  quantityQuintals: number;
  stageName: string;
  stageNumber: number;
  status: "COMPLETED" | "SERVING" | "WAITING" | "NO_SHOW";
  isCurrentUser?: boolean;
  arrivedTime: string;
  assignedCounter?: string;
  estimatedProcessingMinutes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "critical";
  read: boolean;
  actionUrl?: string;
}

export interface SimulationParams {
  additionalFarmers: number;
  activeCounters: number;
  qualityStaff: number;
  extendedHours: number;
  targetCentreId: string;
}

export interface SimulationResult {
  baseWaitTime: number;
  unmitigatedWaitTime: number;
  simulatedWaitTime: number;
  unmitigatedUtilization: number;
  simulatedUtilization: number;
  congestionIndex: number;
  bottleneckStage: string;
  policyDirectives: string[];
  hourlyFlow: {
    hour: string;
    arrivals: number;
    normalThroughput: number;
    simulatedThroughput: number;
    unmitigatedQueue: number;
    simulatedQueue: number;
  }[];
}

export interface AuditLogEntry {
  id: string;
  booking_id?: string;
  token_code?: string;
  actor: string;
  actor_role: string;
  event_type: string;
  previous_value?: string;
  new_value?: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface GrievanceItem {
  id: string;
  booking_id?: string;
  farmer_id: string;
  farmer_name?: string;
  token_code?: string;
  reason: string;
  description: string;
  status: "open" | "in_review" | "resolved";
  resolution_note?: string;
  created_at: string;
  resolved_at?: string;
}

export interface StationLog {
  id: string;
  booking_id: string;
  station: string;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  operator_id?: string;
  notes?: string;
}
import { ProcurementCentre, FarmerBooking, QueueItem, NotificationItem, CropType } from "../types";

export const CROP_MSP_RATES: Record<CropType, number> = {
  Wheat: 2275,
  Paddy: 2300,
  Soybean: 4892,
  Maize: 2090,
  Cotton: 7121,
  Mustard: 5650,
};

export const MOCK_CENTRES: ProcurementCentre[] = [
  {
    id: "centre-b",
    name: "Shivaji Nagar Procurement Centre (Centre B)",
    code: "MP-IND-02",
    district: "Indore",
    state: "Madhya Pradesh",
    distanceKm: 7.2,
    activeCounters: 6,
    totalCapacityPerDay: 400,
    currentQueueCount: 31,
    predictedWaitMinutes: 42,
    historicalWaitMinutes: 50,
    status: "normal",
    utilizationPercent: 58,
    operatingHours: "08:00 AM - 06:00 PM",
    todayProcuredQuintals: 3240,
    isRecommended: true,
    recommendationReason: "Centre A is closer, but Centre B is predicted to save you 2h 28m.",
    timeSavedMinutes: 148,
    bottlenecks: [
      {
        stage: "Weighbridge 2",
        count: 8,
        recommendation: "Load balancing active; standard clearance within 15 min.",
        severity: "warning"
      }
    ]
  },
  {
    id: "centre-a",
    name: "Dhar Road Procurement Centre (Centre A)",
    code: "MP-IND-17",
    district: "Indore",
    state: "Madhya Pradesh",
    distanceKm: 4.1,
    activeCounters: 3,
    totalCapacityPerDay: 250,
    currentQueueCount: 86,
    predictedWaitMinutes: 165,
    historicalWaitMinutes: 65,
    status: "critical",
    utilizationPercent: 136,
    operatingHours: "08:00 AM - 06:00 PM",
    todayProcuredQuintals: 2180,
    isRecommended: false,
    recommendationReason: "Heavy bottleneck at weighing station and gate queues. Diverting to Shivaji Nagar saves ~2h 28m.",
    bottlenecks: [
      {
        stage: "Weighing Station & Quality Lab",
        count: 28,
        recommendation: "Shift 2 operators from documentation to weighing. Reroute +45 arrivals to Sanwer Hub.",
        severity: "critical",
        counterSuggestion: "Open Auxiliary Counter #4"
      }
    ]
  },
  {
    id: "centre-c",
    name: "Sanwer Hub Procurement Centre (Centre C)",
    code: "MP-IND-09",
    district: "Indore",
    state: "Madhya Pradesh",
    distanceKm: 14.8,
    activeCounters: 5,
    totalCapacityPerDay: 350,
    currentQueueCount: 19,
    predictedWaitMinutes: 28,
    historicalWaitMinutes: 35,
    status: "normal",
    utilizationPercent: 52,
    operatingHours: "08:30 AM - 05:30 PM",
    todayProcuredQuintals: 1890,
    isRecommended: false,
    bottlenecks: []
  },
  {
    id: "centre-d",
    name: "Depalpur Farmers Cooperative Mandi (Centre D)",
    code: "MP-IND-04",
    district: "Indore",
    state: "Madhya Pradesh",
    distanceKm: 18.5,
    activeCounters: 4,
    totalCapacityPerDay: 280,
    currentQueueCount: 44,
    predictedWaitMinutes: 68,
    historicalWaitMinutes: 55,
    status: "warning",
    utilizationPercent: 88,
    operatingHours: "08:00 AM - 06:00 PM",
    todayProcuredQuintals: 2450,
    isRecommended: false,
    bottlenecks: [
      {
        stage: "Moisture Testing Counter",
        count: 14,
        recommendation: "Deploy digital moisture sensor kit #3 to expedite intake.",
        severity: "warning"
      }
    ]
  },
  {
    id: "centre-e",
    name: "Mhow Sub-Division APMC Yard (Centre E)",
    code: "MP-IND-11",
    district: "Indore",
    state: "Madhya Pradesh",
    distanceKm: 22.1,
    activeCounters: 4,
    totalCapacityPerDay: 260,
    currentQueueCount: 22,
    predictedWaitMinutes: 35,
    historicalWaitMinutes: 40,
    status: "normal",
    utilizationPercent: 58,
    operatingHours: "08:00 AM - 05:00 PM",
    todayProcuredQuintals: 1620,
    isRecommended: false,
    bottlenecks: []
  }
];

export const INITIAL_FARMER_BOOKING: FarmerBooking = {
  id: "BK-2026-9042",
  tokenNumber: "A127",
  farmerName: "Rajesh",
  farmerId: "MP-IND-2026-8841",
  phone: "+91 98260 41289",
  village: "Bilaspur, Depalpur Tehsil",
  district: "Indore",
  crop: "Wheat",
  variety: "Sharbati Wheat (Grade A)",
  quantityQuintals: 65,
  centreId: "centre-b",
  centreName: "Shivaji Nagar Procurement Centre",
  centreDistanceKm: 7.2,
  slotDate: "Today, 29 August 2026",
  slotTime: "11:00 AM - 12:00 PM",
  queuePosition: 8,
  currentStageNumber: 4, // Quality Check
  estimatedWaitMinutes: 35,
  estimatedServiceTime: "11:42 AM",
  lastUpdated: "Updated 30 seconds ago",
  qualityCheck: {
    moisturePercent: 11.4,
    dockagePercent: 0.6,
    foreignMatterPercent: 0.3,
    grade: "Grade A",
    passed: true,
    inspectedBy: "QC Lead Officer",
    inspectedAt: "11:15 AM"
  },
  weighing: {
    grossWeightKg: 8940,
    tareWeightKg: 2440,
    netWeightQuintals: 65.0,
    bagCount: 130,
    weighbridgeId: "WB-02-DIGITAL",
    weighedAt: "Scheduled next"
  },
  payment: {
    mspRatePerQuintal: 2275,
    grossAmount: 147875,
    mandiFeeDeduction: 0,
    netPayableAmount: 147875,
    bankName: "State Bank of India (Indore Branch)",
    accountEnding: "4092",
    ifscPrefix: "SBIN0000382",
    pfmsReferenceId: "PFMS-MP-2026-9920148",
    utrNumber: "UTRIB26241088492",
    paymentInitiatedDate: "29 Aug 2026",
    paymentExpectedDate: "30 Aug 2026",
    status: "INITIATED"
  }
};

export const INITIAL_QUEUE_ITEMS: QueueItem[] = [
  {
    id: "q-121",
    tokenNumber: "A121",
    farmerName: "Harish Patel",
    farmerId: "MP-IND-1049",
    village: "Sanwer",
    crop: "Wheat",
    quantityQuintals: 45,
    stageName: "Payment Completed",
    stageNumber: 8,
    status: "COMPLETED",
    arrivedTime: "08:15 AM",
    assignedCounter: "Counter 1",
    estimatedProcessingMinutes: 0
  },
  {
    id: "q-122",
    tokenNumber: "A122",
    farmerName: "Suresh Chouhan",
    farmerId: "MP-IND-1102",
    village: "Hatod",
    crop: "Wheat",
    quantityQuintals: 80,
    stageName: "Payment Initiated",
    stageNumber: 7,
    status: "COMPLETED",
    arrivedTime: "08:25 AM",
    assignedCounter: "Counter 2",
    estimatedProcessingMinutes: 0
  },
  {
    id: "q-123",
    tokenNumber: "A123",
    farmerName: "Vikram Verma",
    farmerId: "MP-IND-2041",
    village: "Betma",
    crop: "Soybean",
    quantityQuintals: 50,
    stageName: "Procured / Loading",
    stageNumber: 6,
    status: "COMPLETED",
    arrivedTime: "08:45 AM",
    assignedCounter: "Counter 1",
    estimatedProcessingMinutes: 0
  },
  {
    id: "q-124",
    tokenNumber: "A124",
    farmerName: "Rameshwar Gurjar",
    farmerId: "MP-IND-3920",
    village: "Gautampura",
    crop: "Wheat",
    quantityQuintals: 72,
    stageName: "Electronic Weighing",
    stageNumber: 5,
    status: "SERVING",
    arrivedTime: "09:05 AM",
    assignedCounter: "Weighbridge 1",
    estimatedProcessingMinutes: 6
  },
  {
    id: "q-125",
    tokenNumber: "A125",
    farmerName: "Balwant Singh",
    farmerId: "MP-IND-4412",
    village: "Manpur",
    crop: "Wheat",
    quantityQuintals: 60,
    stageName: "Quality Inspection",
    stageNumber: 4,
    status: "WAITING",
    arrivedTime: "09:15 AM",
    assignedCounter: "QC Station A",
    estimatedProcessingMinutes: 12
  },
  {
    id: "q-126",
    tokenNumber: "A126",
    farmerName: "Devendra Rathore",
    farmerId: "MP-IND-5019",
    village: "Sanwer",
    crop: "Maize",
    quantityQuintals: 40,
    stageName: "At Gate Verification",
    stageNumber: 3,
    status: "WAITING",
    arrivedTime: "09:28 AM",
    assignedCounter: "Gate 1",
    estimatedProcessingMinutes: 24
  },
  {
    id: "q-127",
    tokenNumber: "A127",
    farmerName: "Rajesh",
    farmerId: "MP-IND-2026-8841",
    village: "Bilaspur",
    crop: "Wheat",
    quantityQuintals: 65,
    stageName: "Quality Inspection",
    stageNumber: 4,
    status: "WAITING",
    isCurrentUser: true,
    arrivedTime: "09:40 AM",
    assignedCounter: "QC Station B",
    estimatedProcessingMinutes: 35
  },
  {
    id: "q-128",
    tokenNumber: "A128",
    farmerName: "Jagdish Meena",
    farmerId: "MP-IND-6102",
    village: "Kanadia",
    crop: "Paddy",
    quantityQuintals: 55,
    stageName: "In Transit / Arriving",
    stageNumber: 2,
    status: "WAITING",
    arrivedTime: "Expected 10:15 AM",
    estimatedProcessingMinutes: 52
  },
  {
    id: "q-129",
    tokenNumber: "A129",
    farmerName: "Om Prakash Sharma",
    farmerId: "MP-IND-7182",
    village: "Rau",
    crop: "Soybean",
    quantityQuintals: 90,
    stageName: "Slot Booked",
    stageNumber: 2,
    status: "WAITING",
    arrivedTime: "Expected 10:45 AM",
    estimatedProcessingMinutes: 68
  },
  {
    id: "q-130",
    tokenNumber: "A130",
    farmerName: "Kailash Solanki",
    farmerId: "MP-IND-8190",
    village: "Kishanganj",
    crop: "Wheat",
    quantityQuintals: 50,
    stageName: "Slot Booked",
    stageNumber: 2,
    status: "WAITING",
    arrivedTime: "Expected 11:00 AM",
    estimatedProcessingMinutes: 82
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Queue update",
    message: "Your estimated waiting time changed from 42 to 35 minutes.",
    timestamp: "5 mins ago",
    type: "info",
    read: false,
    actionUrl: "/farmer/queue"
  },
  {
    id: "notif-2",
    title: "Slot reminder",
    message: "Your procurement slot begins in 45 minutes.",
    timestamp: "25 mins ago",
    type: "warning",
    read: false,
    actionUrl: "/farmer/dashboard"
  },
  {
    id: "notif-3",
    title: "Procurement update",
    message: "Your quality check has been completed.",
    timestamp: "1 hour ago",
    type: "success",
    read: true,
    actionUrl: "/farmer/procurement"
  }
];

export const HOURLY_ANALYTICS_DATA = [
  { hour: "08:00 AM", arrivals: 18, processed: 12, queueLength: 6, avgWaitMin: 18, capacity: 35 },
  { hour: "09:00 AM", arrivals: 34, processed: 26, queueLength: 14, avgWaitMin: 28, capacity: 35 },
  { hour: "10:00 AM", arrivals: 48, processed: 32, queueLength: 30, avgWaitMin: 42, capacity: 35 },
  { hour: "11:00 AM", arrivals: 42, processed: 35, queueLength: 37, avgWaitMin: 46, capacity: 35 },
  { hour: "12:00 PM", arrivals: 28, processed: 34, queueLength: 31, avgWaitMin: 38, capacity: 35 },
  { hour: "01:00 PM", arrivals: 22, processed: 25, queueLength: 28, avgWaitMin: 32, capacity: 35 },
  { hour: "02:00 PM", arrivals: 36, processed: 30, queueLength: 34, avgWaitMin: 40, capacity: 35 },
  { hour: "03:00 PM", arrivals: 30, processed: 33, queueLength: 31, avgWaitMin: 36, capacity: 35 },
  { hour: "04:00 PM", arrivals: 20, processed: 30, queueLength: 21, avgWaitMin: 25, capacity: 35 },
  { hour: "05:00 PM", arrivals: 12, processed: 24, queueLength: 9, avgWaitMin: 15, capacity: 35 }
];

export const STAGE_CYCLE_TIMES = [
  { name: "Gate Intake", avgMinutes: 4, targetMinutes: 3, bottleneckScore: 12 },
  { name: "Moisture QC", avgMinutes: 9, targetMinutes: 6, bottleneckScore: 48 },
  { name: "Weighbridge", avgMinutes: 14, targetMinutes: 8, bottleneckScore: 78 },
  { name: "Unloading", avgMinutes: 11, targetMinutes: 10, bottleneckScore: 25 },
  { name: "Documentation", avgMinutes: 5, targetMinutes: 5, bottleneckScore: 8 }
];

export const DISTRICT_ADMIN_STATS = {
  activeCentres: 24,
  totalFarmersWaiting: 418,
  todayProcurementQuintals: 48250,
  averageWaitTimeMinutes: 44,
  criticalCentresCount: 2,
  warningCentresCount: 5,
  normalCentresCount: 17,
  totalCapacityDaily: 75000,
  directBenefitTransferPaidToday: 84210000
};
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  UserRole,
  ProcurementCentre,
  FarmerBooking,
  QueueItem,
  NotificationItem,
  SimulationParams,
  CropType,
  AuditLogEntry,
  GrievanceItem,
  QualityInspection,
  WeighingSlip,
} from "../types";
import {
  MOCK_CENTRES,
  MOCK_NOTIFICATIONS,
  CROP_MSP_RATES,
} from "../data/mockData";
import { supabase, isSupabaseConfigured, setupRealtimeSubscription } from "../services/supabase";
import {
  ProcurementStage,
  getStageNumber,
  getStageFromNumber,
} from "../utils/stages";

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  durationMs?: number;
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-1",
    token_code: "A-135",
    actor: "Rajesh Kumar (Farmer)",
    actor_role: "farmer",
    event_type: "booking_created",
    previous_value: undefined,
    new_value: "slot_booked",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    details: { crop: "Wheat", quantity_qtl: 35, centre: "Shivaji Nagar" },
  },
  {
    id: "audit-2",
    token_code: "A-135",
    actor: "Intake Gate Operator",
    actor_role: "centre_operator",
    event_type: "stage_changed",
    previous_value: "slot_booked",
    new_value: "in_transit",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: "audit-3",
    token_code: "A-133",
    actor: "Quality Inspector",
    actor_role: "centre_operator",
    event_type: "quality_updated",
    previous_value: "Pending",
    new_value: "Grade A (Moisture 11.8%)",
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "audit-4",
    token_code: "A-133",
    actor: "Weighbridge Operator",
    actor_role: "centre_operator",
    event_type: "weight_updated",
    previous_value: "0 Qtl",
    new_value: "45.00 Qtl",
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
];

const INITIAL_GRIEVANCES: GrievanceItem[] = [
  {
    id: "grievance-1",
    booking_id: "11111111-1111-1111-1111-111111111111",
    farmer_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    farmer_name: "Rajesh Kumar Patel",
    token_code: "A-135",
    reason: "Moisture meter calibration query",
    description: "Requesting dual sensor check on lot 35 Qtl at Shivaji Nagar gate.",
    status: "in_review",
    resolution_note: "Supervisor assigned to verify handheld probe readings.",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
];

interface KrishiQContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  centres: ProcurementCentre[];
  selectedCentre: ProcurementCentre;
  selectedCentreId: string;
  setSelectedCentreId: (id: string) => void;
  farmerBooking: FarmerBooking;
  farmerBookings: FarmerBooking[];
  activeBookingId: string;
  setActiveBookingId: (id: string) => void;
  allBookings: FarmerBooking[];
  queueItems: QueueItem[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  toasts: ToastMessage[];
  auditLogs: AuditLogEntry[];
  grievances: GrievanceItem[];
  highlightedIds: Record<string, number>;
  isItemHighlighted: (id: string) => boolean;
  triggerHighlight: (id: string) => void;
  isRealtimeConnected: boolean;
  addToast: (title: string, message: string, type?: ToastMessage["type"]) => void;
  removeToast: (id: string) => void;
  bookSlot: (centreId: string, crop: CropType, variety: string, quantityQuintals: number, date: string, time: string) => Promise<string>;
  rescheduleSlot: (newCentreId: string, newDate: string, newTime: string) => void;
  advanceFarmerStage: () => void;
  advanceBookingStage: (bookingId: string, targetStage?: ProcurementStage) => Promise<void>;
  updateQualityAndWeight: (bookingId: string, quality?: Partial<QualityInspection>, weight?: Partial<WeighingSlip>) => Promise<void>;
  simulatePayment: (bookingId: string, targetStatus: "PENDING" | "INITIATED" | "COMPLETED") => Promise<void>;
  raiseGrievance: (reason: string, description: string, bookingId?: string) => Promise<void>;
  resolveGrievance: (grievanceId: string, resolutionNote: string) => Promise<void>;
  callNextFarmer: () => void;
  decrementQueueCount: (centreId?: string) => void;
  startProcessingItem: (id: string) => void;
  completeProcessingItem: (id: string) => void;
  resolveBottleneck: (centreId: string) => void;
  markNotificationAsRead: (id: string) => void;
  toggleNotificationRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetAllData: () => void;
  simParams: SimulationParams;
  setSimParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  currentTimeFormatted: string;
  livePing: number;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const KrishiQContext = createContext<KrishiQContextType | undefined>(undefined);

export const KrishiQProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("farmer");
  const [centres, setCentres] = useState<ProcurementCentre[]>(MOCK_CENTRES);
  const [selectedCentreId, setSelectedCentreId] = useState<string>("centre-b");
  const [activeBookingId, setActiveBookingId] = useState<string>("booking-111");

  const [allBookings, setAllBookings] = useState<FarmerBooking[]>([
    {
      id: "booking-111",
      tokenNumber: "A-135",
      farmerName: "Rajesh Kumar Patel",
      farmerId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      phone: "9876543210",
      village: "Kanadia Village",
      district: "Indore",
      crop: "Wheat",
      variety: "Sharbati Wheat (Grade A)",
      quantityQuintals: 35,
      centreId: "centre-b",
      centreName: "Shivaji Nagar Procurement Centre (Centre B)",
      centreDistanceKm: 7.2,
      slotDate: "Today",
      slotTime: "10:00 AM - 10:30 AM",
      queuePosition: 3,
      currentStageNumber: 3, // gate_verification
      estimatedWaitMinutes: 24,
      estimatedServiceTime: "10:15 AM",
      lastUpdated: "Gate verification active",
      qualityCheck: {
        moisturePercent: 11.4,
        dockagePercent: 0.3,
        foreignMatterPercent: 0.4,
        grade: "Grade A",
        passed: true,
        inspectedBy: "QC Officer R. Sharma",
        inspectedAt: "Today, 10:05 AM",
      },
      weighing: {
        grossWeightKg: 4250,
        tareWeightKg: 750,
        netWeightQuintals: 35,
        bagCount: 70,
        weighbridgeId: "WB-02-DIGITAL",
        weighedAt: "Today, 10:12 AM",
      },
      payment: {
        mspRatePerQuintal: 2275,
        grossAmount: 79625,
        mandiFeeDeduction: 0,
        netPayableAmount: 79625,
        bankName: "State Bank of India",
        accountEnding: "4092",
        ifscPrefix: "SBIN0000382",
        pfmsReferenceId: "PFMS-MP-2026-884102",
        utrNumber: "UTRIB26241088492",
        paymentInitiatedDate: "Today",
        paymentExpectedDate: "Within 24h of intake",
        status: "PENDING",
      },
    },
    {
      id: "booking-222",
      tokenNumber: "A-133",
      farmerName: "Suresh Chandra Verma",
      farmerId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
      phone: "9876543211",
      village: "Sanwer Kalan",
      district: "Indore",
      crop: "Wheat",
      variety: "Malvi Wheat (FAQ)",
      quantityQuintals: 45,
      centreId: "centre-b",
      centreName: "Shivaji Nagar Procurement Centre (Centre B)",
      centreDistanceKm: 7.2,
      slotDate: "Today",
      slotTime: "09:30 AM - 10:00 AM",
      queuePosition: 1,
      currentStageNumber: 5,
      estimatedWaitMinutes: 0,
      estimatedServiceTime: "09:45 AM",
      lastUpdated: "Active at weighbridge",
      qualityCheck: {
        moisturePercent: 11.8,
        dockagePercent: 0.5,
        foreignMatterPercent: 0.6,
        grade: "FAQ (Fair Average Quality)",
        passed: true,
        inspectedBy: "QC Officer R. Sharma",
        inspectedAt: "Today, 09:38 AM",
      },
      weighing: {
        grossWeightKg: 5350,
        tareWeightKg: 850,
        netWeightQuintals: 45,
        bagCount: 90,
        weighbridgeId: "WB-01-DIGITAL",
        weighedAt: "Today, 09:50 AM",
      },
      payment: {
        mspRatePerQuintal: 2275,
        grossAmount: 102375,
        mandiFeeDeduction: 0,
        netPayableAmount: 102375,
        bankName: "Bank of Baroda",
        accountEnding: "8912",
        ifscPrefix: "BARB0INDORE",
        pfmsReferenceId: "PFMS-MP-2026-884103",
        utrNumber: "UTRIB26241088493",
        paymentInitiatedDate: "Today",
        paymentExpectedDate: "Within 24h",
        status: "PENDING",
      },
    },
    {
      id: "booking-333",
      tokenNumber: "A-134",
      farmerName: "Devendra Singh Tomar",
      farmerId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
      phone: "9876543212",
      village: "Rau Gram",
      district: "Indore",
      crop: "Wheat",
      variety: "Lokwan Wheat (Grade A)",
      quantityQuintals: 28,
      centreId: "centre-b",
      centreName: "Shivaji Nagar Procurement Centre (Centre B)",
      centreDistanceKm: 7.2,
      slotDate: "Today",
      slotTime: "09:30 AM - 10:00 AM",
      queuePosition: 2,
      currentStageNumber: 4,
      estimatedWaitMinutes: 12,
      estimatedServiceTime: "10:00 AM",
      lastUpdated: "Assaying sample",
      qualityCheck: {
        moisturePercent: 11.2,
        dockagePercent: 0.2,
        foreignMatterPercent: 0.3,
        grade: "Grade A",
        passed: true,
        inspectedBy: "QC Officer R. Sharma",
        inspectedAt: "Today, 09:42 AM",
      },
      payment: {
        mspRatePerQuintal: 2275,
        grossAmount: 63700,
        mandiFeeDeduction: 0,
        netPayableAmount: 63700,
        bankName: "Punjab National Bank",
        accountEnding: "3341",
        ifscPrefix: "PUNB0124800",
        pfmsReferenceId: "PFMS-MP-2026-884104",
        utrNumber: "UTRIB26241088494",
        paymentInitiatedDate: "Today",
        paymentExpectedDate: "Within 24h",
        status: "PENDING",
      },
    },
  ]);

  // Farmer's bookings list
  const farmerBookings = useMemo(() => {
    return allBookings.filter((b) => b.farmerId === "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
  }, [allBookings]);

  // Current active farmer booking
  const farmerBooking = useMemo<FarmerBooking>(() => {
    const found = allBookings.find((b) => b.id === activeBookingId);
    if (found) return found;
    if (farmerBookings.length > 0) return farmerBookings[0];
    return allBookings[0];
  }, [allBookings, activeBookingId, farmerBookings]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [grievances, setGrievances] = useState<GrievanceItem[]>(INITIAL_GRIEVANCES);
  const [highlightedIds, setHighlightedIds] = useState<Record<string, number>>({});
  const [isRealtimeConnected, setIsRealtimeConnected] = useState<boolean>(false);
  const [livePing, setLivePing] = useState<number>(0);

  const [simParams, setSimParams] = useState<SimulationParams>({
    additionalFarmers: 120,
    activeCounters: 4,
    qualityStaff: 3,
    extendedHours: 1,
    targetCentreId: "centre-a",
  });

  const triggerHighlight = useCallback((id: string) => {
    setHighlightedIds((prev) => ({ ...prev, [id]: Date.now() }));
    setTimeout(() => {
      setHighlightedIds((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 850);
  }, []);

  const isItemHighlighted = useCallback((id: string) => {
    return Boolean(highlightedIds[id]);
  }, [highlightedIds]);

  const addToast = useCallback((title: string, message: string, type: ToastMessage["type"] = "info") => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured() || !client) {
      return;
    }

    setIsRealtimeConnected(true);

    const fetchInitialData = async () => {
      try {
        const { data: centresData } = await client.from("centres").select("*");
        if (centresData && centresData.length > 0) {
          setCentres((prev) =>
            prev.map((c) => {
              const matched = centresData.find((sc) => sc.id === c.id || sc.code === c.code);
              return matched
                ? {
                    ...c,
                    name: matched.name,
                    status: matched.status,
                    totalCapacityPerDay: matched.capacity_per_day || c.totalCapacityPerDay,
                  }
                : c;
            })
          );
        }
      } catch (err) {
        console.warn("[KrishiQ] Error during initial Supabase sync:", err);
      }
    };

    fetchInitialData();

    const bookingsSub = setupRealtimeSubscription<any>(
      "bookings",
      (inserted) => {
        addToast("New Booking Received", "Token " + inserted.token_code + " registered", "success");
        triggerHighlight(inserted.id || inserted.token_code);
      },
      (updated) => {
        addToast("Procurement Stage Updated", "Token " + updated.token_code + " moved to " + updated.stage, "info");
        triggerHighlight(updated.id || updated.token_code);
      }
    );

    const grievancesSub = setupRealtimeSubscription<any>(
      "grievances",
      (inserted) => {
        addToast("New Grievance Raised", "Token " + (inserted.token_code || "") + ": " + inserted.reason, "warning");
        triggerHighlight(inserted.id);
      },
      (updated) => {
        addToast("Grievance Status Updated", "Grievance marked as " + updated.status, "success");
        triggerHighlight(updated.id);
      }
    );

    return () => {
      bookingsSub?.unsubscribe();
      grievancesSub?.unsubscribe();
    };
  }, [addToast, triggerHighlight]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLivePing((prev) => prev + 1);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("krishiq_theme");
    if (saved === "dark" || saved === "light") return saved;
    return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    try {
      localStorage.setItem("krishiq_theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const selectedCentre = useMemo(() => {
    return centres.find((c) => c.id === selectedCentreId) || centres[0];
  }, [centres, selectedCentreId]);

  // Derive Live Queue Items deterministically from all active bookings at selectedCentre
  const queueItems = useMemo<QueueItem[]>(() => {
    const centreBookings = allBookings.filter((b) => b.centreId === selectedCentreId);
    
    return centreBookings
      .map((b) => {
        let status: QueueItem["status"] = "WAITING";
        if (b.currentStageNumber === 8) {
          status = "COMPLETED";
        } else if (b.currentStageNumber >= 3 && b.currentStageNumber < 8) {
          status = "SERVING";
        }

        const stageDef = getStageFromNumber(b.currentStageNumber);

        return {
          id: b.id,
          tokenNumber: b.tokenNumber,
          farmerName: b.farmerName,
          farmerId: b.farmerId,
          village: b.village,
          crop: b.crop,
          quantityQuintals: b.quantityQuintals,
          stageName: b.lastUpdated || stageDef,
          stageNumber: b.currentStageNumber,
          status,
          isCurrentUser: b.farmerId === "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          arrivedTime: b.slotTime.split(" - ")[0] || "09:30 AM",
          assignedCounter: b.currentStageNumber >= 5 ? "Weighbridge 1" : b.currentStageNumber >= 4 ? "QC Station A" : undefined,
          estimatedProcessingMinutes: b.currentStageNumber === 8 ? 0 : Math.max(8, b.estimatedWaitMinutes),
        };
      })
      .sort((a, b) => {
        if (a.status === "SERVING" && b.status !== "SERVING") return -1;
        if (b.status === "SERVING" && a.status !== "SERVING") return 1;
        if (a.status === "WAITING" && b.status === "COMPLETED") return -1;
        if (b.status === "WAITING" && a.status === "COMPLETED") return 1;
        return a.stageNumber - b.stageNumber;
      });
  }, [allBookings, selectedCentreId]);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const toggleNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const recalculateQueuePositions = (updatedBookings: FarmerBooking[], centreId: string) => {
    const avgServiceTimeMins = 12;
    let pos = 1;

    return updatedBookings.map((b) => {
      if (b.centreId === centreId && b.currentStageNumber < 8) {
        const estWait = (pos - 1) * avgServiceTimeMins;
        const currentPos = pos;
        pos++;
        return {
          ...b,
          queuePosition: currentPos,
          estimatedWaitMinutes: estWait,
        };
      }
      if (b.centreId === centreId && b.currentStageNumber === 8) {
        return {
          ...b,
          queuePosition: 0,
          estimatedWaitMinutes: 0,
        };
      }
      return b;
    });
  };

  // Farmer Slot Booking (Adds to allBookings and sets as active)
  const bookSlot = async (
    centreId: string,
    crop: CropType,
    variety: string,
    quantityQuintals: number,
    date: string,
    time: string
  ): Promise<string> => {
    const targetCentre = centres.find((c) => c.id === centreId) || centres[0];
    const mspRate = CROP_MSP_RATES[crop] || 2275;
    const gross = quantityQuintals * mspRate;
    
    // Generate distinct token number
    const existingTokens = allBookings.map((b) => b.tokenNumber);
    let nextNum = 136;
    while (existingTokens.includes("A-" + nextNum)) {
      nextNum++;
    }
    const newTokenNumber = "A-" + nextNum;
    const bookingId = "bk-" + Date.now();

    const newBooking: FarmerBooking = {
      id: bookingId,
      tokenNumber: newTokenNumber,
      farmerName: "Rajesh Kumar Patel",
      farmerId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      phone: "9876543210",
      village: "Kanadia Village",
      district: "Indore",
      crop,
      variety,
      quantityQuintals,
      centreId: targetCentre.id,
      centreName: targetCentre.name,
      centreDistanceKm: targetCentre.distanceKm,
      slotDate: date,
      slotTime: time,
      queuePosition: Math.max(1, Math.floor((targetCentre.currentQueueCount || 20) / 4)),
      currentStageNumber: 1, // slot_booked
      estimatedWaitMinutes: targetCentre.predictedWaitMinutes || 24,
      estimatedServiceTime: time.split(" - ")[0] || "10:30 AM",
      lastUpdated: "Slot Booked Just Now",
      qualityCheck: {
        moisturePercent: 11.4,
        dockagePercent: 0.3,
        foreignMatterPercent: 0.4,
        grade: "Grade A",
        passed: true,
        inspectedBy: "QC Officer R. Sharma",
        inspectedAt: "Pending Gate Entry",
      },
      weighing: {
        grossWeightKg: Math.round(quantityQuintals * 100 + 750),
        tareWeightKg: 750,
        netWeightQuintals: quantityQuintals,
        bagCount: Math.round(quantityQuintals * 2),
        weighbridgeId: "WB-02-DIGITAL",
        weighedAt: "Pending Queue Call",
      },
      payment: {
        mspRatePerQuintal: mspRate,
        grossAmount: gross,
        mandiFeeDeduction: 0,
        netPayableAmount: gross,
        bankName: "State Bank of India",
        accountEnding: "4092",
        ifscPrefix: "SBIN0000382",
        pfmsReferenceId: "PFMS-MP-2026-" + Math.floor(1000000 + Math.random() * 9000000),
        utrNumber: "UTRIB" + Date.now().toString().slice(-10),
        paymentInitiatedDate: date,
        paymentExpectedDate: "Within 24h of intake",
        status: "PENDING",
      },
    };

    setActiveBookingId(bookingId);
    setSelectedCentreId(targetCentre.id);
    setAllBookings((prev) => recalculateQueuePositions([newBooking, ...prev], targetCentre.id));
    triggerHighlight(bookingId);
    triggerHighlight(targetCentre.id);

    const newAudit: AuditLogEntry = {
      id: "audit-" + Date.now(),
      booking_id: bookingId,
      token_code: newTokenNumber,
      actor: "Rajesh Kumar Patel (Farmer)",
      actor_role: "farmer",
      event_type: "booking_created",
      new_value: "slot_booked",
      created_at: new Date().toISOString(),
      details: { crop, quantityQuintals, centre: targetCentre.name, slotDate: date },
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    if (supabase) {
      try {
        await supabase.from("bookings").insert({
          id: bookingId,
          token_code: newTokenNumber,
          farmer_id: newBooking.farmerId,
          centre_id: targetCentre.id,
          crop,
          variety,
          quantity_qtl: quantityQuintals,
          scheduled_date: new Date().toISOString().split("T")[0],
          scheduled_window: time,
          stage: "slot_booked",
          queue_position: newBooking.queuePosition,
          est_wait_minutes: newBooking.estimatedWaitMinutes,
          msp_rate: mspRate,
          total_amount: gross,
          payment_status: "pending",
        });
      } catch (e) {
        console.warn("[Supabase] Insert booking fallback:", e);
      }
    }

    addToast("Slot Confirmed!", "Token " + newTokenNumber + " allocated at " + targetCentre.name, "success");

    setNotifications((prev) => [
      {
        id: "notif-" + Date.now(),
        title: "Slot Confirmed (" + newTokenNumber + ")",
        message: "Your appointment for " + quantityQuintals + " Qtl " + crop + " is booked for " + date + " " + time + " at " + targetCentre.name + ".",
        timestamp: "Just now",
        type: "success",
        read: false,
        actionUrl: "/farmer/queue",
      },
      ...prev,
    ]);

    return newTokenNumber;
  };

  const rescheduleSlot = (newCentreId: string, newDate: string, newTime: string) => {
    const targetCentre = centres.find((c) => c.id === newCentreId) || selectedCentre;
    const newWait = targetCentre.predictedWaitMinutes || 30;

    setAllBookings((prev) =>
      prev.map((b) =>
        b.id === activeBookingId
          ? {
              ...b,
              centreId: targetCentre.id,
              centreName: targetCentre.name,
              slotDate: newDate,
              slotTime: newTime,
              estimatedWaitMinutes: newWait,
            }
          : b
      )
    );

    triggerHighlight(activeBookingId);
    addToast("Slot Rescheduled", "Appointment moved to " + newDate + " (" + newTime + ") at " + targetCentre.name + ".", "info");
  };

  const advanceBookingStage = async (bookingId: string, targetStage?: ProcurementStage) => {
    let updatedBookingToken = "";
    let updatedStageName = "";

    setAllBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id === bookingId) {
          const nextNum = targetStage ? getStageNumber(targetStage) : Math.min(8, b.currentStageNumber + 1);
          const nextStageKey = getStageFromNumber(nextNum);
          updatedBookingToken = b.tokenNumber;
          updatedStageName = nextStageKey;

          let updatedPayment = b.payment;
          if (nextNum >= 7 && updatedPayment) {
            updatedPayment = {
              ...updatedPayment,
              status: nextNum === 8 ? "COMPLETED" : "INITIATED",
              paymentCompletedDate: nextNum === 8 ? "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
            };
          }

          return {
            ...b,
            currentStageNumber: nextNum,
            lastUpdated: "Advanced to " + nextStageKey.replace(/_/g, " "),
            payment: updatedPayment,
          };
        }
        return b;
      });

      return recalculateQueuePositions(updated, selectedCentreId);
    });

    triggerHighlight(bookingId);

    const newAudit: AuditLogEntry = {
      id: "audit-" + Date.now(),
      booking_id: bookingId,
      token_code: updatedBookingToken,
      actor: role === "centre" ? "Centre Operator" : "Procurement Officer",
      actor_role: "centre_operator",
      event_type: "stage_changed",
      new_value: updatedStageName,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    if (supabase) {
      try {
        await supabase
          .from("bookings")
          .update({
            stage: updatedStageName,
            updated_at: new Date().toISOString(),
          })
          .eq("id", bookingId);
      } catch (e) {
        console.warn("[Supabase] Update stage fallback:", e);
      }
    }

    addToast("Procurement Stage Advanced", "Token " + updatedBookingToken + " moved to Stage " + (targetStage || updatedStageName), "info");
  };

  const advanceFarmerStage = () => {
    advanceBookingStage(activeBookingId);
  };

  const updateQualityAndWeight = async (
    bookingId: string,
    quality?: Partial<QualityInspection>,
    weight?: Partial<WeighingSlip>
  ) => {
    let tokenCode = "";
    setAllBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          tokenCode = b.tokenNumber;
          const updatedQuality: QualityInspection | undefined = quality
            ? {
                moisturePercent: quality.moisturePercent ?? b.qualityCheck?.moisturePercent ?? 11.4,
                dockagePercent: quality.dockagePercent ?? b.qualityCheck?.dockagePercent ?? 0.4,
                foreignMatterPercent: quality.foreignMatterPercent ?? b.qualityCheck?.foreignMatterPercent ?? 0.3,
                grade: quality.grade ?? b.qualityCheck?.grade ?? "Grade A",
                passed: quality.passed ?? b.qualityCheck?.passed ?? true,
                inspectedBy: quality.inspectedBy ?? "QC Officer R. Sharma",
                inspectedAt: "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              }
            : b.qualityCheck;

          const updatedWeight: WeighingSlip | undefined = weight
            ? {
                grossWeightKg: weight.grossWeightKg ?? b.weighing?.grossWeightKg ?? 4250,
                tareWeightKg: weight.tareWeightKg ?? b.weighing?.tareWeightKg ?? 750,
                netWeightQuintals: weight.netWeightQuintals ?? b.weighing?.netWeightQuintals ?? b.quantityQuintals,
                bagCount: weight.bagCount ?? b.weighing?.bagCount ?? Math.round(b.quantityQuintals * 2),
                weighbridgeId: weight.weighbridgeId ?? "WB-02-DIGITAL",
                weighedAt: "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              }
            : b.weighing;

          return {
            ...b,
            qualityCheck: updatedQuality,
            weighing: updatedWeight,
            lastUpdated: "Assay & Weight Certified",
          };
        }
        return b;
      })
    );

    triggerHighlight(bookingId);

    const auditEvents: AuditLogEntry[] = [];
    if (quality) {
      auditEvents.push({
        id: "audit-q-" + Date.now(),
        booking_id: bookingId,
        token_code: tokenCode,
        actor: "QC Chemist / Assayer",
        actor_role: "centre_operator",
        event_type: "quality_updated",
        new_value: (quality.grade || "Grade A") + " (Moisture: " + (quality.moisturePercent || 11.4) + "%)",
        created_at: new Date().toISOString(),
        details: quality as any,
      });
    }
    if (weight) {
      auditEvents.push({
        id: "audit-w-" + Date.now(),
        booking_id: bookingId,
        token_code: tokenCode,
        actor: "Weighbridge Operator",
        actor_role: "centre_operator",
        event_type: "weight_updated",
        new_value: "Net: " + weight.netWeightQuintals + " Qtl (" + weight.bagCount + " bags)",
        created_at: new Date().toISOString(),
        details: weight as any,
      });
    }

    setAuditLogs((prev) => [...auditEvents, ...prev]);
    addToast("Procurement Data Recorded", "Quality & Weight records logged for Token " + tokenCode, "success");
  };

  const simulatePayment = async (
    bookingId: string,
    targetStatus: "PENDING" | "INITIATED" | "COMPLETED"
  ) => {
    let tokenCode = "";
    const pfmsRef = "PFMS-MP-2026-" + Math.floor(1000000 + Math.random() * 9000000);
    const utr = "UTRIB" + Date.now().toString().slice(-10);

    setAllBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          tokenCode = b.tokenNumber;
          const gross = b.quantityQuintals * (b.payment?.mspRatePerQuintal || 2275);
          return {
            ...b,
            currentStageNumber: targetStatus === "COMPLETED" ? 8 : 7,
            payment: {
              mspRatePerQuintal: b.payment?.mspRatePerQuintal || 2275,
              grossAmount: gross,
              mandiFeeDeduction: 0,
              netPayableAmount: gross,
              bankName: b.payment?.bankName || "State Bank of India",
              accountEnding: b.payment?.accountEnding || "4092",
              ifscPrefix: b.payment?.ifscPrefix || "SBIN0000382",
              pfmsReferenceId: b.payment?.pfmsReferenceId || pfmsRef,
              utrNumber: targetStatus === "COMPLETED" ? (b.payment?.utrNumber || utr) : b.payment?.utrNumber || utr,
              paymentInitiatedDate: "Today",
              paymentExpectedDate: "Within 24 hours",
              paymentCompletedDate: targetStatus === "COMPLETED" ? "Today, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
              status: targetStatus,
            },
          };
        }
        return b;
      })
    );

    triggerHighlight(bookingId);

    setAuditLogs((prev) => [
      {
        id: "audit-pay-" + Date.now(),
        booking_id: bookingId,
        token_code: tokenCode,
        actor: "PFMS / DBT Gateway",
        actor_role: "finance",
        event_type: targetStatus === "COMPLETED" ? "payment_completed" : "payment_initiated",
        new_value: "Status: " + targetStatus + " (Ref: " + pfmsRef + ")",
        created_at: new Date().toISOString(),
        details: { status: targetStatus, pfmsRef, utr },
      },
      ...prev,
    ]);

    addToast(
      targetStatus === "COMPLETED" ? "Payment Completed (DBT Settled)" : "Payment Initiated via PFMS",
      "₹" + (farmerBooking.payment?.netPayableAmount || 79625).toLocaleString("en-IN") + " routed to Bank Account",
      "success"
    );
  };

  const raiseGrievance = async (reason: string, description: string, bookingId?: string) => {
    const targetBooking = allBookings.find((b) => b.id === (bookingId || activeBookingId)) || farmerBooking;
    const newGrievance: GrievanceItem = {
      id: "grv-" + Date.now(),
      booking_id: targetBooking.id,
      farmer_id: targetBooking.farmerId,
      farmer_name: targetBooking.farmerName,
      token_code: targetBooking.tokenNumber,
      reason,
      description,
      status: "open",
      created_at: new Date().toISOString(),
    };

    setGrievances((prev) => [newGrievance, ...prev]);
    triggerHighlight(newGrievance.id);

    setAuditLogs((prev) => [
      {
        id: "audit-grv-" + Date.now(),
        booking_id: newGrievance.booking_id,
        token_code: newGrievance.token_code,
        actor: targetBooking.farmerName + " (Farmer)",
        actor_role: "farmer",
        event_type: "grievance_created",
        new_value: reason,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    if (supabase) {
      try {
        await supabase.from("grievances").insert({
          booking_id: newGrievance.booking_id,
          farmer_id: newGrievance.farmer_id,
          token_code: newGrievance.token_code,
          reason,
          description,
          status: "open",
        });
      } catch (e) {
        console.warn("[Supabase] Insert grievance fallback:", e);
      }
    }

    addToast("Grievance Registered", "Ticket generated for Token " + targetBooking.tokenNumber + ". Centre Incharge notified.", "warning");
  };

  const resolveGrievance = async (grievanceId: string, resolutionNote: string) => {
    let tokenCode = "";
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === grievanceId) {
          tokenCode = g.token_code || "";
          return {
            ...g,
            status: "resolved",
            resolution_note: resolutionNote,
            resolved_at: new Date().toISOString(),
          };
        }
        return g;
      })
    );

    triggerHighlight(grievanceId);

    setAuditLogs((prev) => [
      {
        id: "audit-grvr-" + Date.now(),
        token_code: tokenCode,
        actor: "Centre Incharge",
        actor_role: "centre_operator",
        event_type: "grievance_resolved",
        new_value: resolutionNote,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    if (supabase) {
      try {
        await supabase
          .from("grievances")
          .update({
            status: "resolved",
            resolution_note: resolutionNote,
            resolved_at: new Date().toISOString(),
          })
          .eq("id", grievanceId);
      } catch (e) {
        console.warn("[Supabase] Resolve grievance fallback:", e);
      }
    }

    addToast("Grievance Resolved", "Dispute for Token " + tokenCode + " marked resolved.", "success");
  };

  const decrementQueueCount = (centreId?: string) => {
    const targetId = centreId || selectedCentreId;
    setCentres((prev) =>
      prev.map((c) =>
        c.id === targetId ? { ...c, currentQueueCount: Math.max(0, c.currentQueueCount - 1) } : c
      )
    );
  };

  const callNextFarmer = () => {
    decrementQueueCount();

    const nextWaiting = allBookings.find(
      (b) => b.centreId === selectedCentreId && b.currentStageNumber < 3
    );

    if (nextWaiting) {
      advanceBookingStage(nextWaiting.id, "gate_verification");
      addToast("Next Farmer Called", "Token " + nextWaiting.tokenNumber + " (" + nextWaiting.farmerName + ") called to Gate.", "info");
    } else {
      addToast("Queue Clear", "No more waiting tokens in active intake queue.", "info");
    }
  };

  const startProcessingItem = (id: string) => {
    advanceBookingStage(id, "quality_inspection");
  };

  const completeProcessingItem = (id: string) => {
    advanceBookingStage(id, "payment_completed");
  };

  const resolveBottleneck = (centreId: string) => {
    setCentres((prev) =>
      prev.map((c) => {
        if (c.id === centreId) {
          return {
            ...c,
            status: "normal",
            currentQueueCount: Math.max(12, Math.floor(c.currentQueueCount * 0.6)),
            predictedWaitMinutes: Math.max(20, Math.floor(c.predictedWaitMinutes * 0.4)),
            utilizationPercent: 72,
            bottlenecks: [],
          };
        }
        return c;
      })
    );
    triggerHighlight(centreId);
    addToast("Bottleneck Action Applied", "Rebalanced operators and relieved choke point. Queue delay mitigated by 60%.", "success");
  };

  const resetAllData = () => {
    setCentres(MOCK_CENTRES);
    setSelectedCentreId("centre-b");
    setActiveBookingId("booking-111");
    setAllBookings([
      {
        id: "booking-111",
        tokenNumber: "A-135",
        farmerName: "Rajesh Kumar Patel",
        farmerId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        phone: "9876543210",
        village: "Kanadia Village",
        district: "Indore",
        crop: "Wheat",
        variety: "Sharbati Wheat (Grade A)",
        quantityQuintals: 35,
        centreId: "centre-b",
        centreName: "Shivaji Nagar Procurement Centre (Centre B)",
        centreDistanceKm: 7.2,
        slotDate: "Today",
        slotTime: "10:00 AM - 10:30 AM",
        queuePosition: 3,
        currentStageNumber: 3,
        estimatedWaitMinutes: 24,
        estimatedServiceTime: "10:15 AM",
        lastUpdated: "Gate verification active",
        qualityCheck: {
          moisturePercent: 11.4,
          dockagePercent: 0.3,
          foreignMatterPercent: 0.4,
          grade: "Grade A",
          passed: true,
          inspectedBy: "QC Officer R. Sharma",
          inspectedAt: "Today, 10:05 AM",
        },
        weighing: {
          grossWeightKg: 4250,
          tareWeightKg: 750,
          netWeightQuintals: 35,
          bagCount: 70,
          weighbridgeId: "WB-02-DIGITAL",
          weighedAt: "Today, 10:12 AM",
        },
        payment: {
          mspRatePerQuintal: 2275,
          grossAmount: 79625,
          mandiFeeDeduction: 0,
          netPayableAmount: 79625,
          bankName: "State Bank of India",
          accountEnding: "4092",
          ifscPrefix: "SBIN0000382",
          pfmsReferenceId: "PFMS-MP-2026-884102",
          utrNumber: "UTRIB26241088492",
          paymentInitiatedDate: "Today",
          paymentExpectedDate: "Within 24h of intake",
          status: "PENDING",
        },
      },
    ]);
    setNotifications(MOCK_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setGrievances(INITIAL_GRIEVANCES);
    addToast("State Reset", "Demo data reset to factory initial state.", "info");
  };

  const currentTimeFormatted = "2:45 PM";

  return (
    <KrishiQContext.Provider
      value={{
        role,
        setRole,
        centres,
        selectedCentre,
        selectedCentreId,
        setSelectedCentreId,
        farmerBooking,
        farmerBookings,
        activeBookingId,
        setActiveBookingId,
        allBookings,
        queueItems,
        notifications,
        unreadNotifsCount,
        toasts,
        auditLogs,
        grievances,
        highlightedIds,
        isItemHighlighted,
        triggerHighlight,
        isRealtimeConnected,
        addToast,
        removeToast,
        bookSlot,
        rescheduleSlot,
        advanceFarmerStage,
        advanceBookingStage,
        updateQualityAndWeight,
        simulatePayment,
        raiseGrievance,
        resolveGrievance,
        callNextFarmer,
        decrementQueueCount,
        startProcessingItem,
        completeProcessingItem,
        resolveBottleneck,
        markNotificationAsRead,
        toggleNotificationRead,
        markAllNotificationsAsRead,
        resetAllData,
        simParams,
        setSimParams,
        currentTimeFormatted,
        livePing,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </KrishiQContext.Provider>
  );
};

export const useKrishiQ = () => {
  const context = useContext(KrishiQContext);
  if (!context) {
    throw new Error("useKrishiQ must be used within a KrishiQProvider");
  }
  return context;
};

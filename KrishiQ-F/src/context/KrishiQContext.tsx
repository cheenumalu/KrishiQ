import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  ProcurementCentre,
  FarmerBooking,
  QueueItem,
  NotificationItem,
  SimulationParams,
  CropType
} from "../types";
import {
  MOCK_CENTRES,
  INITIAL_FARMER_BOOKING,
  INITIAL_QUEUE_ITEMS,
  MOCK_NOTIFICATIONS,
  CROP_MSP_RATES
} from "../data/mockData";

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  durationMs?: number;
}

interface KrishiQContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  centres: ProcurementCentre[];
  selectedCentre: ProcurementCentre;
  setSelectedCentreId: (id: string) => void;
  farmerBooking: FarmerBooking;
  queueItems: QueueItem[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage["type"]) => void;
  removeToast: (id: string) => void;
  bookSlot: (centreId: string, crop: CropType, variety: string, quantityQuintals: number, date: string, time: string) => void;
  rescheduleSlot: (newCentreId: string, newDate: string, newTime: string) => void;
  advanceFarmerStage: () => void;
  callNextFarmer: () => void;
  startProcessingItem: (id: string) => void;
  completeProcessingItem: (id: string) => void;
  resolveBottleneck: (centreId: string) => void;
  markNotificationAsRead: (id: string) => void;
  resetAllData: () => void;
  simParams: SimulationParams;
  setSimParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  currentTimeFormatted: string;
  livePing: number;
}

const KrishiQContext = createContext<KrishiQContextType | undefined>(undefined);

export const KrishiQProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("farmer");
  const [centres, setCentres] = useState<ProcurementCentre[]>(MOCK_CENTRES);
  const [selectedCentreId, setSelectedCentreId] = useState<string>("centre-b");
  const [farmerBooking, setFarmerBooking] = useState<FarmerBooking>(INITIAL_FARMER_BOOKING);
  const [queueItems, setQueueItems] = useState<QueueItem[]>(INITIAL_QUEUE_ITEMS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [livePing, setLivePing] = useState<number>(0);
  const [simParams, setSimParams] = useState<SimulationParams>({
    additionalFarmers: 120,
    activeCounters: 4,
    qualityStaff: 3,
    extendedHours: 1,
    targetCentreId: "centre-a",
  });

  // Simulated live heartbeat timer (every 10 seconds updates queue ticker indicator)
  useEffect(() => {
    const timer = setInterval(() => {
      setLivePing((prev) => prev + 1);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const addToast = (title: string, message: string, type: ToastMessage["type"] = "info") => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const selectedCentre = centres.find((c) => c.id === selectedCentreId) || centres[0];

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Booking a slot
  const bookSlot = (
    centreId: string,
    crop: CropType,
    variety: string,
    quantityQuintals: number,
    date: string,
    time: string
  ) => {
    const targetCentre = centres.find((c) => c.id === centreId) || centres[0];
    const mspRate = CROP_MSP_RATES[crop] || 2275;
    const gross = quantityQuintals * mspRate;
    const newToken = "A-" + (130 + Math.floor(Math.random() * 20));

    const updatedBooking: FarmerBooking = {
      ...farmerBooking,
      tokenNumber: newToken,
      centreId: targetCentre.id,
      centreName: targetCentre.name,
      centreDistanceKm: targetCentre.distanceKm,
      crop,
      variety,
      quantityQuintals,
      slotDate: date,
      slotTime: time,
      queuePosition: Math.max(2, Math.floor(targetCentre.currentQueueCount / 4)),
      currentStageNumber: 2, // Slot Booked
      estimatedWaitMinutes: targetCentre.predictedWaitMinutes,
      estimatedServiceTime: time.split(" - ")[0] || "10:30 AM",
      lastUpdated: "Just now",
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

    setFarmerBooking(updatedBooking);
    addToast("Slot Booked Successfully!", "Token " + newToken + " allocated at " + targetCentre.name, "success");
    
    // Add notification
    setNotifications((prev) => [
      {
        id: "notif-" + Date.now(),
        title: "Slot Confirmed (" + newToken + ")",
        message: "Your slot for " + quantityQuintals + " Qtl " + crop + " is locked for " + date + " " + time + " at " + targetCentre.name + ".",
        timestamp: "Just now",
        type: "success",
        read: false,
        actionUrl: "/farmer/queue",
      },
      ...prev,
    ]);
  };

  // Rescheduling slot
  const rescheduleSlot = (newCentreId: string, newDate: string, newTime: string) => {
    const targetCentre = centres.find((c) => c.id === newCentreId) || selectedCentre;
    const newWait = targetCentre.predictedWaitMinutes;

    setFarmerBooking((prev) => ({
      ...prev,
      centreId: targetCentre.id,
      centreName: targetCentre.name,
      centreDistanceKm: targetCentre.distanceKm,
      slotDate: newDate,
      slotTime: newTime,
      estimatedWaitMinutes: newWait,
      lastUpdated: "Rescheduled just now",
    }));

    addToast("Slot Rescheduled", "New slot set for " + newDate + " (" + newTime + "). Predicted wait: " + newWait + " min.", "info");
  };

  // Farmer stage progression (advance to next stage in 8-step pipeline)
  const advanceFarmerStage = () => {
    setFarmerBooking((prev) => {
      const nextStage = Math.min(8, prev.currentStageNumber + 1);
      let updatedPayment = prev.payment;
      if (nextStage >= 7 && updatedPayment) {
        updatedPayment = {
          ...updatedPayment,
          status: nextStage === 8 ? "COMPLETED" : "INITIATED",
          paymentCompletedDate: nextStage === 8 ? "Today, 11:42 AM" : undefined,
        };
      }
      return {
        ...prev,
        currentStageNumber: nextStage,
        queuePosition: Math.max(0, prev.queuePosition - 1),
        lastUpdated: "Updated just now",
        payment: updatedPayment,
      };
    });
    addToast("Procurement Stage Advanced", "Farmer status updated to Stage " + Math.min(8, farmerBooking.currentStageNumber + 1), "info");
  };

  // Operator Actions: Call Next
  const callNextFarmer = () => {
    const nextWaiting = queueItems.find((q) => q.status === "WAITING" && !q.isCurrentUser);
    if (!nextWaiting) {
      // Check if user is next
      const userItem = queueItems.find((q) => q.isCurrentUser && q.status === "WAITING");
      if (userItem) {
        setQueueItems((prev) =>
          prev.map((item) =>
            item.id === userItem.id
              ? { ...item, status: "SERVING", stageName: "Quality Inspection (Calling Now)" }
              : item
          )
        );
        addToast("Farmer Called", "Called Token " + userItem.tokenNumber + " (Rajesh Kumar) to Counter", "info");
        return;
      }
      addToast("Queue Clear", "No more waiting farmers in active queue.", "info");
      return;
    }

    setQueueItems((prev) =>
      prev.map((item) =>
        item.id === nextWaiting.id
          ? { ...item, status: "SERVING", stageName: "Active at Weighbridge" }
          : item
      )
    );
    addToast("Next Farmer Called", "Token " + nextWaiting.tokenNumber + " (" + nextWaiting.farmerName + ") called to counter.", "info");
  };

  const startProcessingItem = (id: string) => {
    setQueueItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "SERVING", stageName: "Assaying & Moisture Check" }
          : item
      )
    );
    addToast("Processing Started", "Inspection underway for selected farmer.", "info");
  };

  const completeProcessingItem = (id: string) => {
    setQueueItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "COMPLETED", stageName: "Procurement & Payment Cleared", estimatedProcessingMinutes: 0 }
          : item
      )
    );

    // If user's token completed, advance farmer's stage too!
    const item = queueItems.find((q) => q.id === id);
    if (item?.isCurrentUser) {
      setFarmerBooking((prev) => ({
        ...prev,
        currentStageNumber: 8,
        queuePosition: 0,
        payment: prev.payment ? { ...prev.payment, status: "COMPLETED", paymentCompletedDate: "Today, 11:55 AM" } : undefined,
      }));
    }

    addToast("Procurement Completed", "Token " + (item?.tokenNumber || "") + " successfully processed & receipt generated.", "success");
  };

  // Rebalancing / resolving bottleneck at centre
  const resolveBottleneck = (centreId: string) => {
    setCentres((prev) =>
      prev.map((c) => {
        if (c.id === centreId) {
          return {
            ...c,
            status: "normal",
            currentQueueCount: Math.max(12, Math.floor(c.currentQueueCount * 0.6)),
            predictedWaitMinutes: Math.max(25, Math.floor(c.predictedWaitMinutes * 0.4)),
            utilizationPercent: 74,
            bottlenecks: [],
          };
        }
        return c;
      })
    );
    addToast("Bottleneck Action Applied", "Shifted 2 operators to Weighbridge & redirected arrivals. Queue wait cut by 60%.", "success");
  };

  const resetAllData = () => {
    setCentres(MOCK_CENTRES);
    setSelectedCentreId("centre-b");
    setFarmerBooking(INITIAL_FARMER_BOOKING);
    setQueueItems(INITIAL_QUEUE_ITEMS);
    setNotifications(MOCK_NOTIFICATIONS);
    addToast("State Reset", "Prototype demo data reset to default factory state.", "info");
  };

  const currentTimeFormatted = "2:45 PM";

  return (
    <KrishiQContext.Provider
      value={{
        role,
        setRole,
        centres,
        selectedCentre,
        setSelectedCentreId,
        farmerBooking,
        queueItems,
        notifications,
        unreadNotifsCount,
        toasts,
        addToast,
        removeToast,
        bookSlot,
        rescheduleSlot,
        advanceFarmerStage,
        callNextFarmer,
        startProcessingItem,
        completeProcessingItem,
        resolveBottleneck,
        markNotificationAsRead,
        resetAllData,
        simParams,
        setSimParams,
        currentTimeFormatted,
        livePing,
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
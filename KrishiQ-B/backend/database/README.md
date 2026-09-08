# KrishiQ (कृषि-Q) - Database Architecture & Migrations

**Problem Statement:** SIH26032 — Intelligent Agricultural Procurement Coordination Platform  
**Target Platform:** Supabase PostgreSQL  
**Directory:** `backend/database/`

---

## 1. Migration Execution Sequence

When setting up or updating your Supabase database in the **SQL Editor**, execute scripts in this exact order:

| Step | File | Purpose |
| :-: | :--- | :--- |
| **1** | [`01_schema.sql`](file:///c:/Projects/KrishiQ/KrishiQ/KrishiQ-B/backend/database/01_schema.sql) | Base Phase 2 DDL: 11 core tables, triggers, indexes, and constraints. |
| **2** | [`03_phase4_booking_enhancements.sql`](file:///c:/Projects/KrishiQ/KrishiQ/KrishiQ-B/backend/database/03_phase4_booking_enhancements.sql) | Phase 4 Enhancements: `slot_date` column, same-day anti-double-booking unique index, and `PENDING_ARRIVAL` queue token status. |
| **3** | [`02_seed.sql`](file:///c:/Projects/KrishiQ/KrishiQ/KrishiQ-B/backend/database/02_seed.sql) | Demo seed dataset: 6 MSP crops, 5 Indore Mandis, demo users, multi-state intake slots, active & completed bookings, and queue tokens. |

---

## 2. Core Tables Overview

1. **`users`**: System identity and roles (`farmer`, `centre`, `admin`).
2. **`farmers`**: Agricultural profile, Khasra land verification, bank particulars, and seasonal allotment quota (`max_allotment_quintals`).
3. **`procurement_centres`**: APMC Mandis with operating hours, active counters, and daily capacity.
4. **`crops`**: Minimum Support Price (MSP) benchmarks and Fair Average Quality (FAQ) tolerance limits.
5. **`slots`**: 30-minute arrival capacity windows (`booked_count <= max_capacity`).
6. **`bookings`**: Farmer appointments linking farmer, Mandi, slot, `slot_date`, and crop lot size.
7. **`queue_tokens`**: Real-time intake queue pass (`PENDING_ARRIVAL`, `WAITING`, `SERVING`, `COMPLETED`, `NO_SHOW`).
8. **`procurements`**: Physical quality assay results (moisture %, dockage %) and certified weighbridge weights.
9. **`payments`**: Direct Benefit Transfer (DBT) and PFMS disbursement records.
10. **`notifications`**: In-app alerts for slot reminders, queue shifts, and payment settlements.
11. **`centre_bottlenecks`**: Real-time Mandi traffic monitoring and operator reallocations.

---

## 3. Double-Booking & Overbooking Protections

* **Slot-Level Overbooking Protection:**
  ```sql
  CHECK (booked_count >= 0 AND booked_count <= max_capacity)
  ```
* **Same-Slot Duplicate Prevention:**
  ```sql
  CREATE UNIQUE INDEX uq_farmer_active_slot
  ON bookings (farmer_id, slot_id)
  WHERE booking_status IN ('CONFIRMED', 'RESCHEDULED');
  ```
* **Same-Day Multi-Slot Anti-Hoarding Protection:**
  ```sql
  CREATE UNIQUE INDEX uq_farmer_single_active_booking_per_day
  ON bookings (farmer_id, slot_date)
  WHERE booking_status IN ('CONFIRMED', 'RESCHEDULED');
  ```

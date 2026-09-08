-- ==============================================================================
-- KrishiQ (कृषि-Q) - Database Migration: Phase 4 Core Booking Enhancements
-- Problem Statement: SIH26032
-- Target Platform: Supabase PostgreSQL
-- ==============================================================================
-- Purpose:
-- 1. Add slot_date directly to bookings to optimize querying and support date-level constraints.
-- 2. Prevent same-day multi-booking fraud via partial unique index uq_farmer_single_active_booking_per_day.
-- 3. Enhance queue_tokens status check constraint to include 'PENDING_ARRIVAL' for future bookings.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ADD AND POPULATE slot_date ON bookings
-- ------------------------------------------------------------------------------
-- Add column if not already present
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS slot_date DATE;

-- Backfill slot_date from associated slots for any existing booking records
UPDATE bookings b
SET slot_date = s.slot_date
FROM slots s
WHERE b.slot_id = s.id
  AND b.slot_date IS NULL;

-- Enforce NOT NULL constraint now that existing rows are populated
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' 
          AND column_name = 'slot_date' 
          AND is_nullable = 'YES'
    ) THEN
        -- Only set NOT NULL if there are no lingering NULL rows
        IF NOT EXISTS (SELECT 1 FROM bookings WHERE slot_date IS NULL) THEN
            ALTER TABLE bookings ALTER COLUMN slot_date SET NOT NULL;
        END IF;
    END IF;
END $$;

-- Create performance index for Mandi date lookups
CREATE INDEX IF NOT EXISTS idx_bookings_centre_slot_date 
ON bookings (centre_id, slot_date);

-- ------------------------------------------------------------------------------
-- 2. PREVENT SAME-DAY MULTI-SLOT DOUBLE BOOKING
-- ------------------------------------------------------------------------------
-- Ensures a farmer cannot hold multiple 'CONFIRMED' or 'RESCHEDULED' bookings
-- on the same calendar day across any procurement centre or time window.
CREATE UNIQUE INDEX IF NOT EXISTS uq_farmer_single_active_booking_per_day
ON bookings (farmer_id, slot_date)
WHERE booking_status IN ('CONFIRMED', 'RESCHEDULED');

-- ------------------------------------------------------------------------------
-- 3. ENHANCE QUEUE TOKEN STATUS (ADD 'PENDING_ARRIVAL')
-- ------------------------------------------------------------------------------
-- In PostgreSQL, CHECK constraints cannot be altered in-place with ALTER CONSTRAINT;
-- they must be dropped by name and recreated.

ALTER TABLE queue_tokens 
DROP CONSTRAINT IF EXISTS queue_tokens_status_check;

ALTER TABLE queue_tokens 
ADD CONSTRAINT queue_tokens_status_check 
CHECK (status IN ('PENDING_ARRIVAL', 'WAITING', 'SERVING', 'COMPLETED', 'NO_SHOW'));

-- Set default to 'PENDING_ARRIVAL' so newly booked tokens for future dates start in PENDING_ARRIVAL
ALTER TABLE queue_tokens 
ALTER COLUMN status SET DEFAULT 'PENDING_ARRIVAL';

-- Any existing 'WAITING' tokens for future dates can be safely converted to PENDING_ARRIVAL
UPDATE queue_tokens
SET status = 'PENDING_ARRIVAL'
WHERE status = 'WAITING' 
  AND queue_date > CURRENT_DATE;

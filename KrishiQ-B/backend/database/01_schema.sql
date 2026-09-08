-- ==============================================================================
-- KrishiQ (कृषि-Q) - PostgreSQL Database Schema
-- Problem Statement: SIH26032
-- Target Platform: Supabase PostgreSQL
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. HELPER TRIGGER FUNCTION FOR AUTO-UPDATING TIMESTAMPS
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. USERS TABLE (Core Authentication & RBAC Identity)
-- Maps to system identities for farmers, centre operators, and administrators.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'centre', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 3. FARMERS TABLE (Farmer Agricultural Profile & Land Allotment)
-- Stores agricultural registration, land verification status, and default bank info.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    farmer_id_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'MP-IND-2026-8841'
    village VARCHAR(100) NOT NULL,
    tehsil VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Madhya Pradesh',
    aadhaar_verified BOOLEAN NOT NULL DEFAULT false,
    bank_name VARCHAR(150) NOT NULL,
    account_number_mask VARCHAR(20) NOT NULL, -- e.g. '4092'
    ifsc_prefix VARCHAR(20) NOT NULL,        -- e.g. 'SBIN0000382'
    max_allotment_quintals NUMERIC(8,2) NOT NULL DEFAULT 500.00 CHECK (max_allotment_quintals > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_farmers_updated_at
BEFORE UPDATE ON farmers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 4. PROCUREMENT CENTRES TABLE (APMC Mandis)
-- Directory of physical procurement hubs, operating capacities, and live status.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS procurement_centres (
    id VARCHAR(50) PRIMARY KEY, -- Supports slugs like 'centre-b' or UUID strings
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'MP-IND-02'
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Madhya Pradesh',
    distance_km NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),
    active_counters INT NOT NULL DEFAULT 4 CHECK (active_counters >= 1),
    total_capacity_per_day INT NOT NULL DEFAULT 300 CHECK (total_capacity_per_day > 0),
    operating_hours VARCHAR(100) NOT NULL DEFAULT '08:00 AM - 06:00 PM',
    status VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'critical')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_centres_updated_at
BEFORE UPDATE ON procurement_centres
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 5. CROPS TABLE (Government Minimum Support Price & Standards)
-- Catalog of supported commodities, MSP per quintal, and FAQ assay tolerances.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'Wheat', 'Paddy', 'Soybean', 'Maize', 'Cotton', 'Mustard'
    msp_per_quintal NUMERIC(10,2) NOT NULL CHECK (msp_per_quintal > 0),
    max_moisture_percent NUMERIC(4,2) NOT NULL DEFAULT 12.00,
    max_dockage_percent NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    max_foreign_matter_percent NUMERIC(4,2) NOT NULL DEFAULT 1.50,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_crops_updated_at
BEFORE UPDATE ON crops
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 6. SLOTS TABLE (30-Minute Intake Windows)
-- Pre-allocated capacity buckets to prevent Mandi gate congestion spikes.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centre_id VARCHAR(50) NOT NULL REFERENCES procurement_centres(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    time_window VARCHAR(50) NOT NULL, -- e.g. '10:00 - 10:30'
    max_capacity INT NOT NULL DEFAULT 20 CHECK (max_capacity > 0),
    booked_count INT NOT NULL DEFAULT 0 CHECK (booked_count >= 0 AND booked_count <= max_capacity),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_centre_slot_window UNIQUE (centre_id, slot_date, time_window)
);

-- ==============================================================================
-- 7. BOOKINGS TABLE (Farmer Slot Reservations & 8-Stage Tracker)
-- Links a farmer to an appointment slot, declared lot size, and lifecycle state.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'BK-2026-9042'
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE RESTRICT,
    centre_id VARCHAR(50) NOT NULL REFERENCES procurement_centres(id) ON DELETE RESTRICT,
    slot_id UUID NOT NULL REFERENCES slots(id) ON DELETE RESTRICT,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    variety VARCHAR(100) NOT NULL, -- e.g. 'Sharbati Wheat (Grade A)'
    quantity_quintals NUMERIC(8,2) NOT NULL CHECK (quantity_quintals > 0 AND quantity_quintals <= 500),
    booking_status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED' CHECK (booking_status IN ('CONFIRMED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED')),
    stage_number INT NOT NULL DEFAULT 2 CHECK (stage_number BETWEEN 1 AND 8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Prevent double-booking: A farmer cannot hold multiple active bookings for the same slot
CREATE UNIQUE INDEX uq_farmer_active_slot
ON bookings (farmer_id, slot_id)
WHERE booking_status IN ('CONFIRMED', 'RESCHEDULED');

-- ==============================================================================
-- 8. QUEUE_TOKENS TABLE (Deterministic Live Intake Queue)
-- Manages FIFO sequence, active counter assignments, and serving status.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS queue_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    centre_id VARCHAR(50) NOT NULL REFERENCES procurement_centres(id) ON DELETE CASCADE,
    token_number VARCHAR(20) NOT NULL, -- e.g. 'A127'
    sequence_number INT NOT NULL CHECK (sequence_number > 0), -- Used for reliable ORDER BY sequence_number ASC
    queue_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'SERVING', 'COMPLETED', 'NO_SHOW')),
    assigned_counter VARCHAR(50), -- e.g. 'Weighbridge 1', 'QC Station A'
    arrived_at TIMESTAMPTZ,
    service_started_at TIMESTAMPTZ,
    service_completed_at TIMESTAMPTZ,
    estimated_wait_minutes INT NOT NULL DEFAULT 30 CHECK (estimated_wait_minutes >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_centre_daily_token UNIQUE (centre_id, queue_date, sequence_number)
);

CREATE TRIGGER trg_queue_tokens_updated_at
BEFORE UPDATE ON queue_tokens
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 9. PROCUREMENTS TABLE (Physical Quality Assay & Weighbridge Slip)
-- Captures Fair Average Quality (FAQ) moisture tests and certified weights.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS procurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE RESTRICT,
    centre_id VARCHAR(50) NOT NULL REFERENCES procurement_centres(id) ON DELETE RESTRICT,
    operator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    moisture_percent NUMERIC(4,2) NOT NULL CHECK (moisture_percent >= 0 AND moisture_percent <= 100),
    dockage_percent NUMERIC(4,2) NOT NULL DEFAULT 0.00 CHECK (dockage_percent >= 0 AND dockage_percent <= 100),
    foreign_matter_percent NUMERIC(4,2) NOT NULL DEFAULT 0.00 CHECK (foreign_matter_percent >= 0 AND foreign_matter_percent <= 100),
    quality_grade VARCHAR(40) NOT NULL CHECK (quality_grade IN ('Grade A', 'FAQ (Fair Average Quality)', 'Grade B', 'Below FAQ')),
    quality_passed BOOLEAN NOT NULL DEFAULT true,
    gross_weight_kg NUMERIC(10,2) CHECK (gross_weight_kg >= 0),
    tare_weight_kg NUMERIC(10,2) CHECK (tare_weight_kg >= 0),
    net_weight_quintals NUMERIC(8,2) CHECK (net_weight_quintals >= 0),
    bag_count INT CHECK (bag_count >= 0),
    weighbridge_id VARCHAR(50), -- e.g. 'WB-01-DIGITAL'
    procurement_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (procurement_status IN ('PENDING', 'INSPECTED', 'WEIGHED', 'COMPLETED', 'REJECTED')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_procurements_updated_at
BEFORE UPDATE ON procurements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 10. PAYMENTS TABLE (Direct Benefit Transfer (DBT) & PFMS Settlement)
-- Records calculated MSP payout, PFMS reference IDs, and UTR banking numbers.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procurement_id UUID NOT NULL UNIQUE REFERENCES procurements(id) ON DELETE RESTRICT,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE RESTRICT,
    msp_rate_per_quintal NUMERIC(10,2) NOT NULL CHECK (msp_rate_per_quintal > 0),
    gross_amount NUMERIC(12,2) NOT NULL CHECK (gross_amount >= 0),
    mandi_fee_deduction NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (mandi_fee_deduction >= 0),
    net_payable_amount NUMERIC(12,2) NOT NULL CHECK (net_payable_amount >= 0),
    bank_name VARCHAR(150) NOT NULL,
    account_number_mask VARCHAR(20) NOT NULL,
    ifsc_prefix VARCHAR(20) NOT NULL,
    pfms_reference_id VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'PFMS-MP-2026-9920148'
    utr_number VARCHAR(100) UNIQUE,                -- e.g. 'UTRIB26241088492'
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'INITIATED', 'COMPLETED', 'FAILED')),
    initiated_at TIMESTAMPTZ,
    expected_credit_date DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 11. NOTIFICATIONS TABLE (In-App Alerts & Push Broadcasts)
-- Stores notifications for queue shifts, slot reminders, and stage completions.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'critical')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    action_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 12. CENTRE_BOTTLENECKS TABLE (Mandi Choke Points & Rebalancing Advisories)
-- Tracks real-time station congestion and recommended operator reallocations.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS centre_bottlenecks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centre_id VARCHAR(50) NOT NULL REFERENCES procurement_centres(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL, -- e.g. 'Weighbridge 2', 'Moisture QC Desk'
    waiting_count INT NOT NULL DEFAULT 0 CHECK (waiting_count >= 0),
    severity VARCHAR(20) NOT NULL DEFAULT 'warning' CHECK (severity IN ('warning', 'critical')),
    recommendation TEXT NOT NULL,
    counter_suggestion VARCHAR(100),
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_bottlenecks_updated_at
BEFORE UPDATE ON centre_bottlenecks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 13. PERFORMANCE INDEXES
-- Optimized for high-frequency queries: live queues, active bookings, & alerts.
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_farmers_user_id ON farmers(user_id);
CREATE INDEX IF NOT EXISTS idx_slots_centre_date ON slots(centre_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_bookings_farmer ON bookings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_centre ON bookings(centre_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_queue_centre_date_status ON queue_tokens(centre_id, queue_date, status);
CREATE INDEX IF NOT EXISTS idx_queue_sequence ON queue_tokens(centre_id, queue_date, sequence_number ASC);
CREATE INDEX IF NOT EXISTS idx_procurements_booking ON procurements(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_farmer ON payments(farmer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_bottlenecks_centre_active ON centre_bottlenecks(centre_id) WHERE is_resolved = false;

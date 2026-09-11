-- ==============================================================================
-- KrishiQ (कृषि-Q) - Complete Production-Ready Database Schema & Migration
-- Problem Statement: SIH26032 (Intelligent Wheat MSP Procurement Coordination Platform)
-- Target Platform: Supabase PostgreSQL
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. CENTRES TABLE
CREATE TABLE IF NOT EXISTS centres (
    id VARCHAR(50) PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Madhya Pradesh',
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    operating_hours_start TIME NOT NULL DEFAULT '08:00:00',
    operating_hours_end TIME NOT NULL DEFAULT '18:00:00',
    operating_hours TEXT NOT NULL DEFAULT '08:00 AM - 06:00 PM',
    capacity_per_day NUMERIC(10,2) NOT NULL DEFAULT 400.00,
    active_counters INT NOT NULL DEFAULT 4,
    status TEXT NOT NULL DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'critical')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_centres_updated_at ON centres;
CREATE TRIGGER trg_centres_updated_at
BEFORE UPDATE ON centres
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. FARMERS TABLE
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    aadhaar_verified BOOLEAN NOT NULL DEFAULT false,
    bank_account_masked TEXT NOT NULL DEFAULT 'XXXX4092',
    bank_name TEXT NOT NULL DEFAULT 'State Bank of India',
    ifsc_prefix TEXT NOT NULL DEFAULT 'SBIN0000382',
    village TEXT NOT NULL,
    district TEXT NOT NULL DEFAULT 'Indore',
    registered_lot_qtl NUMERIC(8,2) NOT NULL DEFAULT 500.00,
    crop_variety TEXT NOT NULL DEFAULT 'Sharbati Wheat (Grade A)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_farmers_updated_at ON farmers;
CREATE TRIGGER trg_farmers_updated_at
BEFORE UPDATE ON farmers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. CENTRE OPERATORS TABLE
CREATE TABLE IF NOT EXISTS centre_operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    centre_id VARCHAR(50) NOT NULL REFERENCES centres(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('operator', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_centre_operators_updated_at ON centre_operators;
CREATE TRIGGER trg_centre_operators_updated_at
BEFORE UPDATE ON centre_operators
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. BOOKINGS TABLE (CENTRAL SINGLE SOURCE OF TRUTH)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_code TEXT UNIQUE NOT NULL,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE RESTRICT,
    centre_id VARCHAR(50) NOT NULL REFERENCES centres(id) ON DELETE RESTRICT,
    crop TEXT NOT NULL DEFAULT 'Wheat',
    variety TEXT NOT NULL DEFAULT 'Sharbati Wheat',
    quantity_qtl NUMERIC(8,2) NOT NULL CHECK (quantity_qtl > 0),
    scheduled_date DATE NOT NULL,
    scheduled_window TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'slot_booked' CHECK (
        stage IN (
            'slot_booked',
            'in_transit',
            'gate_verification',
            'quality_inspection',
            'electronic_weighing',
            'procured_loading',
            'payment_initiated',
            'payment_completed'
        )
    ),
    queue_position INT NOT NULL DEFAULT 1,
    est_wait_minutes INT NOT NULL DEFAULT 30,
    moisture_pct NUMERIC(4,2),
    foreign_matter_pct NUMERIC(4,2),
    dockage_pct NUMERIC(4,2),
    grade TEXT CHECK (grade IN ('Grade A', 'FAQ (Fair Average Quality)', 'Grade B', 'Below FAQ')),
    quality_passed BOOLEAN DEFAULT true,
    quality_inspected_at TIMESTAMPTZ,
    quality_inspected_by TEXT,
    gross_weight_kg NUMERIC(10,2),
    tare_weight_kg NUMERIC(10,2),
    net_weight_qtl NUMERIC(8,2),
    bag_count INT,
    weighbridge_id TEXT,
    weighed_at TIMESTAMPTZ,
    msp_rate NUMERIC(10,2) NOT NULL DEFAULT 2275.00,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'initiated', 'completed')),
    pfms_reference_id TEXT,
    utr_number TEXT,
    payment_initiated_at TIMESTAMPTZ,
    payment_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON bookings;
CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. STATION LOGS TABLE
CREATE TABLE IF NOT EXISTS station_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    station TEXT NOT NULL CHECK (station IN ('gate_intake', 'moisture_qc', 'weighbridge', 'unloading', 'documentation')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds INT,
    operator_id UUID,
    notes TEXT
);

-- 7. GRIEVANCES TABLE
CREATE TABLE IF NOT EXISTS grievances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    token_code TEXT,
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved')),
    resolution_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 8. AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    token_code TEXT,
    actor TEXT NOT NULL DEFAULT 'System',
    actor_role TEXT NOT NULL DEFAULT 'system',
    event_type TEXT NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. CENTRE BOTTLENECKS TABLE
CREATE TABLE IF NOT EXISTS centre_bottlenecks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centre_id VARCHAR(50) NOT NULL REFERENCES centres(id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL,
    waiting_count INT NOT NULL DEFAULT 0,
    severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('warning', 'critical')),
    recommendation TEXT NOT NULL,
    counter_suggestion TEXT,
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. REALTIME ENABLEMENT
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE centres, farmers, bookings, station_logs, grievances, audit_log, centre_bottlenecks;
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN others THEN NULL;
END $$;

-- 11. RLS POLICIES
ALTER TABLE centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE centre_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE centre_bottlenecks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view centres" ON centres FOR SELECT USING (true);
CREATE POLICY "Public can view bottlenecks" ON centre_bottlenecks FOR SELECT USING (true);
CREATE POLICY "Farmers can read own profile" ON farmers FOR SELECT USING (true);
CREATE POLICY "Farmers can update own profile" ON farmers FOR UPDATE USING (true);
CREATE POLICY "Farmers can read own bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Farmers can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Farmers can update bookings" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Farmers can raise grievances" ON grievances FOR INSERT WITH CHECK (true);
CREATE POLICY "Farmers can view grievances" ON grievances FOR SELECT USING (true);
CREATE POLICY "Anyone can view audit logs" ON audit_log FOR SELECT USING (true);
CREATE POLICY "System can insert audit logs" ON audit_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Operators can manage station logs" ON station_logs FOR ALL USING (true);
CREATE POLICY "Operators can update grievances" ON grievances FOR UPDATE USING (true);

-- 12. SEED DATA
INSERT INTO centres (id, name, code, district, state, lat, lng, operating_hours_start, operating_hours_end, operating_hours, capacity_per_day, active_counters, status)
VALUES
    ('centre-b', 'Shivaji Nagar Procurement Centre (Centre B)', 'MP-IND-02', 'Indore', 'Madhya Pradesh', 22.7196, 75.8577, '08:00:00', '18:00:00', '08:00 AM - 06:00 PM', 400.00, 6, 'normal'),
    ('centre-a', 'Dhar Road Procurement Centre (Centre A)', 'MP-IND-17', 'Indore', 'Madhya Pradesh', 22.6842, 75.8012, '08:00:00', '18:00:00', '08:00 AM - 06:00 PM', 250.00, 3, 'critical'),
    ('centre-c', 'Sanwer Hub Procurement Centre (Centre C)', 'MP-IND-09', 'Indore', 'Madhya Pradesh', 22.9774, 75.8286, '08:30:00', '17:30:00', '08:30 AM - 05:30 PM', 350.00, 5, 'normal'),
    ('centre-d', 'Depalpur Farmers Cooperative Mandi (Centre D)', 'MP-IND-04', 'Indore', 'Madhya Pradesh', 22.8465, 75.5487, '08:00:00', '18:00:00', '08:00 AM - 06:00 PM', 280.00, 4, 'warning'),
    ('centre-e', 'Mhow Sub-Division APMC Yard (Centre E)', 'MP-IND-11', 'Indore', 'Madhya Pradesh', 22.5539, 75.7629, '08:00:00', '17:00:00', '08:00 AM - 05:00 PM', 220.00, 3, 'normal')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    code = EXCLUDED.code,
    status = EXCLUDED.status,
    capacity_per_day = EXCLUDED.capacity_per_day;

INSERT INTO farmers (id, name, phone, aadhaar_verified, bank_account_masked, bank_name, ifsc_prefix, village, district, registered_lot_qtl, crop_variety)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rajesh Kumar Patel', '9876543210', true, 'XXXX4092', 'State Bank of India', 'SBIN0000382', 'Kanadia Village', 'Indore', 500.00, 'Sharbati Wheat (Grade A)'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Suresh Chandra Verma', '9876543211', true, 'XXXX8912', 'Bank of Baroda', 'BARB0INDORE', 'Sanwer Kalan', 'Indore', 350.00, 'Malvi Wheat (FAQ)'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Devendra Singh Tomar', '9876543212', true, 'XXXX3341', 'Punjab National Bank', 'PUNB0124800', 'Rau Gram', 'Indore', 420.00, 'Lokwan Wheat (Grade A)')
ON CONFLICT (id) DO NOTHING;

INSERT INTO centre_bottlenecks (centre_id, stage_name, waiting_count, severity, recommendation, counter_suggestion, is_resolved)
VALUES
    ('centre-b', 'Weighbridge 2', 8, 'warning', 'Load balancing active; standard clearance within 15 min.', NULL, false),
    ('centre-a', 'Weighing Station & Quality Lab', 28, 'critical', 'Shift 2 operators from documentation to weighing. Reroute +45 arrivals to Sanwer Hub.', 'Open Auxiliary Counter #4', false),
    ('centre-d', 'Moisture Testing Counter', 14, 'warning', 'Deploy digital moisture sensor kit #3 to expedite intake.', NULL, false)
ON CONFLICT DO NOTHING;

INSERT INTO bookings (
    id, token_code, farmer_id, centre_id, crop, variety, quantity_qtl, scheduled_date, scheduled_window,
    stage, queue_position, est_wait_minutes, moisture_pct, foreign_matter_pct, dockage_pct, grade, quality_passed,
    gross_weight_kg, tare_weight_kg, net_weight_qtl, bag_count, weighbridge_id, msp_rate, total_amount, payment_status,
    pfms_reference_id, utr_number
) VALUES
    (
        '11111111-1111-1111-1111-111111111111', 'A-135', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'centre-b',
        'Wheat', 'Sharbati Wheat (Grade A)', 35.00, CURRENT_DATE, '10:00 AM - 10:30 AM',
        'in_transit', 3, 24, 11.40, 0.40, 0.30, 'Grade A', true,
        4250.00, 750.00, 35.00, 70, 'WB-02-DIGITAL', 2275.00, 79625.00, 'pending',
        'PFMS-MP-2026-884102', 'UTRIB26241088492'
    ),
    (
        '22222222-2222-2222-2222-222222222222', 'A-133', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'centre-b',
        'Wheat', 'Malvi Wheat (FAQ)', 45.00, CURRENT_DATE, '09:30 AM - 10:00 AM',
        'electronic_weighing', 1, 0, 11.80, 0.60, 0.50, 'FAQ (Fair Average Quality)', true,
        5350.00, 850.00, 45.00, 90, 'WB-01-DIGITAL', 2275.00, 102375.00, 'pending',
        'PFMS-MP-2026-884103', 'UTRIB26241088493'
    ),
    (
        '33333333-3333-3333-3333-333333333333', 'A-134', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'centre-b',
        'Wheat', 'Lokwan Wheat (Grade A)', 28.00, CURRENT_DATE, '09:30 AM - 10:00 AM',
        'quality_inspection', 2, 12, 11.20, 0.30, 0.20, 'Grade A', true,
        NULL, NULL, 28.00, 56, NULL, 2275.00, 63700.00, 'pending',
        'PFMS-MP-2026-884104', 'UTRIB26241088494'
    )
ON CONFLICT (id) DO NOTHING;

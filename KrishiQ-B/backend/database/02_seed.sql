-- ==============================================================================
-- KrishiQ (कृषि-Q) - Database Seed Script (Realistic SIH Demonstration Data)
-- Problem Statement: SIH26032
-- Target Platform: Supabase PostgreSQL
-- ==============================================================================
-- IMPORTANT ARCHITECTURAL NOTE:
-- In production, user identities are created in Supabase Auth (auth.users) via
-- SMS/OTP, which yields a verified UUID linked to public.users(id).
-- The users/farmers records below are application domain records representing
-- realistic Indian procurement stakeholders for testing and SIH demonstration.
-- No authentication bypass is created or implied.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEED CROPS & GOVERNMENT MSP BENCHMARKS (Indore APMC Commodities)
-- ------------------------------------------------------------------------------
INSERT INTO crops (id, name, msp_per_quintal, max_moisture_percent, max_dockage_percent, max_foreign_matter_percent, is_active)
VALUES
    ('c0000001-0000-0000-0000-000000000001', 'Wheat', 2275.00, 12.00, 1.00, 1.50, true),
    ('c0000001-0000-0000-0000-000000000002', 'Paddy', 2183.00, 14.00, 1.50, 2.00, true),
    ('c0000001-0000-0000-0000-000000000003', 'Soybean', 4600.00, 10.00, 2.00, 2.00, true),
    ('c0000001-0000-0000-0000-000000000004', 'Maize', 2090.00, 14.00, 1.50, 1.50, true),
    ('c0000001-0000-0000-0000-000000000005', 'Cotton', 6620.00, 8.00, 2.00, 2.00, true),
    ('c0000001-0000-0000-0000-000000000006', 'Mustard', 5650.00, 9.00, 1.00, 1.00, true)
ON CONFLICT (name) DO UPDATE SET
    msp_per_quintal = EXCLUDED.msp_per_quintal,
    max_moisture_percent = EXCLUDED.max_moisture_percent;

-- ------------------------------------------------------------------------------
-- 2. SEED PROCUREMENT CENTRES (Matching Frontend Indore APMC Mandis)
-- ------------------------------------------------------------------------------
INSERT INTO procurement_centres (id, name, code, district, state, distance_km, latitude, longitude, active_counters, total_capacity_per_day, operating_hours, status)
VALUES
    ('centre-b', 'Indore Main Mandi (Laxmi Bai Nagar)', 'MP-IND-01', 'Indore', 'Madhya Pradesh', 4.2, 22.7533, 75.8647, 8, 450, '08:00 AM - 07:00 PM', 'critical'),
    ('centre-a', 'Sanwer Sub-Mandi Hub', 'MP-IND-02', 'Indore', 'Madhya Pradesh', 11.5, 22.9774, 75.8300, 4, 250, '08:00 AM - 06:00 PM', 'normal'),
    ('centre-c', 'Mhow Krishi Upaj Mandi', 'MP-IND-03', 'Indore', 'Madhya Pradesh', 18.2, 22.5539, 75.7644, 5, 300, '08:00 AM - 06:00 PM', 'warning'),
    ('centre-d', 'Depalpur APMC Centre', 'MP-IND-04', 'Indore', 'Madhya Pradesh', 26.0, 22.8532, 75.5489, 3, 200, '08:30 AM - 05:30 PM', 'normal'),
    ('centre-e', 'Rau Cooperative Procurement Hub', 'MP-IND-05', 'Indore', 'Madhya Pradesh', 7.8, 22.6341, 75.8038, 4, 220, '08:00 AM - 06:00 PM', 'normal')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    code = EXCLUDED.code,
    active_counters = EXCLUDED.active_counters,
    total_capacity_per_day = EXCLUDED.total_capacity_per_day,
    status = EXCLUDED.status;

-- ------------------------------------------------------------------------------
-- 3. SEED DEMO USERS (Farmers, Mandi Operator, District Administrator)
-- ------------------------------------------------------------------------------
INSERT INTO users (id, phone, email, full_name, role, is_active)
VALUES
    ('u0000001-0000-0000-0000-000000000001', '9876543210', 'rajesh.patel@krishiq.in', 'Rajesh Patel', 'farmer', true),
    ('u0000001-0000-0000-0000-000000000002', '9876543211', 'operator.indore@krishiq.in', 'Vikram Singh (Mandi In-charge)', 'centre', true),
    ('u0000001-0000-0000-0000-000000000003', '9876543212', 'admin@krishiq.in', 'District Procurement Officer', 'admin', true),
    ('u0000001-0000-0000-0000-000000000004', '9876543220', 'suresh.verma@krishiq.in', 'Suresh Verma', 'farmer', true)
ON CONFLICT (phone) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- ------------------------------------------------------------------------------
-- 4. SEED FARMER AGRICULTURAL PROFILES & LAND CEILING QUOTAS
-- ------------------------------------------------------------------------------
INSERT INTO farmers (id, user_id, farmer_id_code, village, tehsil, district, state, aadhaar_verified, bank_name, account_number_mask, ifsc_prefix, max_allotment_quintals)
VALUES
    ('f0000001-0000-0000-0000-000000000001', 'u0000001-0000-0000-0000-000000000001', 'MP-IND-2026-8841', 'Rangwasa', 'Rau', 'Indore', 'Madhya Pradesh', true, 'State Bank of India', '4092', 'SBIN0000382', 500.00),
    ('f0000001-0000-0000-0000-000000000002', 'u0000001-0000-0000-0000-000000000004', 'MP-IND-2026-9124', 'Palda', 'Indore', 'Indore', 'Madhya Pradesh', true, 'Punjab National Bank', '7715', 'PUNB0123400', 350.00)
ON CONFLICT (user_id) DO UPDATE SET
    farmer_id_code = EXCLUDED.farmer_id_code,
    village = EXCLUDED.village,
    aadhaar_verified = EXCLUDED.aadhaar_verified;

-- ------------------------------------------------------------------------------
-- 5. SEED INTAKE SLOTS (Full, Nearly-Full, and Available Windows)
-- ------------------------------------------------------------------------------
-- TODAY'S SLOTS (Indore Main Mandi & Sanwer)
INSERT INTO slots (id, centre_id, slot_date, start_time, end_time, time_window, max_capacity, booked_count)
VALUES
    -- Full slot (booked_count == max_capacity -> Red / Disabled in UI)
    ('s0000001-0000-0000-0000-000000000001', 'centre-b', CURRENT_DATE, '08:00:00', '08:30:00', '08:00 - 08:30', 20, 20),
    -- Nearly-full slot (booked_count 18/20 -> Yellow / Filling Fast in UI)
    ('s0000001-0000-0000-0000-000000000002', 'centre-b', CURRENT_DATE, '08:30:00', '09:00:00', '08:30 - 09:00', 20, 18),
    -- Half-full slot
    ('s0000001-0000-0000-0000-000000000003', 'centre-b', CURRENT_DATE, '09:00:00', '09:30:00', '09:00 - 09:30', 20, 10),
    -- Completely available slot (Green in UI)
    ('s0000001-0000-0000-0000-000000000004', 'centre-b', CURRENT_DATE, '09:30:00', '10:00:00', '09:30 - 10:00', 20, 0),
    ('s0000001-0000-0000-0000-000000000005', 'centre-b', CURRENT_DATE, '10:00:00', '10:30:00', '10:00 - 10:30', 20, 2),
    ('s0000001-0000-0000-0000-000000000006', 'centre-b', CURRENT_DATE, '10:30:00', '11:00:00', '10:30 - 11:00', 20, 0),
    -- Sanwer Mandi (Today)
    ('s0000001-0000-0000-0000-000000000007', 'centre-a', CURRENT_DATE, '09:00:00', '09:30:00', '09:00 - 09:30', 20, 5),
    ('s0000001-0000-0000-0000-000000000008', 'centre-a', CURRENT_DATE, '09:30:00', '10:00:00', '09:30 - 10:00', 20, 0)
ON CONFLICT (centre_id, slot_date, time_window) DO UPDATE SET
    booked_count = EXCLUDED.booked_count;

-- TOMORROW'S SLOTS (Demonstrating future booking scheduling)
INSERT INTO slots (id, centre_id, slot_date, start_time, end_time, time_window, max_capacity, booked_count)
VALUES
    ('s0000001-0000-0000-0000-000000000009', 'centre-b', CURRENT_DATE + INTERVAL '1 day', '08:00:00', '08:30:00', '08:00 - 08:30', 20, 5),
    ('s0000001-0000-0000-0000-000000000010', 'centre-b', CURRENT_DATE + INTERVAL '1 day', '08:30:00', '09:00:00', '08:30 - 09:00', 20, 2),
    ('s0000001-0000-0000-0000-000000000011', 'centre-b', CURRENT_DATE + INTERVAL '1 day', '09:00:00', '09:30:00', '09:00 - 09:30', 20, 0),
    ('s0000001-0000-0000-0000-000000000012', 'centre-b', CURRENT_DATE + INTERVAL '1 day', '09:30:00', '10:00:00', '09:30 - 10:00', 20, 0),
    ('s0000001-0000-0000-0000-000000000013', 'centre-a', CURRENT_DATE + INTERVAL '1 day', '09:00:00', '09:30:00', '09:00 - 09:30', 20, 1),
    ('s0000001-0000-0000-0000-000000000014', 'centre-a', CURRENT_DATE + INTERVAL '1 day', '09:30:00', '10:00:00', '09:30 - 10:00', 20, 0)
ON CONFLICT (centre_id, slot_date, time_window) DO UPDATE SET
    booked_count = EXCLUDED.booked_count;

-- DAY AFTER TOMORROW'S SLOTS
INSERT INTO slots (id, centre_id, slot_date, start_time, end_time, time_window, max_capacity, booked_count)
VALUES
    ('s0000001-0000-0000-0000-000000000015', 'centre-b', CURRENT_DATE + INTERVAL '2 days', '08:00:00', '08:30:00', '08:00 - 08:30', 20, 0),
    ('s0000001-0000-0000-0000-000000000016', 'centre-b', CURRENT_DATE + INTERVAL '2 days', '08:30:00', '09:00:00', '08:30 - 09:00', 20, 0)
ON CONFLICT (centre_id, slot_date, time_window) DO UPDATE SET
    booked_count = EXCLUDED.booked_count;

-- ------------------------------------------------------------------------------
-- 6. SEED DEMO BOOKINGS & QUEUE TOKENS
-- ------------------------------------------------------------------------------
-- Active Booking for TODAY: Suresh Verma (Status: Checked-in at Gate -> WAITING)
INSERT INTO bookings (id, booking_number, farmer_id, centre_id, slot_id, slot_date, crop_id, variety, quantity_quintals, booking_status, stage_number)
VALUES
    ('b0000001-0000-0000-0000-000000000001', 'BK-2026-9041', 'f0000001-0000-0000-0000-000000000002', 'centre-b', 's0000001-0000-0000-0000-000000000002', CURRENT_DATE, 'c0000001-0000-0000-0000-000000000001', 'Sharbati Wheat (Grade A)', 60.00, 'CONFIRMED', 3)
ON CONFLICT (booking_number) DO UPDATE SET
    slot_date = EXCLUDED.slot_date;

-- Suresh's Token: Arrived at Mandi Gate -> status 'WAITING'
INSERT INTO queue_tokens (id, booking_id, centre_id, token_number, sequence_number, queue_date, status, assigned_counter, arrived_at, estimated_wait_minutes)
VALUES
    ('t0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'centre-b', 'A101', 1, CURRENT_DATE, 'WAITING', 'Gate 2 - Staging Area', NOW() - INTERVAL '15 minutes', 20)
ON CONFLICT (booking_id) DO UPDATE SET
    status = EXCLUDED.status;

-- Future Booking for TOMORROW: Rajesh Patel (Status: Confirmed -> PENDING_ARRIVAL)
INSERT INTO bookings (id, booking_number, farmer_id, centre_id, slot_id, slot_date, crop_id, variety, quantity_quintals, booking_status, stage_number)
VALUES
    ('b0000001-0000-0000-0000-000000000002', 'BK-2026-9042', 'f0000001-0000-0000-0000-000000000001', 'centre-b', 's0000001-0000-0000-0000-000000000009', CURRENT_DATE + INTERVAL '1 day', 'c0000001-0000-0000-0000-000000000001', 'Sharbati Wheat (Grade A)', 120.00, 'CONFIRMED', 2)
ON CONFLICT (booking_number) DO UPDATE SET
    slot_date = EXCLUDED.slot_date;

-- Rajesh's Token: Future booking -> status 'PENDING_ARRIVAL' (Does not inflate today's live queue)
INSERT INTO queue_tokens (id, booking_id, centre_id, token_number, sequence_number, queue_date, status, assigned_counter, arrived_at, estimated_wait_minutes)
VALUES
    ('t0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002', 'centre-b', 'A102', 1, CURRENT_DATE + INTERVAL '1 day', 'PENDING_ARRIVAL', NULL, NULL, 30)
ON CONFLICT (booking_id) DO UPDATE SET
    status = EXCLUDED.status;

-- ------------------------------------------------------------------------------
-- 7. SEED HISTORICAL COMPLETED BOOKING, WEIGHBRIDGE ASSAY & DBT PAYMENT
-- ------------------------------------------------------------------------------
-- Historical completed booking from 3 days ago (Rajesh Patel - Soybean)
INSERT INTO bookings (id, booking_number, farmer_id, centre_id, slot_id, slot_date, crop_id, variety, quantity_quintals, booking_status, stage_number)
VALUES
    ('b0000001-0000-0000-0000-000000000003', 'BK-2026-8104', 'f0000001-0000-0000-0000-000000000001', 'centre-b', 's0000001-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', 'c0000001-0000-0000-0000-000000000003', 'JS-9560 Soybean', 80.00, 'COMPLETED', 8)
ON CONFLICT (booking_number) DO UPDATE SET
    slot_date = EXCLUDED.slot_date;

-- Certified Weighbridge & Quality Assay
INSERT INTO procurements (id, booking_id, centre_id, operator_id, moisture_percent, dockage_percent, foreign_matter_percent, quality_grade, quality_passed, gross_weight_kg, tare_weight_kg, net_weight_quintals, bag_count, weighbridge_id, procurement_status, completed_at)
VALUES
    ('p0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000003', 'centre-b', 'u0000001-0000-0000-0000-000000000002', 9.40, 1.10, 0.80, 'Grade A', true, 12850.00, 4850.00, 80.00, 160, 'WB-IND-01', 'COMPLETED', NOW() - INTERVAL '3 days')
ON CONFLICT (booking_id) DO NOTHING;

-- Direct Benefit Transfer (DBT) Settlement Record
INSERT INTO payments (id, procurement_id, farmer_id, msp_rate_per_quintal, gross_amount, mandi_fee_deduction, net_payable_amount, bank_name, account_number_mask, ifsc_prefix, pfms_reference_id, utr_number, payment_status, initiated_at, expected_credit_date, completed_at)
VALUES
    ('m0000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 4600.00, 368000.00, 0.00, 368000.00, 'State Bank of India', '4092', 'SBIN0000382', 'PFMS-MP-2026-9920148', 'UTRIB26241088492', 'COMPLETED', NOW() - INTERVAL '3 days', CURRENT_DATE - INTERVAL '2 days', NOW() - INTERVAL '2 days')
ON CONFLICT (procurement_id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 8. SEED NOTIFICATIONS & MANDI BOTTLENECK ADVISORY
-- ------------------------------------------------------------------------------
INSERT INTO notifications (id, user_id, title, message, type, is_read, action_url)
VALUES
    ('n0000001-0000-0000-0000-000000000001', 'u0000001-0000-0000-0000-000000000001', 'Slot Booked for Tomorrow', 'Your appointment for tomorrow at Indore Main Mandi (08:00 - 08:30) is confirmed. Token A102 assigned.', 'info', false, '/farmer/queue'),
    ('n0000001-0000-0000-0000-000000000002', 'u0000001-0000-0000-0000-000000000001', 'Payment Credited ₹3,68,000', 'DBT transfer for 80 Qtl Soybean successfully settled to SBI A/C ending 4092. UTR: UTRIB26241088492.', 'success', true, '/farmer/payments')
ON CONFLICT (id) DO NOTHING;

INSERT INTO centre_bottlenecks (id, centre_id, stage_name, waiting_count, severity, recommendation, counter_suggestion, is_resolved)
VALUES
    ('e0000001-0000-0000-0000-000000000001', 'centre-b', 'Weighbridge 2 (Digital Scale)', 18, 'critical', 'Heavy tractor queue at Inbound Gate. Divert empty outgoing trolleys to Counter 4 to prevent driveway gridlock.', 'Weighbridge 4', false)
ON CONFLICT (id) DO NOTHING;

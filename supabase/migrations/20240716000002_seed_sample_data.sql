-- Insert sample hospitals
INSERT INTO hospitals (id, name, address, phone, email)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Central Hospital', '123 Main St, Central City', '555-1234', 'info@centralhospital.com'),
  ('22222222-2222-2222-2222-222222222222', 'Memorial Medical Center', '456 Oak Ave, Memorial City', '555-5678', 'contact@memorialmedical.org'),
  ('33333333-3333-3333-3333-333333333333', 'St. Mary''s Hospital', '789 Pine Rd, St. Mary', '555-9012', 'admin@stmarys.health'),
  ('44444444-4444-4444-4444-444444444444', 'University Medical Center', '101 College Blvd, University City', '555-3456', 'info@universitymedical.edu'),
  ('55555555-5555-5555-5555-555555555555', 'Community Health Center', '202 Community Dr, Communityville', '555-7890', 'help@communityhealthcenter.org');

-- Insert sample users (would normally be done through auth.users, but for demo purposes)
-- Note: In a real application, you would create users through Supabase Auth and then add profiles

-- Insert sample inventory data
INSERT INTO inventory (hospital_id, blood_type, units_available)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'A+', 45),
  ('11111111-1111-1111-1111-111111111111', 'A-', 12),
  ('11111111-1111-1111-1111-111111111111', 'B+', 30),
  ('11111111-1111-1111-1111-111111111111', 'B-', 5),
  ('11111111-1111-1111-1111-111111111111', 'O+', 60),
  ('11111111-1111-1111-1111-111111111111', 'O-', 10),
  ('11111111-1111-1111-1111-111111111111', 'AB+', 15),
  ('11111111-1111-1111-1111-111111111111', 'AB-', 8),
  
  ('22222222-2222-2222-2222-222222222222', 'A+', 38),
  ('22222222-2222-2222-2222-222222222222', 'A-', 9),
  ('22222222-2222-2222-2222-222222222222', 'B+', 25),
  ('22222222-2222-2222-2222-222222222222', 'B-', 7),
  ('22222222-2222-2222-2222-222222222222', 'O+', 52),
  ('22222222-2222-2222-2222-222222222222', 'O-', 15),
  ('22222222-2222-2222-2222-222222222222', 'AB+', 12),
  ('22222222-2222-2222-2222-222222222222', 'AB-', 6),
  
  ('33333333-3333-3333-3333-333333333333', 'A+', 30),
  ('33333333-3333-3333-3333-333333333333', 'A-', 8),
  ('33333333-3333-3333-3333-333333333333', 'B+', 20),
  ('33333333-3333-3333-3333-333333333333', 'B-', 4),
  ('33333333-3333-3333-3333-333333333333', 'O+', 40),
  ('33333333-3333-3333-3333-333333333333', 'O-', 12),
  ('33333333-3333-3333-3333-333333333333', 'AB+', 10),
  ('33333333-3333-3333-3333-333333333333', 'AB-', 5);

-- Insert sample blood requests
INSERT INTO blood_requests (requesting_hospital_id, fulfilling_hospital_id, blood_type, units_requested, status, request_date)
VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'O+', 3, 'pending', NOW() - INTERVAL '2 days'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'AB-', 1, 'approved', NOW() - INTERVAL '3 days'),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'A+', 2, 'fulfilled', NOW() - INTERVAL '5 days'),
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'B-', 1, 'rejected', NOW() - INTERVAL '7 days'),
  ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'O-', 4, 'pending', NOW() - INTERVAL '1 day');

-- Insert sample deliveries
INSERT INTO deliveries (request_id, driver_name, vehicle_number, estimated_arrival, delivery_status)
VALUES
  ((SELECT id FROM blood_requests WHERE requesting_hospital_id = '22222222-2222-2222-2222-222222222222' AND blood_type = 'AB-'), 'John Smith', 'VAN-1234', NOW() + INTERVAL '2 hours', 'in_transit'),
  ((SELECT id FROM blood_requests WHERE requesting_hospital_id = '33333333-3333-3333-3333-333333333333' AND blood_type = 'A+'), 'Maria Garcia', 'VAN-5678', NOW() - INTERVAL '2 days', 'delivered');
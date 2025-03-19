-- Create tables for Blood Bank Management System

-- Donors table
CREATE TABLE donors (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  date_of_birth DATE,
  blood_type TEXT,
  address TEXT,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_donation TIMESTAMP WITH TIME ZONE,
  total_donations INTEGER DEFAULT 0,
  eligibility_status TEXT DEFAULT 'pending' CHECK (eligibility_status IN ('eligible', 'ineligible', 'pending')),
  eligibility_reason TEXT,
  next_eligible_date TIMESTAMP WITH TIME ZONE
);

-- Medical information for donors
CREATE TABLE medical_info (
  donor_id UUID PRIMARY KEY REFERENCES donors(id),
  weight NUMERIC,
  height NUMERIC,
  allergies TEXT[],
  medications TEXT[],
  medical_conditions TEXT[],
  last_health_check TIMESTAMP WITH TIME ZONE,
  hemoglobin_level NUMERIC,
  blood_pressure TEXT,
  pulse INTEGER
);

-- Donation records
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES donors(id),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  donation_type TEXT NOT NULL CHECK (donation_type IN ('whole blood', 'plasma', 'platelets', 'double red cells')),
  status TEXT NOT NULL CHECK (status IN ('completed', 'deferred', 'cancelled')),
  hemoglobin NUMERIC NOT NULL,
  volume INTEGER NOT NULL,
  notes TEXT
);

-- Donation appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES donors(id),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  type TEXT NOT NULL CHECK (type IN ('donation', 'appointment', 'eligibility'))
);

-- Blood inventory
CREATE TABLE blood_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_type TEXT NOT NULL,
  units INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('critical', 'low', 'normal', 'excess')),
  location TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Inventory history for tracking changes
CREATE TABLE inventory_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_type TEXT NOT NULL,
  units INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  location TEXT NOT NULL
);

-- Blood requests
CREATE TABLE blood_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  hospital TEXT NOT NULL,
  blood_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'urgent')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  requester_id UUID NOT NULL REFERENCES auth.users(id),
  approver_id UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  type TEXT NOT NULL CHECK (type IN ('appointment', 'inventory', 'request', 'eligibility', 'system')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  action_url TEXT,
  action_label TEXT
);

-- Function to update donor's last donation and total donations
CREATE OR REPLACE FUNCTION update_donor_after_donation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE donors
    SET 
      last_donation = NEW.date,
      total_donations = total_donations + 1,
      next_eligible_date = 
        CASE 
          WHEN NEW.donation_type = 'whole blood' THEN NEW.date + INTERVAL '56 days'
          WHEN NEW.donation_type = 'plasma' THEN NEW.date + INTERVAL '28 days'
          WHEN NEW.donation_type = 'platelets' THEN NEW.date + INTERVAL '7 days'
          WHEN NEW.donation_type = 'double red cells' THEN NEW.date + INTERVAL '112 days'
          ELSE NEW.date + INTERVAL '56 days'
        END,
      eligibility_status = 'ineligible'
    WHERE id = NEW.donor_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_donor_after_donation_trigger
AFTER INSERT OR UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_donor_after_donation();

-- Function to update eligibility status based on next_eligible_date
CREATE OR REPLACE FUNCTION update_eligibility_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE donors
  SET eligibility_status = 'eligible'
  WHERE next_eligible_date <= NOW() AND eligibility_status = 'ineligible';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_eligibility_status_trigger
AFTER INSERT OR UPDATE ON donations
FOR EACH STATEMENT
EXECUTE FUNCTION update_eligibility_status();

-- Function to create inventory history record when inventory is updated
CREATE OR REPLACE FUNCTION create_inventory_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO inventory_history (blood_type, units, capacity, location)
  VALUES (NEW.blood_type, NEW.units, NEW.capacity, NEW.location);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_inventory_history_trigger
AFTER UPDATE ON blood_inventory
FOR EACH ROW
WHEN (OLD.units IS DISTINCT FROM NEW.units)
EXECUTE FUNCTION create_inventory_history();

-- Function to update blood inventory status based on units/capacity ratio
CREATE OR REPLACE FUNCTION update_inventory_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status := 
    CASE 
      WHEN NEW.units::float / NEW.capacity < 0.2 THEN 'critical'
      WHEN NEW.units::float / NEW.capacity < 0.4 THEN 'low'
      WHEN NEW.units::float / NEW.capacity < 0.8 THEN 'normal'
      ELSE 'excess'
    END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_status_trigger
BEFORE INSERT OR UPDATE ON blood_inventory
FOR EACH ROW
EXECUTE FUNCTION update_inventory_status();

-- Function to create notification when inventory is critical
CREATE OR REPLACE FUNCTION create_inventory_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'critical' AND (OLD.status IS NULL OR OLD.status != 'critical') THEN
    INSERT INTO notifications (user_id, title, message, type, priority, action_url, action_label)
    SELECT 
      id, 
      'Low Inventory Alert', 
      NEW.blood_type || ' blood type is at critical level (' || NEW.units || ' units)', 
      'inventory', 
      'urgent', 
      '/inventory', 
      'View Inventory'
    FROM auth.users
    WHERE id IN (SELECT id FROM donors WHERE eligibility_status = 'eligible' AND blood_type = NEW.blood_type);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_inventory_notification_trigger
AFTER INSERT OR UPDATE ON blood_inventory
FOR EACH ROW
EXECUTE FUNCTION create_inventory_notification();

-- Function to create notification when a request is created
CREATE OR REPLACE FUNCTION create_request_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify admins about new request
  INSERT INTO notifications (user_id, title, message, type, priority, action_url, action_label)
  SELECT 
    id, 
    'New Blood Request', 
    NEW.hospital || ' requested ' || NEW.quantity || ' units of ' || NEW.blood_type, 
    'request', 
    CASE NEW.priority
      WHEN 'high' THEN 'high'
      WHEN 'medium' THEN 'medium'
      ELSE 'low'
    END, 
    '/requests', 
    'View Request'
  FROM auth.users
  WHERE id IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_request_notification_trigger
AFTER INSERT ON blood_requests
FOR EACH ROW
EXECUTE FUNCTION create_request_notification();

-- Function to create notification when a request status changes
CREATE OR REPLACE FUNCTION create_request_status_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    -- Notify requester about status change
    INSERT INTO notifications (user_id, title, message, type, priority, action_url, action_label)
    VALUES (
      NEW.requester_id, 
      'Request Status Updated', 
      'Your request for ' || NEW.quantity || ' units of ' || NEW.blood_type || ' has been ' || NEW.status, 
      'request', 
      'medium', 
      '/requests', 
      'View Request'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_request_status_notification_trigger
AFTER UPDATE ON blood_requests
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION create_request_status_notification();

-- Function to create notification for upcoming appointments
CREATE OR REPLACE FUNCTION create_appointment_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for the appointment
  INSERT INTO notifications (user_id, title, message, type, priority, action_url, action_label)
  VALUES (
    NEW.donor_id, 
    'Appointment Scheduled', 
    'You have a ' || NEW.type || ' scheduled on ' || NEW.date || ' at ' || NEW.time, 
    'appointment', 
    'medium', 
    '/appointments', 
    'View Appointment'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_appointment_notification_trigger
AFTER INSERT ON appointments
FOR EACH ROW
EXECUTE FUNCTION create_appointment_notification();

-- Function to get donation trends
CREATE OR REPLACE FUNCTION get_donation_trends(start_date TIMESTAMP WITH TIME ZONE)
RETURNS TABLE (date DATE, count BIGINT, donation_type TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC('day', d.date)::DATE, 
    COUNT(*)::BIGINT, 
    d.donation_type
  FROM donations d
  WHERE d.date >= start_date AND d.status = 'completed'
  GROUP BY DATE_TRUNC('day', d.date)::DATE, d.donation_type
  ORDER BY DATE_TRUNC('day', d.date)::DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to get request trends
CREATE OR REPLACE FUNCTION get_request_trends(start_date TIMESTAMP WITH TIME ZONE)
RETURNS TABLE (date DATE, count BIGINT, status TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC('day', r.request_date)::DATE, 
    COUNT(*)::BIGINT, 
    r.status
  FROM blood_requests r
  WHERE r.request_date >= start_date
  GROUP BY DATE_TRUNC('day', r.request_date)::DATE, r.status
  ORDER BY DATE_TRUNC('day', r.request_date)::DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to get blood type distribution
CREATE OR REPLACE FUNCTION get_blood_type_distribution()
RETURNS TABLE (blood_type TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.blood_type, 
    COUNT(*)::BIGINT
  FROM donors d
  WHERE d.blood_type IS NOT NULL
  GROUP BY d.blood_type
  ORDER BY COUNT(*) DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get hospital request distribution
CREATE OR REPLACE FUNCTION get_hospital_request_distribution()
RETURNS TABLE (hospital TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.hospital, 
    COUNT(*)::BIGINT
  FROM blood_requests r
  GROUP BY r.hospital
  ORDER BY COUNT(*) DESC;
END;
$$ LANGUAGE plpgsql;

-- Initial data for blood inventory
INSERT INTO blood_inventory (blood_type, units, capacity, location) VALUES
('A+', 45, 100, 'Central Blood Bank'),
('A-', 12, 50, 'Central Blood Bank'),
('B+', 30, 80, 'Central Blood Bank'),
('B-', 5, 40, 'Central Blood Bank'),
('AB+', 15, 30, 'Central Blood Bank'),
('AB-', 8, 20, 'Central Blood Bank'),
('O+', 60, 120, 'Central Blood Bank'),
('O-', 10, 60, 'Central Blood Bank');

-- Create RLS policies

-- Donors table policies
CREATE POLICY "Donors are viewable by authenticated users" ON donors
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Donors can update their own profile" ON donors
  FOR UPDATE USING (auth.uid() = id);

-- Medical info policies
CREATE POLICY "Medical info is viewable by the donor and admins" ON medical_info
  FOR SELECT USING (
    auth.uid() = donor_id OR 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Medical info can be updated by the donor and admins" ON medical_info
  FOR UPDATE USING (
    auth.uid() = donor_id OR 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Medical info can be inserted by the donor and admins" ON medical_info
  FOR INSERT WITH CHECK (
    auth.uid() = donor_id OR 
    auth.jwt() ->> 'role' = 'admin'
  );

-- Donations policies
CREATE POLICY "Donations are viewable by authenticated users" ON donations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Donations can be inserted by admins" ON donations
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Donations can be updated by admins" ON donations
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Appointments policies
CREATE POLICY "Appointments are viewable by the donor and admins" ON appointments
  FOR SELECT USING (
    auth.uid() = donor_id OR 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Appointments can be inserted by the donor and admins" ON appointments
  FOR INSERT WITH CHECK (
    auth.uid() = donor_id OR 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Appointments can be updated by the donor and admins" ON appointments
  FOR UPDATE USING (
    auth.uid() = donor_id OR 
    auth.jwt() ->> 'role' = 'admin'
  );

-- Blood inventory policies
CREATE POLICY "Blood inventory is viewable by authenticated users" ON blood_inventory
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Blood inventory can be updated by admins" ON blood_inventory
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Blood inventory can be inserted by admins" ON blood_inventory
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Inventory history policies
CREATE POLICY "Inventory history is viewable by authenticated users" ON inventory_history
  FOR SELECT USING (auth.role() = 'authenticated');

-- Blood requests policies
CREATE POLICY "Blood requests are viewable by authenticated users" ON blood_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Blood requests can be inserted by authenticated users" ON blood_requests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Blood requests can be updated by the requester and admins" ON blood_requests
  FOR UPDATE USING (
    auth.uid() = requester_id OR 
    auth.jwt() ->> 'role' = 'admin'
  );

-- Notifications policies
CREATE POLICY "Notifications are viewable by the user they are for" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Notifications can be updated by the user they are for" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Notifications can be deleted by the user they are for" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

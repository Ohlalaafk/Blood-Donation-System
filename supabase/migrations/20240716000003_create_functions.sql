-- Function to update inventory when a donation is made
CREATE OR REPLACE FUNCTION update_inventory_after_donation()
RETURNS TRIGGER AS $$
BEGIN
  -- Get donor's blood type
  DECLARE donor_blood_type VARCHAR(3);
  BEGIN
    SELECT blood_type INTO donor_blood_type FROM profiles WHERE id = NEW.donor_id;
    
    -- Update inventory
    UPDATE inventory
    SET units_available = units_available + (NEW.blood_volume_ml / 450) -- Assuming 450ml is one unit
    WHERE hospital_id = NEW.hospital_id AND blood_type = donor_blood_type;
    
    -- If no inventory record exists, create one
    IF NOT FOUND THEN
      INSERT INTO inventory (hospital_id, blood_type, units_available)
      VALUES (NEW.hospital_id, donor_blood_type, NEW.blood_volume_ml / 450);
    END IF;
    
    -- Update donor's last donation date
    UPDATE profiles
    SET last_donation_date = NEW.donation_date
    WHERE id = NEW.donor_id;
    
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update inventory after donation
CREATE TRIGGER update_inventory_after_donation_trigger
AFTER INSERT ON donations
FOR EACH ROW
EXECUTE FUNCTION update_inventory_after_donation();

-- Function to update inventory when a blood request is fulfilled
CREATE OR REPLACE FUNCTION update_inventory_after_request_fulfilled()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'fulfilled' AND (OLD.status IS NULL OR OLD.status <> 'fulfilled') THEN
    -- Decrease inventory at fulfilling hospital
    UPDATE inventory
    SET units_available = units_available - NEW.units_requested
    WHERE hospital_id = NEW.fulfilling_hospital_id AND blood_type = NEW.blood_type;
    
    -- Increase inventory at requesting hospital
    UPDATE inventory
    SET units_available = units_available + NEW.units_requested
    WHERE hospital_id = NEW.requesting_hospital_id AND blood_type = NEW.blood_type;
    
    -- If no inventory record exists at requesting hospital, create one
    IF NOT FOUND THEN
      INSERT INTO inventory (hospital_id, blood_type, units_available)
      VALUES (NEW.requesting_hospital_id, NEW.blood_type, NEW.units_requested);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update inventory after request is fulfilled
CREATE TRIGGER update_inventory_after_request_fulfilled_trigger
AFTER UPDATE ON blood_requests
FOR EACH ROW
EXECUTE FUNCTION update_inventory_after_request_fulfilled();

-- Function to create notification for low inventory
CREATE OR REPLACE FUNCTION create_low_inventory_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if inventory is low (less than 10 units)
  IF NEW.units_available < 10 AND (OLD.units_available IS NULL OR OLD.units_available >= 10) THEN
    -- Get hospital staff for this hospital
    INSERT INTO notifications (user_id, message)
    SELECT p.id, 'Low inventory alert: ' || NEW.blood_type || ' blood type is at critical level (' || NEW.units_available || ' units)'
    FROM profiles p
    WHERE p.hospital_id = NEW.hospital_id AND (p.role = 'admin' OR p.role = 'hospital_staff');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification for low inventory
CREATE TRIGGER create_low_inventory_notification_trigger
AFTER INSERT OR UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION create_low_inventory_notification();

-- Function to create notification for new blood request
CREATE OR REPLACE FUNCTION create_blood_request_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify staff at fulfilling hospital
  IF NEW.fulfilling_hospital_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, message)
    SELECT p.id, 'New blood request: ' || 
           (SELECT name FROM hospitals WHERE id = NEW.requesting_hospital_id) || 
           ' has requested ' || NEW.units_requested || ' units of ' || NEW.blood_type || ' blood.'
    FROM profiles p
    WHERE p.hospital_id = NEW.fulfilling_hospital_id AND (p.role = 'admin' OR p.role = 'hospital_staff');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification for new blood request
CREATE TRIGGER create_blood_request_notification_trigger
AFTER INSERT ON blood_requests
FOR EACH ROW
EXECUTE FUNCTION create_blood_request_notification();

-- Function to create notification for request status change
CREATE OR REPLACE FUNCTION create_request_status_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status <> OLD.status THEN
    -- Notify staff at requesting hospital
    INSERT INTO notifications (user_id, message)
    SELECT p.id, 'Blood request status updated: Your request for ' || 
           NEW.units_requested || ' units of ' || NEW.blood_type || 
           ' blood has been ' || NEW.status || '.'
    FROM profiles p
    WHERE p.hospital_id = NEW.requesting_hospital_id AND (p.role = 'admin' OR p.role = 'hospital_staff');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification for request status change
CREATE TRIGGER create_request_status_notification_trigger
AFTER UPDATE ON blood_requests
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION create_request_status_notification();
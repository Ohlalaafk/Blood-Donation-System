-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL UNIQUE,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'hospital_staff', 'donor')),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  phone VARCHAR(15) UNIQUE,
  date_of_birth DATE,
  blood_type VARCHAR(3) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
  address VARCHAR(255),
  last_donation_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blood_pressure VARCHAR(20),
  hemoglobin_level DECIMAL(5,2),
  heart_rate INTEGER,
  weight_kg DECIMAL(5,2),
  height_cm DECIMAL(5,2),
  disease_history TEXT,
  current_medications TEXT,
  last_checkup_date DATE,
  eligible_to_donate BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  donation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blood_volume_ml INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  blood_type VARCHAR(3) NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
  units_available INTEGER NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blood_requests table
CREATE TABLE IF NOT EXISTS blood_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requesting_hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  fulfilling_hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  blood_type VARCHAR(3) NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
  units_requested INTEGER NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'fulfilled')) DEFAULT 'pending',
  request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
  driver_name VARCHAR(100) NOT NULL,
  vehicle_number VARCHAR(50) NOT NULL,
  estimated_arrival TIMESTAMP WITH TIME ZONE NOT NULL,
  delivery_status VARCHAR(10) NOT NULL CHECK (delivery_status IN ('in_transit', 'delivered', 'failed')) DEFAULT 'in_transit',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status VARCHAR(6) NOT NULL CHECK (status IN ('unread', 'read')) DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Hospitals are viewable by all authenticated users"
ON hospitals FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Profiles are viewable by all authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Health records are viewable by hospital staff and the donor"
ON health_records FOR SELECT
TO authenticated
USING (
  auth.uid() = donor_id OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'hospital_staff')
  )
);

CREATE POLICY "Donations are viewable by all authenticated users"
ON donations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Inventory is viewable by all authenticated users"
ON inventory FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Blood requests are viewable by all authenticated users"
ON blood_requests FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Deliveries are viewable by all authenticated users"
ON deliveries FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table hospitals;
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table health_records;
alter publication supabase_realtime add table donations;
alter publication supabase_realtime add table inventory;
alter publication supabase_realtime add table blood_requests;
alter publication supabase_realtime add table deliveries;
alter publication supabase_realtime add table notifications;
-- Create donors table if it doesn't exist
CREATE TABLE IF NOT EXISTS donors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  date_of_birth TEXT,
  blood_type TEXT,
  address TEXT,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_donation TIMESTAMP WITH TIME ZONE,
  total_donations INTEGER DEFAULT 0,
  eligibility_status TEXT DEFAULT 'pending',
  eligibility_reason TEXT,
  next_eligible_date TIMESTAMP WITH TIME ZONE
);

-- Create medical_info table if it doesn't exist
CREATE TABLE IF NOT EXISTS medical_info (
  donor_id TEXT PRIMARY KEY REFERENCES donors(id),
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

-- Create donations table if it doesn't exist
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id TEXT REFERENCES donors(id),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  donation_type TEXT NOT NULL,
  status TEXT NOT NULL,
  hemoglobin NUMERIC,
  volume NUMERIC,
  notes TEXT
);

-- Create appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id TEXT REFERENCES donors(id),
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL,
  type TEXT NOT NULL
);

-- Enable row level security
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public donors access";
CREATE POLICY "Public donors access"
ON donors FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public medical_info access";
CREATE POLICY "Public medical_info access"
ON medical_info FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public donations access";
CREATE POLICY "Public donations access"
ON donations FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public appointments access";
CREATE POLICY "Public appointments access"
ON appointments FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Insert donors access";
CREATE POLICY "Insert donors access"
ON donors FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Insert medical_info access";
CREATE POLICY "Insert medical_info access"
ON medical_info FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Insert donations access";
CREATE POLICY "Insert donations access"
ON donations FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Insert appointments access";
CREATE POLICY "Insert appointments access"
ON appointments FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Update donors access";
CREATE POLICY "Update donors access"
ON donors FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Update medical_info access";
CREATE POLICY "Update medical_info access"
ON medical_info FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Update donations access";
CREATE POLICY "Update donations access"
ON donations FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Update appointments access";
CREATE POLICY "Update appointments access"
ON appointments FOR UPDATE
USING (true);

-- Enable realtime
alter publication supabase_realtime add table donors;
alter publication supabase_realtime add table medical_info;
alter publication supabase_realtime add table donations;
alter publication supabase_realtime add table appointments;
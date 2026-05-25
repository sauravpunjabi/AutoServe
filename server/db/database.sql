CREATE DATABASE autoserve;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR NOT NULL CHECK (role IN ('customer', 'mechanic', 'manager', 'admin')),
  phone VARCHAR,
  service_center_id UUID,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  manager_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key after service_centers is created to avoid circular dependency
ALTER TABLE users ADD CONSTRAINT fk_service_center FOREIGN KEY (service_center_id) REFERENCES service_centers(id);

CREATE TABLE IF NOT EXISTS service_center_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_center_id UUID REFERENCES service_centers(id),
  customer_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES users(id),
  make VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  year INTEGER NOT NULL,
  license_plate VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES users(id),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  service_center_id UUID REFERENCES service_centers(id),
  service_type VARCHAR NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TIME NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','completed')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID UNIQUE REFERENCES service_bookings(id),
  mechanic_id UUID REFERENCES users(id),
  status VARCHAR DEFAULT 'open' CHECK (status IN ('open','in_progress','completed')),
  labor_cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_card_id UUID REFERENCES job_cards(id),
  description TEXT NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_center_id UUID REFERENCES service_centers(id),
  part_id UUID REFERENCES parts(id),
  quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(service_center_id, part_id)
);

CREATE TABLE IF NOT EXISTS job_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_card_id UUID REFERENCES job_cards(id),
  part_id UUID REFERENCES parts(id),
  quantity_used INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_card_id UUID UNIQUE REFERENCES job_cards(id),
  booking_id UUID REFERENCES service_bookings(id),
  customer_id UUID REFERENCES users(id),
  labor_cost DECIMAL(10,2),
  parts_cost DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  status VARCHAR DEFAULT 'unpaid' CHECK (status IN ('paid','unpaid')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_bookings_customer_id ON service_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_center_id ON service_bookings(service_center_id);
CREATE INDEX IF NOT EXISTS idx_job_cards_mechanic_id ON job_cards(mechanic_id);
CREATE INDEX IF NOT EXISTS idx_inventory_service_center_id ON inventory(service_center_id);
CREATE INDEX IF NOT EXISTS idx_users_service_center_id ON users(service_center_id);

CREATE TABLE IF NOT EXISTS password_resets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);

-- Multi-service booking system
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES service_bookings(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO services (name, description, base_price, duration_minutes) VALUES
  ('Oil Change', 'Full synthetic oil change with filter replacement', 799.00, 45),
  ('Tire Rotation', 'Rotate all four tires for even wear', 499.00, 30),
  ('Brake Inspection', 'Full brake system inspection and report', 599.00, 60),
  ('Brake Pad Replacement', 'Replace front and rear brake pads', 1999.00, 90),
  ('Wheel Alignment', 'Four-wheel alignment check and adjustment', 899.00, 60),
  ('Battery Check & Replacement', 'Battery health test and replacement if needed', 1499.00, 30),
  ('AC Service', 'Air conditioning gas recharge and inspection', 1299.00, 60),
  ('General Inspection', 'Full vehicle health checkup and report', 699.00, 90),
  ('Coolant Flush', 'Drain and replace engine coolant', 799.00, 45),
  ('Transmission Service', 'Transmission fluid check and replacement', 2499.00, 120)
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_booking_services_booking_id ON booking_services(booking_id);

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS services_total DECIMAL(10,2) DEFAULT 0;

CREATE TABLE IF NOT EXISTS pending_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  role VARCHAR NOT NULL,
  phone VARCHAR,
  token VARCHAR UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

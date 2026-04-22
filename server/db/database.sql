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
  vehicle_id UUID REFERENCES vehicles(id),
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

-- Run this against your autoserve database to apply the multi-service booking migration.

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

-- Vehicle photo support
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS photo_url TEXT;

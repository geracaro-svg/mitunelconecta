-- Crear tabla para solicitudes de certificación
CREATE TABLE IF NOT EXISTS tunnel_certifications (
  id SERIAL PRIMARY KEY,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  location TEXT NOT NULL,
  hectares DECIMAL(10,2),
  inspection_date DATE,
  observations TEXT,
  certification_fee DECIMAL(10,2) DEFAULT 5000,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_tunnel_certifications_status ON tunnel_certifications(status);
CREATE INDEX IF NOT EXISTS idx_tunnel_certifications_created_at ON tunnel_certifications(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE tunnel_certifications ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserciones públicas (para formularios)
CREATE POLICY "Allow public inserts" ON tunnel_certifications
  FOR INSERT WITH CHECK (true);

-- Política para permitir lecturas públicas (opcional, dependiendo de necesidades)
CREATE POLICY "Allow public reads" ON tunnel_certifications
  FOR SELECT USING (true);